import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

// Database setup: PostgreSQL Pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:68391975@localhost:5432/water_watch",
});

// Hash code helper to generate unique numeric IDs from location strings
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// In-memory cache for mapping generated dwsId back to location strings
const dwsIdToLocation = new Map<number, string>();

// Geographic tokens set for strict fallback matching
let geographicTokens: Set<string> = new Set();

// Helper to convert strings to clean Title Case
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, (m) => m.toUpperCase());
}

async function loadGeographicTokens(): Promise<void> {
  try {
    const res = await pool.query(
      `SELECT DISTINCT dws_name as name 
       FROM raw_dwsp_data`
    );
    const generic = new Set([
      "SUPPLY", "WELL", "WATER", "SYSTEM", "DRINKING", "PLANT", "FACILITY", "DISTRIBUTION",
      "SCHOOL", "PUBLIC", "CATHOLIC", "HIGH", "ELEMENTARY", "SECONDARY", "COLLEGIATE",
      "ACADEMY", "INSTITUTE", "BOARD", "DISTRICT", "OF", "AND", "THE", "CORPORATION",
      "TOWNSHIP", "CITY", "TOWN", "REGIONAL", "COUNTY", "MUNICIPALITY", "MUNICIPAL",
      "CLASS", "PORTABLE", "DAYCARE", "CARE", "CENTRE", "CENTER", "KIDS", "CHILD",
      "CHILDCARE", "LEARNING", "ACRES", "ROAD", "STREET", "AVENUE", "WAY", "DRIVE", "COURT",
      "CES", "SS", "CI", "ES", "PS", "HS", "YMCA", "YWCA", "INC", "CORP", "LTD", "CO", "CAMP",
      "CAMPUS", "ASSOCIATION", "DISTRICT", "SCHOOLS", "REGION", "REGIONAL", "MUNICIPALITIES",
      "COMMUNITY", "LIVING", "SERVICES", "SERVICE", "HEALTH", "UNIT", "CHURCH", "PARISH",
      "STREET", "ST", "AVE", "RD", "HAMLET", "HEIGHTS", "VALLEY", "SPRINGS", "PARK", "UNION",
      "FACTORY", "LAKEVIEW", "FAIRYVIEW", "WOODWARD", "CENTRAL", "MIDDLE", "UPPER", "LOWER",
      "EAST", "WEST", "NORTH", "SOUTH", "PRIMARY", "SECONDARY", "AREA", "LAKE", 'RIVER',
      "BAY", "POINT", "ISLAND", "PORT", "GLEN", "FALLS", "SHORE", "SHORES", "DAVID", "CLARK",
      "HARRIS", "HORGAN", "KIRBY", "LEMIEUX", "BRITANNIA", "LORNE", "WALTER", "FALLS-NIAGARA",
      "HARROW-COLCHESTER"
    ]);
    const tokens = new Set<string>();
    for (const row of res.rows) {
      if (!row.name) continue;
      const words = row.name.toUpperCase().replace(/[^A-Z0-9\s-]/g, " ").split(/[\s-]+/);
      for (const w of words) {
        if (w.length > 2 && !generic.has(w)) {
          tokens.add(w);
        }
      }
    }
    geographicTokens = tokens;
    console.log(`Loaded ${geographicTokens.size} valid geographic tokens for fallback matching.`);
  } catch (err) {
    console.error("Failed to load geographic tokens:", err);
  }
}


async function getLocationNameByDwsId(dwsId: number): Promise<string | null> {
  if (dwsIdToLocation.has(dwsId)) {
    return dwsIdToLocation.get(dwsId) || null;
  }
  // Lazy-load from DB if not found
  try {
    const res = await pool.query("SELECT DISTINCT location FROM water_quality_data");
    for (const row of res.rows) {
      dwsIdToLocation.set(hashCode(row.location), row.location);
    }
  } catch (err) {
    console.error("Error loading location map:", err);
  }
  return dwsIdToLocation.get(dwsId) || null;
}

// Health risk thresholds (legal limits included)
const HEALTH_RISK_MAP: Record<string, { low: number; moderate: number; high: number; unit: string; legalLimit: number; healthGuideline: number }> = {
  "lead": { low: 5, moderate: 10, high: 15, unit: "µg/L", legalLimit: 15, healthGuideline: 0 },
  "arsenic": { low: 5, moderate: 10, high: 25, unit: "µg/L", legalLimit: 10, healthGuideline: 0.5 },
  "nitrate": { low: 3, moderate: 5, high: 10, unit: "mg/L", legalLimit: 10, healthGuideline: 5 },
  "nitrite": { low: 0.5, moderate: 1, high: 3, unit: "mg/L", legalLimit: 3, healthGuideline: 1 },
  "trihalomethanes": { low: 40, moderate: 60, high: 100, unit: "µg/L", legalLimit: 100, healthGuideline: 40 },
  "haloacetic": { low: 40, moderate: 60, high: 80, unit: "µg/L", legalLimit: 80, healthGuideline: 40 },
  "fluoride": { low: 0.7, moderate: 1.0, high: 1.5, unit: "mg/L", legalLimit: 1.5, healthGuideline: 0.7 },
  "copper": { low: 500, moderate: 1000, high: 1300, unit: "µg/L", legalLimit: 1300, healthGuideline: 500 },
};

function getHealthRisk(parameterName: string, avgLevel: number | null) {
  if (avgLevel === null) return { riskLevel: "low", legalLimit: 0, healthGuideline: 0 };
  const norm = parameterName.toLowerCase();
  for (const [k, v] of Object.entries(HEALTH_RISK_MAP)) {
    if (norm.includes(k)) {
      if (avgLevel >= v.high) return { riskLevel: "high", legalLimit: v.legalLimit, healthGuideline: v.healthGuideline };
      if (avgLevel >= v.moderate) return { riskLevel: "moderate", legalLimit: v.legalLimit, healthGuideline: v.healthGuideline };
      return { riskLevel: "low", legalLimit: v.legalLimit, healthGuideline: v.healthGuideline };
    }
  }
  return { riskLevel: "low", legalLimit: 0, healthGuideline: 0 };
}

const EXCEL_LIMITS: Record<string, string> = {
  "lead": "0.01 MG/L",
  "total coliform": "0 CFU/100ML",
  "boron": "5 MG/L",
  "barium": "1 MG/L",
  "trihalomethanes": "0.1 MG/L",
  "nitrate": "10 MG/L",
  "dichloromethane": "0.05 MG/L",
  "arsenic": "0.01 MG/L",
  "escherichia coli": "0 CFU/100ML",
  "uranium": "0.02 MG/L",
  "glyphosate": "0.28 MG/L",
  "nitrate + nitrite": "10 MG/L",
  "diuron": "0.15 MG/L",
  "tritium": "7000 BQ/L",
  "selenium": "0.05 MG/L",
  "diquat": "0.07 MG/L",
  "chromium": "0.05 MG/L",
  "triallate": "0.23 MG/L",
  "antimony": "0.006 MG/L",
  "nitrite": "1 MG/L",
  "carbofuran": "0.09 MG/L",
  "malathion": "0.19 MG/L",
  "carbaryl": "0.09 MG/L",
  "picloram": "0.19 MG/L",
  "metribuzin": "0.08 MG/L",
  "tetrachloroethylene": "0.01 MG/L",
  "metolachlor": "0.05 MG/L",
  "fluoride": "1.5 MG/L",
  "dimethoate": "0.02 MG/L",
  "azinphos-methyl": "0.02 MG/L",
  "paraquat": "0.01 MG/L",
  "bromoxynil": "0.005 MG/L",
  "trichloroethylene": "0.005 MG/L",
  "benzene": "0.001 MG/L",
  "mercury": "0.001 MG/L",
  "tetrachlorophenol": "0.1 MG/L",
  "dichlorophenol": "0.9 MG/L",
  "pentachlorophenol": "0.06 MG/L",
  "2,4-d": "0.1 MG/L",
  "diazinon": "0.02 MG/L",
  "atrazine": "0.005 MG/L",
  "chlorpyrifos": "0.09 MG/L",
  "simazine": "0.01 MG/L",
  "trifluralin": "0.045 MG/L",
  "dicamba": "0.12 MG/L",
  "diclofop-methyl": "0.009 MG/L",
  "chlorate": "1 MG/L",
  "monochlorobenzene": "0.08 MG/L",
  "vinylidene chloride": "0.014 MG/L",
  "dichlorobenzene": "0.2 MG/L",
  "dichloroethane": "0.005 MG/L",
  "terbufos": "0.001 MG/L",
  "alachlor": "0.005 MG/L",
  "phorate": "0.002 MG/L",
  "trichlorophenol": "0.005 MG/L",
  "cadmium": "0.005 MG/L",
  "pcbs": "0.003 MG/L",
  "mcpa": "0.1 MG/L",
  "vinyl chloride": "0.001 MG/L",
  "chlorite": "1 MG/L",
  "prometryne": "0.001 MG/L",
  "carbon tetrachloride": "0.002 MG/L",
  "benzo(a)pyrene": "0.00001 MG/L",
  "toluene": "0.06 MG/L",
  "ndma": "0.000009 MG/L",
  "bromate": "0.01 MG/L",
  "dioxin": "0.000000015 MG/L"
};

function getParameterLimit(parameterName: string): string {
  const norm = parameterName.toLowerCase().trim();

  // Try matching via keys in EXCEL_LIMITS
  for (const [k, v] of Object.entries(EXCEL_LIMITS)) {
    if (norm.includes(k) || k.includes(norm)) {
      return v;
    }
  }

  // Microbe fallbacks
  if (norm.includes("escherichia") || norm === "e. coli" || (norm.includes("coli") && !norm.includes("coliform"))) {
    return "0 CFU/100ML";
  }
  if (norm.includes("coliform")) {
    return "0 CFU/100ML";
  }

  return "N/A";
}

function getLegalLimitValue(parameterName: string, sampleUnit: string, dbLimit?: string | null): number {
  let limitStr = dbLimit;
  if (!limitStr || limitStr.trim() === "") {
    limitStr = getParameterLimit(parameterName);
  }
  if (!limitStr || limitStr === "N/A" || limitStr.trim() === "") return 0;
  const match = limitStr.trim().match(/^([0-9.]+)\s*(.*)$/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const limitUnit = match[2].trim().toUpperCase();
  const sUnit = (sampleUnit || "").trim().toUpperCase();

  if (sUnit === "UG/L" && limitUnit === "MG/L") {
    return val * 1000;
  }
  if (sUnit === "MG/L" && limitUnit === "UG/L") {
    return val / 1000;
  }
  return val;
}

function extractCityName(location: string, ownerName: string): string | null {
  let name = ownerName || "";
  name = name.replace(/^(city|town|township|municipality|region|county|district|corporation|the corporation of the township of|the corporation of the city of|the corporation of the town of)\s+of\s+/i, "");
  name = name.replace(/\s+(school|board|district|catholic|public|corporation|township|town|city|region|county|municipality|dws|drinking\s+water\s+system)/gi, "");
  name = name.trim();

  if (name.length > 2) {
    return name;
  }

  let loc = location || "";
  const match = loc.match(/(?:TOWN|CITY|TOWNSHIP|MUNICIPALITY)\s+OF\s+([A-Z\s-]+?)(?:\s+|$|\s+-)/i);
  if (match) {
    return match[1].trim();
  }

  const segments = loc.split(/\s+-\s+/);
  if (segments.length > 1) {
    let lastSegment = segments[segments.length - 1];
    lastSegment = lastSegment.replace(/^(city|town|township|municipality|region|county|district|corporation)\s+of\s+/i, "");
    lastSegment = lastSegment.replace(/\s+(drinking\s+water\s+system|well\s+supply|water\s+treatment|facility|system|plant|supply)/gi, "");
    lastSegment = lastSegment.trim();
    if (lastSegment.length > 2) {
      return lastSegment;
    }
  }

  return null;
}

async function startServer() {
  // Pre-load geographic tokens from database
  await loadGeographicTokens();

  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Gemini (optional)
  let genAI: GoogleGenAI | null = null;
  function getGenAI() {
    if (!genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY missing");
      genAI = new GoogleGenAI({ apiKey });
    }
    return genAI;
  }

  // Health
  app.get("/api/health", async (req, res) => {
    try {
      const locRes = await pool.query("SELECT COUNT(DISTINCT location) as cnt FROM water_quality_data");
      const testRes = await pool.query("SELECT COUNT(*) as cnt FROM water_quality_data");
      res.json({
        status: "ok",
        database: "PostgreSQL (water_watch)",
        locations: parseInt(locRes.rows[0].cnt, 10),
        testResults: parseInt(testRes.rows[0].cnt, 10),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });


  // Search locations
  app.get("/api/locations/search", async (req, res) => {
    try {
      const q = (req.query.q as string || "").trim();
      const year = parseInt(req.query.year as string, 10) || 2025;
      if (q.length < 2) return res.json([]);
      const searchRes = await pool.query(
        `SELECT location, MAX(display_name) as display_name 
         FROM water_quality_data 
         WHERE location ILIKE $1 
         GROUP BY location
         LIMIT 40`,
        [`%${q}%`]
      );
      if (searchRes.rows.length === 0) return res.json([]);
      const enriched = await Promise.all(searchRes.rows.map(async (row) => {
        const location = row.location;
        const display_name = row.display_name;
        const dws_id = hashCode(location);
        dwsIdToLocation.set(dws_id, location);
        const statsRes = await pool.query(
          `SELECT 
             COUNT(*) as total,
             SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) as exceeded,
             MAX(owner_name) as owner,
             ARRAY_AGG(DISTINCT sample_type) FILTER (WHERE sample_type IS NOT NULL AND sample_type <> '') as types
           FROM water_quality_data
           WHERE location = $1 AND EXTRACT(YEAR FROM sample_date) = $2`,
          [location, year]
        );
        const total = parseInt(statsRes.rows[0].total || "0", 10);
        const exceeded = parseInt(statsRes.rows[0].exceeded || "0", 10);
        const owner = statsRes.rows[0].owner || "";
        const types = statsRes.rows[0].types || [];
        return {
          dws_id,
          dws_name: location,
          display_name,
          owner_name: owner,
          sample_types: types,
          phu_name: "Ontario Water System",
          dws_category: "Municipal Residential",
          regulation: "O. Reg. 170/03",
          city_hint: null,
          totalTests: total,
          exceedances: exceeded,
          passed: total - exceeded,
          label: location
        };
      }));
      return res.json(enriched);
    } catch (error: any) {
      console.error("Search error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get tests for a specific location
  app.get("/api/locations/:dwsId/tests", async (req, res) => {
    try {
      const dwsId = parseInt(req.params.dwsId, 10);
      if (isNaN(dwsId)) return res.status(400).json({ error: "Invalid DWS ID" });
      const yearFilter = parseInt(req.query.year as string, 10);

      // Get location name from dwsId
      const locationName = await getLocationNameByDwsId(dwsId);
      if (!locationName) return res.status(404).json({ error: "Location not found" });

      // Query distinct owner_name and sample_type for this location name
      const metaRes = await pool.query(
        "SELECT DISTINCT owner_name, sample_type, dwsp_data, display_name FROM water_quality_data WHERE location = $1",
        [locationName]
      );
      const ownerName = metaRes.rows.length > 0 ? (metaRes.rows[0].owner_name || "") : "";
      const sampleTypes = Array.from(new Set(metaRes.rows.map(r => r.sample_type).filter(Boolean)));
      const displayName = metaRes.rows.length > 0 ? metaRes.rows[0].display_name : null;
      let dwspData = metaRes.rows.length > 0 ? (metaRes.rows.find(r => r.dwsp_data !== null)?.dwsp_data || null) : null;
      let isRegionalEstimate = false;
      let estimateCityName: string | null = null;

      if (!dwspData) {
        const tokens: string[] = [];
        const locWords = locationName.toUpperCase()
          .replace(/[^A-Z0-9\s-]/g, " ")
          .split(/[\s-]+/)
          .filter(w => w.length > 2);

        for (const w of locWords) {
          if (geographicTokens.has(w)) {
            tokens.push(w);
          }
        }

        if (ownerName) {
          const ownerWords = ownerName.toUpperCase()
            .replace(/[^A-Z0-9\s-]/g, " ")
            .split(/[\s-]+/)
            .filter(w => w.length > 2);

          for (const w of ownerWords) {
            if (geographicTokens.has(w) && !tokens.includes(w)) {
              tokens.push(w);
            }
          }
        }

        // Loop through tokens to query a sister location with dwsp_data
        for (const token of tokens) {
          const tokenFallback = await pool.query(
            `SELECT dwsp_data FROM water_quality_data 
             WHERE dwsp_data IS NOT NULL 
               AND (location ILIKE $1 OR owner_name ILIKE $1)
             LIMIT 1`,
            [`%${token}%`]
          );
          if (tokenFallback.rows.length > 0 && tokenFallback.rows[0].dwsp_data) {
            dwspData = tokenFallback.rows[0].dwsp_data;
            isRegionalEstimate = true;
            estimateCityName = toTitleCase(token);
            break;
          }
        }
      }

      const locationObj = {
        dws_id: dwsId,
        dws_name: locationName,
        display_name: displayName,
        owner_name: ownerName,
        sample_types: sampleTypes,
        phu_name: "Ontario Water System",
        dws_category: "Municipal Residential",
        regulation: "O. Reg. 170/03",
        city_hint: null,
        dwsp_data: dwspData,
        is_regional_estimate: isRegionalEstimate,
        estimate_city_name: estimateCityName
      };


      // Query tests
      let testsQuery = `
        SELECT 
          parameter_name as contaminant,
          ROUND(AVG(CASE WHEN result_value >= 0 THEN result_value ELSE NULL END)::numeric, 4)::float as level,
          result_unit as unit,
          COUNT(*) as sample_count,
          EXTRACT(YEAR FROM MAX(sample_date))::integer as latest_year,
          SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) as exceedance_count,
          MAX(parameter_limit) as parameter_limit
        FROM water_quality_data
        WHERE location = $1
      `;
      const testsParams: any[] = [locationName];

      if (!isNaN(yearFilter) && yearFilter >= 2016 && yearFilter <= 2025) {
        testsQuery += ` AND EXTRACT(YEAR FROM sample_date) = $2`;
        testsParams.push(yearFilter);
      }

      testsQuery += `
        GROUP BY parameter_name, result_unit
        ORDER BY sample_count DESC
        LIMIT 200
      `;

      const testsRes = await pool.query(testsQuery, testsParams);

      const enhancedTests = testsRes.rows.map(t => {
        const riskInfo = getHealthRisk(t.contaminant, t.level);
        return {
          contaminant: t.contaminant,
          level: t.level,
          unit: t.unit,
          legalLimit: getLegalLimitValue(t.contaminant, t.unit, t.parameter_limit),
          healthGuideline: riskInfo.healthGuideline,
          riskLevel: riskInfo.riskLevel,
          sampleCount: parseInt(t.sample_count, 10),
          latestYear: t.latest_year,
          exceedanceCount: parseInt(t.exceedance_count || "0", 10),
          parameterLimit: t.parameter_limit
        };
      });


      // Query exceedances
      let exceedQuery = `
        SELECT 
          parameter_name, 
          result_value, 
          result_unit, 
          to_char(sample_date, 'YYYY-MM-DD') as sample_date
        FROM water_quality_data
        WHERE location = $1 AND exceedance = 'Y'
      `;
      const exceedParams: any[] = [locationName];

      if (!isNaN(yearFilter) && yearFilter >= 2016 && yearFilter <= 2025) {
        exceedQuery += ` AND EXTRACT(YEAR FROM sample_date) = $2`;
        exceedParams.push(yearFilter);
      }

      exceedQuery += `
        ORDER BY sample_date DESC
        LIMIT 20
      `;

      const exceedRes = await pool.query(exceedQuery, exceedParams);
      const exceedances = exceedRes.rows.map(e => {
        return {
          parameter_name: e.parameter_name,
          result_value: e.result_value,
          result_unit: e.result_unit,
          sample_date: e.sample_date,
          parameter_limit: getParameterLimit(e.parameter_name)
        };
      });

      res.json({ location: locationObj, tests: enhancedTests, exceedances });
    } catch (error: any) {
      console.error("Water data error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Paginated raw water data endpoint
  app.get("/api/water-data", async (req, res) => {
    try {
      const location = req.query.location as string;
      const microbe = (req.query.microbe || req.query.parameter_name) as string;
      const year = parseInt(req.query.year as string, 10);
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      // Special helper parameters for frontend integration
      const distinctLocations = req.query.distinct_locations === "true";
      const q = (req.query.q as string || "").trim();
      const aggregate = req.query.aggregate === "true";

      if (distinctLocations) {
        let locQuery = `
          SELECT 
            location,
            MAX(display_name) as display_name,
            MAX(owner_name) as owner
          FROM water_quality_data
        `;
        const locParams: any[] = [];
        const locWhere: string[] = [];
        if (q) {
          locParams.push(`%${q}%`);
          locWhere.push(`location ILIKE $${locParams.length}`);
        }
        if (!isNaN(year) && year >= 2016 && year <= 2025) {
          locParams.push(year);
          locWhere.push(`EXTRACT(YEAR FROM sample_date) = $${locParams.length}`);
        }
        if (locWhere.length > 0) {
          locQuery += " WHERE " + locWhere.join(" AND ");
        }
        locQuery += `
          GROUP BY location
          ORDER BY location
          LIMIT $${locParams.length + 1} OFFSET $${locParams.length + 2}
        `;
        locParams.push(limit, offset);
        
        const locRes = await pool.query(locQuery, locParams);
        const matchedLocs = locRes.rows.map(r => r.location);

        if (matchedLocs.length === 0) {
          return res.json([]);
        }

        // Query stats & latest sample dates for only these matched locations
        let statsQuery = `
          SELECT 
            location,
            COUNT(*) as total,
            SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) as exceeded,
            ARRAY_AGG(DISTINCT sample_type) FILTER (WHERE sample_type IS NOT NULL AND sample_type <> '') as types,
            TO_CHAR(MAX(sample_date), 'YYYY-MM-DD') as latest_date
          FROM water_quality_data
          WHERE location = ANY($1)
        `;
        const statsParams: any[] = [matchedLocs];

        if (!isNaN(year) && year >= 2016 && year <= 2025) {
          statsQuery += ` AND EXTRACT(YEAR FROM sample_date) = $2`;
          statsParams.push(year);
        }

        statsQuery += ` GROUP BY location`;

        const statsRes = await pool.query(statsQuery, statsParams);
        const statsMap = new Map<string, any>();
        statsRes.rows.forEach(r => {
          statsMap.set(r.location, r);
        });

        const enriched = locRes.rows.map((row) => {
          const loc = row.location;
          const disp = row.display_name;
          const dws_id = hashCode(loc);
          dwsIdToLocation.set(dws_id, loc);

          const stats = statsMap.get(loc) || {};
          const total = parseInt(stats.total || "0", 10);
          const exceeded = parseInt(stats.exceeded || "0", 10);
          const types = stats.types || [];
          const latestDate = stats.latest_date || null;

          return {
            dws_id,
            dws_name: loc,
            display_name: disp,
            owner_name: row.owner || "",
            sample_types: types,
            latest_date: latestDate,
            phu_name: "Ontario Water System",
            dws_category: "Municipal Residential",
            regulation: "O. Reg. 170/03",
            city_hint: null,
            totalTests: total,
            exceedances: exceeded,
            passed: total - exceeded,
            label: loc
          };
        });
        return res.json(enriched);
      }

      if (aggregate && location) {
        // Return aggregated tests & exceedances for a specific location
        let testsQuery = `
          SELECT 
            MAX(parameter_name) as contaminant,
            ROUND(AVG(CASE WHEN result_value >= 0 THEN result_value ELSE NULL END)::numeric, 4)::float as level,
            ROUND(MAX(CASE WHEN result_value >= 0 THEN result_value ELSE NULL END)::numeric, 4)::float as max_level,
            MAX(result_unit) as unit,
            COUNT(*) as sample_count,
            EXTRACT(YEAR FROM MAX(sample_date))::integer as latest_year,
            SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) as exceedance_count,
            MAX(parameter_limit) as parameter_limit
          FROM water_quality_data
          WHERE location = $1
        `;
        const testsParams: any[] = [location];

        if (!isNaN(year) && year >= 2016 && year <= 2025) {
          testsQuery += ` AND EXTRACT(YEAR FROM sample_date) = $2`;
          testsParams.push(year);
        }

        testsQuery += `
          GROUP BY UPPER(TRIM(parameter_name)), UPPER(TRIM(result_unit))
          ORDER BY sample_count DESC
          LIMIT 200
        `;

        const testsRes = await pool.query(testsQuery, testsParams);
        const enhancedTests = testsRes.rows.map(t => {
          const riskInfo = getHealthRisk(t.contaminant, t.level);
          return {
            contaminant: t.contaminant,
            level: t.level,
            maxLevel: t.max_level,
            unit: t.unit,
            legalLimit: getLegalLimitValue(t.contaminant, t.unit, t.parameter_limit),
            healthGuideline: riskInfo.healthGuideline,
            riskLevel: riskInfo.riskLevel,
            sampleCount: parseInt(t.sample_count, 10),
            latestYear: t.latest_year,
            exceedanceCount: parseInt(t.exceedance_count || "0", 10),
            parameterLimit: t.parameter_limit
          };
        });


        let exceedQuery = `
          SELECT DISTINCT
            parameter_name, 
            result_value, 
            result_unit, 
            to_char(sample_date, 'YYYY-MM-DD') as sample_date
          FROM water_quality_data
          WHERE location = $1 AND exceedance = 'Y'
        `;
        const exceedParams: any[] = [location];

        if (!isNaN(year) && year >= 2016 && year <= 2025) {
          exceedQuery += ` AND EXTRACT(YEAR FROM sample_date) = $2`;
          exceedParams.push(year);
        }

        exceedQuery += `
          ORDER BY sample_date DESC
          LIMIT 20
        `;

        const exceedRes = await pool.query(exceedQuery, exceedParams);
        const exceedances = exceedRes.rows.map(e => {
          return {
            parameter_name: e.parameter_name,
            result_value: e.result_value,
            result_unit: e.result_unit,
            sample_date: e.sample_date,
            parameter_limit: getParameterLimit(e.parameter_name)
          };
        });

        const metaRes = await pool.query(
          "SELECT DISTINCT owner_name, sample_type, dwsp_data, display_name FROM water_quality_data WHERE location = $1",
          [location]
        );
        const ownerName = metaRes.rows.length > 0 ? (metaRes.rows[0].owner_name || "") : "";
        const sampleTypes = Array.from(new Set(metaRes.rows.map(r => r.sample_type).filter(Boolean)));
        const displayName = metaRes.rows.length > 0 ? metaRes.rows[0].display_name : null;
        let dwspData = metaRes.rows.length > 0 ? (metaRes.rows.find(r => r.dwsp_data !== null)?.dwsp_data || null) : null;
        let isRegionalEstimate = false;
        let estimateCityName: string | null = null;

        if (!dwspData) {
          const tokens: string[] = [];
          const locWords = location.toUpperCase()
            .replace(/[^A-Z0-9\s-]/g, " ")
            .split(/[\s-]+/)
            .filter(w => w.length > 2);

          for (const w of locWords) {
            if (geographicTokens.has(w)) {
              tokens.push(w);
            }
          }

          if (ownerName) {
            const ownerWords = ownerName.toUpperCase()
              .replace(/[^A-Z0-9\s-]/g, " ")
              .split(/[\s-]+/)
              .filter(w => w.length > 2);

            for (const w of ownerWords) {
              if (geographicTokens.has(w) && !tokens.includes(w)) {
                tokens.push(w);
              }
            }
          }

          // Loop through tokens to query a sister location with dwsp_data
          for (const token of tokens) {
            const tokenFallback = await pool.query(
              `SELECT dwsp_data FROM water_quality_data 
               WHERE dwsp_data IS NOT NULL 
                 AND (location ILIKE $1 OR owner_name ILIKE $1)
               LIMIT 1`,
              [`%${token}%`]
            );
            if (tokenFallback.rows.length > 0 && tokenFallback.rows[0].dwsp_data) {
              dwspData = tokenFallback.rows[0].dwsp_data;
              isRegionalEstimate = true;
              estimateCityName = toTitleCase(token);
              break;
            }
          }
        }

        return res.json({
          location: {
            dws_name: location,
            display_name: displayName,
            owner_name: ownerName,
            sample_types: sampleTypes,
            phu_name: "Ontario Water System",
            dws_category: "Municipal Residential",
            dwsp_data: dwspData,
            is_regional_estimate: isRegionalEstimate,
            estimate_city_name: estimateCityName
          },
          tests: enhancedTests,
          exceedances: exceedances
        });
      }

      // Default raw SQL paginated data
      let query = `
        SELECT DISTINCT
          location, 
          to_char(sample_date, 'YYYY-MM-DD') as sample_date, 
          parameter_name, 
          result_value, 
          result_unit, 
          exceedance,
          parameter_limit
        FROM water_quality_data
      `;
      const params: any[] = [];
      const whereClauses: string[] = [];

      if (location) {
        params.push(location);
        whereClauses.push(`location = $${params.length}`);
      }

      if (microbe) {
        params.push(`%${microbe}%`);
        whereClauses.push(`parameter_name ILIKE $${params.length}`);
      }

      if (!isNaN(year) && year >= 2016 && year <= 2025) {
        params.push(year);
        whereClauses.push(`EXTRACT(YEAR FROM sample_date) = $${params.length}`);
      }

      if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
      }

      query += `
        ORDER BY sample_date DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;
      params.push(limit, offset);

      const dataRes = await pool.query(query, params);
      res.json(dataRes.rows);
    } catch (err: any) {
      console.error("water-data error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Raw DWSP debug data endpoint
  app.get("/api/debug/raw-dwsp", async (req, res) => {
    try {
      const dataRes = await pool.query(`
        SELECT id, dws_name, parameter_name, result_value, result_unit, to_char(sample_date, 'YYYY-MM-DD') as sample_date
        FROM raw_dwsp_data
        ORDER BY dws_name ASC, sample_date DESC
      `);
      res.json(dataRes.rows);
    } catch (err: any) {
      console.error("raw-dwsp debug fetch error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Raw DWSP debug summary stats endpoint
  app.get("/api/debug/summary", async (req, res) => {
    try {
      const summaryRes = await pool.query(`
        SELECT 
          COUNT(*)::integer as total_rows,
          COUNT(DISTINCT dws_name)::integer as unique_systems,
          MIN(CASE WHEN parameter_name = 'HARDNESS' THEN result_value END)::float as hardness_min,
          MAX(CASE WHEN parameter_name = 'HARDNESS' THEN result_value END)::float as hardness_max,
          MIN(CASE WHEN parameter_name = 'IRON' THEN result_value END)::float as iron_min,
          MAX(CASE WHEN parameter_name = 'IRON' THEN result_value END)::float as iron_max,
          MIN(CASE WHEN parameter_name = 'PH' THEN result_value END)::float as ph_min,
          MAX(CASE WHEN parameter_name = 'PH' THEN result_value END)::float as ph_max
        FROM raw_dwsp_data
      `);
      res.json(summaryRes.rows[0]);
    } catch (err: any) {
      console.error("raw-dwsp debug summary error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Main database debug data endpoint
  app.get("/api/debug/main-data", async (req, res) => {
    try {
      const dataRes = await pool.query(`
        SELECT location, MAX(owner_name) as owner_name 
        FROM water_quality_data 
        GROUP BY location 
        ORDER BY location ASC
      `);
      const rows = dataRes.rows.map(r => ({
        location: r.location,
        dws_id: hashCode(r.location),
        owner_name: r.owner_name || "Unknown Owner"
      }));
      res.json(rows);
    } catch (err: any) {
      console.error("main-data debug fetch error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Main database debug summary stats endpoint
  app.get("/api/debug/main-summary", async (req, res) => {
    try {
      const locRes = await pool.query("SELECT COUNT(DISTINCT location)::integer as total_locations FROM water_quality_data");
      const ownerRes = await pool.query("SELECT COUNT(DISTINCT owner_name)::integer as unique_municipalities FROM water_quality_data");
      const columnsRes = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'water_quality_data'");
      const topOwnersRes = await pool.query(`
        SELECT owner_name, COUNT(DISTINCT location)::integer as loc_cnt 
        FROM water_quality_data 
        WHERE owner_name IS NOT NULL AND owner_name != '' 
        GROUP BY owner_name 
        ORDER BY loc_cnt DESC 
        LIMIT 50
      `);

      res.json({
        total_locations: locRes.rows[0].total_locations,
        unique_municipalities: ownerRes.rows[0].unique_municipalities,
        columns: columnsRes.rows.map(c => c.column_name),
        top_owners: topOwnersRes.rows.map(o => o.owner_name)
      });
    } catch (err: any) {
      console.error("main-data debug summary error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Matched database debug data endpoint
  app.get("/api/debug/matched-data", async (req, res) => {
    try {
      const dataRes = await pool.query(`
        SELECT DISTINCT location, dwsp_data
        FROM water_quality_data
        WHERE dwsp_data IS NOT NULL
        ORDER BY location ASC
      `);
      res.json(dataRes.rows);
    } catch (err: any) {
      console.error("matched-data debug fetch error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Matched database debug summary stats endpoint
  app.get("/api/debug/matched-summary", async (req, res) => {
    try {
      const countRes = await pool.query(`
        SELECT COUNT(DISTINCT location)::integer as total_matched_locations
        FROM water_quality_data
        WHERE dwsp_data IS NOT NULL
      `);
      res.json(countRes.rows[0]);
    } catch (err: any) {
      console.error("matched-summary error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // AI endpoint
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const topic = req.body.topic || "water";
      const response = await getGenAI().models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Explain ${topic} in a short, plain way.`,
      });
      res.json({ explanation: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => { console.error(err); process.exit(1); });
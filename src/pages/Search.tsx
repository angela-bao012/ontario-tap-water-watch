import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, CheckCircle2, ChevronRight, ChevronDown, Droplet, Loader2, XCircle, AlertTriangle, ArrowLeft, Microscope, FlaskConical, Heart, Filter, Bell, Check, ExternalLink, ShoppingCart, Eye, Gauge, X, Sparkles, LayoutGrid, BarChart3, Settings, Waves, Smile, Wrench, Shirt, Coffee, GlassWater } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface WaterTest {
  contaminant: string;
  level: number | null;
  maxLevel?: number | null;
  unit: string;
  legalLimit: number;
  healthGuideline: number;
  riskLevel: 'low' | 'moderate' | 'high';
  sampleCount: number;
  latestYear: number;
  exceedanceCount?: number;
  parameterLimit?: string | null;
}

interface LocationResult {
  dws_id: number;
  dws_name: string;
  display_name?: string | null;
  phu_name: string;
  dws_category: string;
  regulation: string;
  city_hint: string | null;
  totalTests?: number;
  exceedances?: number;
  passed?: number;
  label?: string;
  owner_name?: string;
  sample_types?: string[];
  dwsp_data?: {
    matched_system_name: string;
    hardness_avg: number | null;
    iron_avg: number | null;
    ph_avg: number | null;
  } | null;
  is_regional_estimate?: boolean;
  estimate_city_name?: string | null;
  latest_date?: string | null;
}

interface Exceedance {
  parameter_name: string;
  result_value: number;
  result_unit: string;
  sample_date: string;
  parameter_limit: string;
}

interface WaterDataResponse {
  location: any;
  tests: WaterTest[];
  exceedances: Exceedance[];
}

const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016] as const;

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const formatUnitForDisplay = (unit: string): string => {
  if (!unit) return "";
  return unit.replace(/\bug\/l\b/i, "μg/L").replace(/\bug\b/i, "μg").replace(/\bUG\/L\b/i, "μg/L").replace(/\bUG\b/i, "μg");
};

function simplifyName(name: string): string {
  // Remove R243, R170 prefix codes
  let s = name.replace(/^(R\d{3,5}\s+)/i, '').replace(/^R\d{3,5}\s+-\s+/i, '');
  // Remove trailing bracketed codes like (3157), (0000857), (877140)
  s = s.replace(/\s*\([#\d]+\)\s*$/, '');
  // Remove "DRINKING WATER SYSTEM" suffixes
  s = s.replace(/\s+DRINKING WATER SYSTEM(\s*-\s*.*)?$/i, '');
  // Remove "WELL SUPPLY" suffix
  s = s.replace(/\s+WELL SUPPLY\s*$/i, '');
  // Remove leading/trailing whitespace and dashes
  s = s.replace(/^[\s-]+/, '').replace(/[\s-]+$/, '');
  // Lowercase except first letter of each word
  s = s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  // Fix common words
  s = s.replace(/\bOf\b/g, 'of').replace(/\bThe\b/g, 'the').replace(/\bAnd\b/g, 'and').replace(/\bA\b/g, 'a');
  return s;
}

function titleCase(str: string | undefined | null): string {
  if (!str) return "";
  const lowercaseWords = new Set(['of', 'and', 'the', 'for', 'in', 'on', 'at', 'to', 'by', 'with', 'a', 'an']);
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (lowercaseWords.has(cleanWord) && index > 0) {
        return word;
      }
      if (word.includes('-')) {
        return word.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('-');
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatSystemName(name: string): string {
  if (!name) return "";
  const cleanName = name.trim();
  const lower = cleanName.toLowerCase();
  if (
    lower.includes("system") ||
    lower.includes("supply") ||
    lower.includes("well") ||
    lower.includes("distribution") ||
    lower.includes("plant") ||
    lower.includes("facility")
  ) {
    return cleanName;
  }
  return `${cleanName} Water System`;
}

function formatDateStr(dateStr: string | undefined | null): string {
  if (!dateStr) return "";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatParameterName(name: string | undefined | null): string {
  if (!name) return "";
  const s = name.trim();
  const lower = s.toLowerCase();
  
  const exactMap: Record<string, string> = {
    "nitrate (as nitrogen)": "Nitrate (as nitrogen)",
    "nitrite (as nitrogen)": "Nitrite (as nitrogen)",
    "nitrate + nitrite (as nitrogen)": "Nitrate + Nitrite (as nitrogen)",
    "total coliform": "Total Coliform",
    "escherichia coli": "Escherichia Coli",
    "total haloacetic acids": "Total Haloacetic Acids",
    "trihalomethanes (total)": "Trihalomethanes (total)",
    "n-nitrosodimethylamine (ndma)": "N-Nitrosodimethylamine (NDMA)",
    "nitrosodimethylamine (ndma)": "Nitrosodimethylamine (NDMA)",
    "polychlorinated biphenyls (pcbs)": "Polychlorinated Biphenyls (PCBs)",
    "2,4-dichlorophenoxyacetic acid (2,4-d)": "2,4-Dichlorophenoxyacetic Acid (2,4-D)",
    "tetrachloroethylene (perchloroethylene)": "Tetrachloroethylene (perchloroethylene)",
    "1,1-dichloroethylene (vinylidene chloride)": "1,1-Dichloroethylene (vinylidene chloride)",
    "mcpa": "MCPA",
  };
  
  if (exactMap[lower]) {
    return exactMap[lower];
  }
  
  return s
    .split(" ")
    .map((word, index) => {
      if (word.startsWith("(") || word.endsWith(")")) {
        const clean = word.replace(/[()]/g, "").toLowerCase();
        if (clean === "ndma" || clean === "pcbs" || clean === "thms" || clean === "haas" || clean === "thm" || clean === "haa") {
          return word.toUpperCase();
        }
        return word.toLowerCase();
      }
      
      const cleanWord = word.replace(/[^\w]/g, "").toUpperCase();
      if (cleanWord === "NDMA" || cleanWord === "PCBS" || cleanWord === "MCPA" || cleanWord === "THMS" || cleanWord === "HAAS" || cleanWord === "THM" || cleanWord === "HAA") {
        return word.toUpperCase();
      }
      
      if (word.includes("-")) {
        return word.split("-").map((p) => {
          if (/^\d[\d,]*$/.test(p)) return p;
          return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
        }).join("-");
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function formatOwnerName(str: string | undefined | null): string {
  if (!str) return "";
  let s = str.trim().replace(/,+$/, '').trim();
  const commaIndex = s.indexOf(',');
  if (commaIndex !== -1) {
    const baseName = s.substring(0, commaIndex).trim();
    const suffix = s.substring(commaIndex + 1).trim();
    if (/\bof\b/i.test(suffix)) {
      if (/of$/i.test(suffix)) {
        s = `${suffix} ${baseName}`;
      } else {
        const ofMatch = suffix.match(/^(.*?\bof\b)\s+(.+)$/i);
        if (ofMatch) {
          const typePart = ofMatch[1].trim();
          const modifier = ofMatch[2].trim();
          s = `${typePart} ${modifier} ${baseName}`;
        } else {
          s = `${suffix} ${baseName}`;
        }
      }
    }
  }
  const formatted = titleCase(s);
  const lower = formatted.toLowerCase();
  if (lower.endsWith("water system") || lower.endsWith("water systems")) {
    return formatted;
  }
  if (lower.endsWith("system") || lower.endsWith("systems")) {
    return `${formatted.substring(0, formatted.lastIndexOf(" "))} Water System`;
  }
  return `${formatted} Water System`;
}


function formatSampleTypes(types?: string[]): string {
  if (!types || types.length === 0) return "";
  
  const allParts: string[] = [];
  types.forEach(typeStr => {
    // Split by slash "/", semi-colon ";", or dash "-"
    const parts = typeStr.split(/[\/;]|\s+-\s+/);
    parts.forEach(part => {
      const cleaned = part.trim();
      if (cleaned) {
        const formatted = cleaned
          .toLowerCase()
          .replace(/\b\w/g, char => char.toUpperCase())
          .replace(/\bAnd\b/g, 'and')
          .replace(/\bOf\b/g, 'of');
        if (!allParts.includes(formatted)) {
          allParts.push(formatted);
        }
      }
    });
  });
  
  return allParts.join(", ");
}

const parameterDescriptions: Record<string, string> = {
  "escherichia coli": "Bacteria from human or animal waste. If found in tap water, the water is unsafe to drink and can make you very sick with stomach issues.",
  "e. coli": "Bacteria from human or animal waste. If found in tap water, the water is unsafe to drink and can make you very sick with stomach issues.",
  "total coliform": "A group of bacteria found in soil and plants. They are usually harmless themselves, but their presence is a warning sign that dirt or surface water got into the system.",
  "coliform": "A group of bacteria found in soil and plants. They are usually harmless themselves, but their presence is a warning sign that dirt or surface water got into the system.",
  "lead": "A toxic metal that usually leaks into water from old household pipes and plumbing. No amount is safe, and it can harm brain development in kids.",
  "arsenic": "A natural poison found in rocks and soil that can dissolve into well water. Drinking high levels over many years increases cancer risk and skin issues.",
  "nitrate": "A farm chemical from fertilizers and animal waste. High levels are dangerous for babies under six months, making it hard for their blood to carry oxygen.",
  "nitrite": "A toxic chemical related to nitrate. Even small amounts can interfere with how oxygen is carried in the blood.",
  "nitrate + nitrite": "The combined total of farm runoff chemicals. High levels can prevent blood from carrying oxygen properly, which is dangerous for infants.",
  "trihalomethane": "Chemical byproducts created when chlorine used to disinfect water reacts with natural organic debris. Long-term exposure can increase cancer risk.",
  "haloacetic": "Byproducts from using chlorine to sanitize water. Consuming high amounts over a very long time can damage liver or kidneys and increase cancer risk.",
  "fluoride": "A natural mineral added to tap water to help prevent cavities. It is beneficial in low amounts, but too much can stain teeth or weaken bones.",
  "copper": "A metal that leaks into tap water as home copper pipes wear down. Too much copper causes a bitter metallic taste and stomach upset.",
  "hardness": "A measure of calcium and magnesium minerals in the water. It is safe to drink, but causes white mineral crusts on faucets and reduces soap lather.",
  "sodium": "A mineral from salt. High levels are a concern only for people on strict low-sodium diets due to high blood pressure.",
  "turbidity": "A measure of water cloudiness from dirt or clay particles. Cloudy water can block chlorine from killing germs.",
  "chlorine": "A safe bleach-like chemical added to kill germs in water. While necessary, too much of it makes water smell and taste like a swimming pool.",
  "mercury": "A toxic liquid metal from industrial waste. It is very rare in tap water but can cause brain and kidney damage over time.",
  "chromium": "A metal from natural rocks or factory waste. High levels can cause skin rashes and damage kidneys over time.",
  "cadmium": "A heavy metal from battery waste or pipe rust. It accumulates in the body and can damage kidneys and bones over time.",
  "barium": "A natural mineral in rocks. High amounts can raise blood pressure and cause heart rhythm issues.",
  "uranium": "A natural radioactive metal in rock. Drinking it can damage kidneys and expose you to low levels of radiation.",
  "antimony": "A metal from factory waste or pipe solders. Drinking high levels over time can cause stomach pain and heart problems.",
  "iron": "A harmless metal from soil. It makes water taste metallic and leaves reddish-brown stains on laundry and sinks.",
  "manganese": "A natural mineral. It makes water taste bitter and leaves black stains, and very high levels can affect the brain.",
  "aluminum": "A metal from soil or water treatment. High amounts can discolor water, and it is studied for links to brain issues.",
  "zinc": "A natural metal from rusty pipes. It makes water look milky and taste metallic, but is not a health risk.",
  "ph": "A scale of 0 to 14 showing how acidic water is. Low pH eats away pipes; high pH leaves white mineral buildup.",
  "organic nitrogen": "Compounds from decaying leaves and farm runoff. High levels show that organic dirt has gotten into the water.",
  "taste": "How water tastes. Strange tastes show there might be minerals or chemical pollution in the water.",
  "odour": "How water smells. Good water has no smell; bad smells show organic dirt or chemical pollution.",
  "colour": "How water looks. Yellow or brown water shows there is dirt, rust, or organic matter in it.",
};

const getParameterDescription = (name: string): string => {
  const norm = name.toLowerCase();
  for (const [key, desc] of Object.entries(parameterDescriptions)) {
    if (norm.includes(key)) return desc;
  }
  return "A monitored compound in drinking water. Regular testing is done to make sure levels stay safe for public use.";
};

const DefinitionLink = ({ term, children }: { term: string; children: React.ReactNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const definition = getParameterDescription(term);

  let slug = term.toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
    
  if (slug === "escherichia-coli" || slug === "e-coli" || slug === "total-coliform" || slug === "coliform") {
    slug = "microbes";
  } else if (slug === "nitrate-nitrite" || slug === "nitrate-nitrite-as-nitrogen") {
    slug = "nitrate";
  } else if (slug === "trihalomethane" || slug === "trihalomethanes" || slug === "trihalomethanes-total") {
    slug = "trihalomethanes-thms";
  } else if (slug === "haloacetic" || slug === "total-haloacetic-acids" || slug === "haloacetic-acids") {
    slug = "haloacetic-acids-haas";
  } else if (slug === "calcium-magnesium") {
    slug = "calcium-magnesium";
  } else if (["hardness", "iron", "manganese", "aluminum", "zinc", "ph", "sodium", "turbidity"].includes(slug)) {
    slug = "hardness";
  }

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <Link 
        to={`/education#${slug}`} 
        className="underline decoration-dotted decoration-blue-500 hover:text-blue-600 transition-colors font-semibold"
      >
        {children}
      </Link>
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white text-[11px] p-3 rounded-xl shadow-xl z-[9999] border border-slate-800 pointer-events-none text-center leading-normal block"
          >
            <span className="font-extrabold text-blue-400 block mb-1 uppercase tracking-wider">{term}</span>
            {definition}
            <span className="block mt-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest">Click to view full detail</span>
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

const renderDescriptionWithLinksAndHighlights = (desc: string) => {
  const dangerousTerms = [
    "severe gastrointestinal illness",
    "pathogen pathway",
    "neurological risk",
    "developmental delay",
    "kidney damage",
    "cancer risk",
    "skin lesions",
    "cardiovascular damage",
    "blue baby syndrome",
    "oxygen transport interference",
    "toxic forms",
    "kidney/liver issues",
    "tooth enamel mottling",
    "stomach cramps",
    "nausea",
    "nerve damage",
    "cognitive impairment",
    "kidney toxicity",
    "bone demineralization",
    "elevated blood pressure",
    "heart rhythm changes",
    "radioactive exposure",
    "gastrointestinal tract irritation",
    "cardiovascular concerns",
    "illness",
    "pathogen",
    "cancer",
    "toxicity",
    "toxic",
    "damage",
    "irritation",
    "irritant"
  ];

  const linkableTerms = [
    "Escherichia coli",
    "E. coli",
    "Total Coliform",
    "Coliform",
    "Lead",
    "Arsenic",
    "Nitrate",
    "Nitrite",
    "Trihalomethanes",
    "Haloacetic",
    "Fluoride",
    "Copper",
    "Hardness",
    "Sodium",
    "Turbidity",
    "Chlorine",
    "Mercury",
    "Chromium",
    "Cadmium",
    "Barium",
    "Uranium",
    "Antimony",
    "Iron",
    "Manganese",
    "Aluminum"
  ];

  const allTerms = [...new Set([...dangerousTerms, ...linkableTerms])].sort((a, b) => b.length - a.length);
  const escapedTerms = allTerms.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedTerms.join("|")})\\b`, "gi");

  const parts = desc.split(regex);
  return (
    <span>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        const isDangerous = dangerousTerms.some(term => term.toLowerCase() === lowerPart);
        const isLinkable = linkableTerms.some(term => term.toLowerCase() === lowerPart);

        if (isLinkable) {
          const standardTerm = linkableTerms.find(term => term.toLowerCase() === lowerPart) || part;
          return (
            <DefinitionLink key={i} term={standardTerm}>
              <span className={cn(isDangerous && "text-red-600 font-bold")}>
                {part}
              </span>
            </DefinitionLink>
          );
        } else if (isDangerous) {
          return (
            <span key={i} className="text-red-600 font-bold">
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

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

const standardizeLimitText = (limitText: string, sampleUnit: string): string => {
  if (!limitText || limitText === "N/A" || limitText.trim() === "") return limitText;
  
  const match = limitText.trim().match(/^([0-9.]+)\s*(.*)$/);
  if (!match) return limitText;
  
  const val = parseFloat(match[1]);
  const limitUnit = match[2].trim().toUpperCase();
  const sUnit = (sampleUnit || "").trim().toUpperCase();
  
  let targetVal = val;
  let targetUnit = limitUnit;

  if (sUnit === "UG/L" && limitUnit === "MG/L") {
    targetVal = val * 1000;
    targetUnit = "UG/L";
  } else if (sUnit === "MG/L" && limitUnit === "UG/L") {
    targetVal = val / 1000;
    targetUnit = "MG/L";
  } else if (sUnit) {
    targetUnit = sUnit;
  }

  if (targetVal < 1) {
    targetVal = Number(targetVal.toFixed(8));
  } else {
    targetVal = Number(targetVal.toFixed(4));
  }

  const isMicrobeUnit = (u: string) => u.includes("CFU") || u.includes("MPN") || u.includes("C/100ML") || u.includes("P/A");
  if (isMicrobeUnit(sUnit) && isMicrobeUnit(targetUnit)) {
    targetUnit = sUnit;
  }

  return `${targetVal} ${formatUnitForDisplay(targetUnit)}`;
};

const getOntarioLimitInfo = (
  contaminant: string,
  level: number | null,
  unit: string,
  exceedanceCount: number,
  dbLimit?: string | null
): { limitText: string; isExceeded: boolean } | null => {
  const norm = contaminant.toLowerCase().trim();
  const hasExceedance = exceedanceCount > 0;

  // 1. Try to find the limit string from dbLimit first, then EXCEL_LIMITS, then microbe fallbacks
  let limitText = dbLimit;
  if (!limitText || limitText === "N/A" || limitText.trim() === "") {
    limitText = "N/A";
    for (const [k, v] of Object.entries(EXCEL_LIMITS)) {
      if (norm.includes(k) || k.includes(norm)) {
        limitText = v;
        break;
      }
    }
  }

  if (limitText === "N/A") {
    if (norm.includes("escherichia") || norm === "e. coli" || (norm.includes("coli") && !norm.includes("coliform"))) {
      limitText = "0 CFU/100ML";
    } else if (norm.includes("coliform")) {
      limitText = "0 CFU/100ML";
    }
  }

  if (limitText === "N/A" || limitText === " " || limitText.trim() === "") {
    return null;
  }

  // Standardize unit to match sample unit
  const standardizedLimitText = standardizeLimitText(limitText, unit);

  // 2. Determine if the level exceeds the limit
  let isExceeded = hasExceedance;

  if (level !== null) {
    const match = standardizedLimitText.trim().match(/^([0-9.]+)\s*(.*)$/);
    if (match) {
      const limitVal = parseFloat(match[1]);
      const limitUnit = match[2].trim().toUpperCase();
      const levelUnit = unit.trim().toUpperCase();

      if (levelUnit === limitUnit) {
        isExceeded = isExceeded || level > limitVal;
      } else if (levelUnit === "UG/L" && limitUnit === "MG/L") {
        isExceeded = isExceeded || level > (limitVal * 1000);
      } else if (levelUnit === "MG/L" && limitUnit === "UG/L") {
        isExceeded = isExceeded || (level * 1000) > limitVal;
      } else {
        isExceeded = isExceeded || level > limitVal;
      }
    }
  }

  return { limitText: standardizedLimitText, isExceeded };
};

const getDecimalPlaces = (val: number | null | undefined): number => {
  if (val === null || val === undefined || isNaN(val)) return 0;
  const str = val.toString();
  const dotIndex = str.indexOf('.');
  if (dotIndex === -1) return 0;
  return str.length - dotIndex - 1;
};

const getParameterPrecision = (test: WaterTest, samples?: any[]): number => {
  let maxDecimals = 0;
  
  if (test.level !== null && test.level !== undefined) {
    maxDecimals = Math.max(maxDecimals, getDecimalPlaces(test.level));
  }
  
  if (test.maxLevel !== null && test.maxLevel !== undefined) {
    maxDecimals = Math.max(maxDecimals, getDecimalPlaces(test.maxLevel));
  }
  
  if (test.legalLimit !== null && test.legalLimit !== undefined) {
    maxDecimals = Math.max(maxDecimals, getDecimalPlaces(test.legalLimit));
  }
  
  const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
  if (limitInfo && limitInfo.limitText) {
    const match = limitInfo.limitText.trim().match(/^([0-9.]+)/);
    if (match) {
      const val = parseFloat(match[1]);
      if (!isNaN(val)) {
        maxDecimals = Math.max(maxDecimals, getDecimalPlaces(val));
      }
    }
  }
  
  if (samples && samples.length > 0) {
    samples.forEach(s => {
      if (s.result_value !== null && s.result_value !== undefined) {
        maxDecimals = Math.max(maxDecimals, getDecimalPlaces(s.result_value));
      }
      if (s.parameter_limit) {
        const match = s.parameter_limit.trim().match(/^([0-9.]+)/);
        if (match) {
          const val = parseFloat(match[1]);
          if (!isNaN(val)) {
            maxDecimals = Math.max(maxDecimals, getDecimalPlaces(val));
          }
        }
      }
    });
  }
  
  return Math.min(3, maxDecimals);
};

const formatLimitText = (limitText: string, precision: number): string => {
  if (!limitText || limitText === "N/A" || limitText.trim() === "") return limitText;
  const match = limitText.trim().match(/^([0-9.]+)\s*(.*)$/);
  if (!match) return limitText;
  const val = parseFloat(match[1]);
  const unit = match[2];
  return `${val.toFixed(precision)} ${formatUnitForDisplay(unit)}`;
};

const formatLevel = (level: number | null, unit: string, exceedanceCount: number, precision: number = 0): string => {
  if (level === null) {
    if (unit.toLowerCase().includes("p/a") && exceedanceCount > 0) {
      return `Present (${formatUnitForDisplay(unit)})`;
    }
    return `${(0).toFixed(precision)} ${formatUnitForDisplay(unit)}`;
  }
  return `${level.toFixed(precision)} ${formatUnitForDisplay(unit)}`;
};


const isMicrobe = (contaminant: string): boolean => {
  const norm = contaminant.toLowerCase();
  return norm.includes("escherichia") || norm === "e. coli" || norm.includes("coliform");
};

const getContaminantFilterTarget = (name: string): string => {
  const norm = name.toLowerCase();
  if (norm.includes('coliform') || norm.includes('e. coli') || norm.includes('e.coli') || norm.includes('bacteria') || norm.includes('microbe')) {
    return "UV / RO System";
  }
  if (norm.includes('lead') || norm.includes('arsenic') || norm.includes('heavy metal') || norm.includes('cadmium') || norm.includes('mercury') || norm.includes('uranium') || norm.includes('barium') || norm.includes('antimony')) {
    return "Reverse Osmosis";
  }
  if (norm.includes('nitrate') || norm.includes('nitrite') || norm.includes('nitrogen')) {
    return "Reverse Osmosis";
  }
  if (norm.includes('hardness') || norm.includes('calcium') || norm.includes('magnesium') || norm.includes('iron') || norm.includes('manganese')) {
    return "Water Softener";
  }
  return "Activated Carbon";
};

const getFilterActionDescription = (filterType: string): string => {
  switch (filterType) {
    case "UV / RO System":
      return "Kills bacteria and microbes";
    case "Reverse Osmosis":
      return "Removes toxic heavy metals";
    case "Water Softener":
      return "Reduces scale and hardness";
    default:
      return "Absorbs organic chemical residues";
  }
};

const getAmazonProducts = (filterName: string) => {
  const cleanName = filterName.toLowerCase();
  if (cleanName.includes("reverse osmosis")) {
    return [
      {
        name: "iSpring RCC7AK 6-Stage Under Sink Reverse Osmosis Water Filtration System",
        price: "$219.99",
        rating: "4.7 / 5 (10k+ reviews)",
        link: "https://www.amazon.com/s?k=iSpring+RCC7AK+Reverse+Osmosis",
      },
      {
        name: "APEC Water Systems RO-50 5-Stage Under Sink Reverse Osmosis System",
        price: "$189.95",
        rating: "4.8 / 5 (8k+ reviews)",
        link: "https://www.amazon.com/s?k=APEC+Water+Systems+RO-50",
      }
    ];
  } else if (cleanName.includes("carbon")) {
    return [
      {
        name: "Brita XL Water Filter Dispenser with Elite Filter (PFOA/PFAS Free)",
        price: "$39.99",
        rating: "4.6 / 5 (22k+ reviews)",
        link: "https://www.amazon.com/s?k=Brita+XL+Water+Filter+Dispenser",
      },
      {
        name: "Waterdrop WD-FC-06 NSF Certified Faucet Water Filter System",
        price: "$24.99",
        rating: "4.5 / 5 (12k+ reviews)",
        link: "https://www.amazon.com/s?k=Waterdrop+Faucet+Water+Filter",
      }
    ];
  } else if (cleanName.includes("softener")) {
    return [
      {
        name: "Aquasure Harmony Series 32,000 Grains Whole House Water Softener",
        price: "$399.99",
        rating: "4.6 / 5 (3k+ reviews)",
        link: "https://www.amazon.com/s?k=Aquasure+Harmony+Water+Softener",
      },
      {
        name: "Eddy Electronic Water Descaler - Whole House Scale Inhibitor",
        price: "$139.99",
        rating: "4.4 / 5 (5k+ reviews)",
        link: "https://www.amazon.com/s?k=Eddy+Electronic+Water+Descaler",
      }
    ];
  } else {
    return [
      {
        name: "APEC Water Systems RO-PH90 High Flow 6-Stage Alkaline Water Filter",
        price: "$299.99",
        rating: "4.8 / 5 (4k+ reviews)",
        link: "https://www.amazon.com/s?k=APEC+RO-PH90+Water+Filter",
      },
      {
        name: "Express Water RO5DX 5-Stage Reverse Osmosis Filtration System",
        price: "$174.99",
        rating: "4.7 / 5 (6k+ reviews)",
        link: "https://www.amazon.com/s?k=Express+Water+Reverse+Osmosis+System",
      }
    ];
  }
};

const getHardnessInfo = (tests: WaterTest[], dwspData?: any) => {
  let hardness = 0;
  let hasAvg = false;

  if (dwspData && dwspData.hardness_avg !== undefined && dwspData.hardness_avg !== null) {
    hardness = dwspData.hardness_avg;
    hasAvg = true;
  } else {
    let calcium = 0;
    let magnesium = 0;
    let iron = 0;
    let manganese = 0;
    let directHardness = 0;
    let hasMineralData = false;

    tests.forEach(t => {
      const name = t.contaminant.toLowerCase().trim();
      const level = t.level || 0;
      if (level === 0) return;

      const isUg = (t.unit || "").toLowerCase().includes("ug");
      const valMg = isUg ? level / 1000 : level;

      if (name.includes("calcium")) {
        calcium = valMg;
        hasMineralData = true;
      } else if (name.includes("magnesium")) {
        magnesium = valMg;
        hasMineralData = true;
      } else if (name.includes("manganese")) {
        manganese = valMg;
        hasMineralData = true;
      } else if (name.includes("iron")) {
        iron = valMg;
        hasMineralData = true;
      } else if (name.includes("hardness")) {
        directHardness = valMg;
      }
    });

    hardness = 2.497 * calcium + 4.118 * magnesium + 1.792 * iron + 1.822 * manganese;
    if (hardness === 0 && directHardness > 0) {
      hardness = directHardness;
      hasMineralData = true;
    }
    hasAvg = hasMineralData && hardness > 0;
  }

  let pct = 10;
  let statusText = "Soft Water";
  let textColor = "text-emerald-500";
  let userTip = "Soft water. Excellent for soap lathering and leaves zero risk of mineral scale buildup in pipes or fixtures.";
  let feelsLike = "Soap lathers easily and rinses away cleanly. Faucets and glass doors will remain free of mineral scale buildup.";
  let practicalAdvice = "No water softeners or specialized scale filters are required.";

  if (!hasAvg && hardness === 0) {
    pct = 10;
    statusText = "NO DATA";
    textColor = "text-gray-400";
    userTip = "No hardness mineral measurements available.";
    feelsLike = "No details available.";
    practicalAdvice = "";
  } else {
    // Dynamic slider indicator mapping along the 0 to 250+ mg/L spectrum
    const clamped = Math.min(250, Math.max(0, hardness));
    pct = 10 + (clamped / 250) * 80;

    if (hardness <= 60) {
      statusText = "Soft Water";
      textColor = "text-emerald-500";
      userTip = "Soft water. Excellent for soap lathering and leaves zero risk of mineral scale buildup in pipes or fixtures.";
      feelsLike = "Soap lathers easily and rinses away cleanly. Faucets and glass doors will remain free of mineral scale buildup.";
      practicalAdvice = "No water softeners or specialized scale filters are required.";
    } else if (hardness <= 120) {
      statusText = "Moderately Hard";
      textColor = "text-blue-500";
      userTip = "Standard baseline. Generally gentle on plumbing with minimal risk of soap film or spots on dishes.";
      feelsLike = "Standard and acceptable for most households. You might notice minor soap film or slight spots on air-dried dishes.";
      practicalAdvice = "Gentle on plumbing and appliances. No active water softening is needed.";
    } else if (hardness <= 180) {
      statusText = "Hard Water";
      textColor = "text-orange-500";
      userTip = "Noticeable mineral presence. May leave white crust scale on faucet aerators and cause skin dryness or stiff hair.";
      feelsLike = "You may notice dry skin, stiff hair, and white mineral scale forming on faucets or kettle bases.";
      practicalAdvice = "Consider a shower filter for skin health. Use vinegar or citric acid to easily dissolve scale from appliances.";
    } else {
      statusText = "Very Hard Water";
      textColor = "text-purple-600";
      userTip = "Severe mineral saturation. High risk of lime scale buildup in pipes, shorter appliance lifespans, and poor soap lather.";
      feelsLike = "Soap lathers poorly and leaves a heavy film. Heavy mineral scale can build up rapidly in pipes and shorten appliance lifespans.";
      practicalAdvice = "A whole-home water softener is highly recommended to protect plumbing and improve lather.";
    }
  }
  return { hardness, pct, statusText, textColor, userTip, feelsLike, practicalAdvice };
}

export function SearchPage() {
  const navigate = useNavigate();
  const { query: routeQuery, dwsId: routeDwsId } = useParams();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(routeQuery || searchParams.get("q") || "");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
  const [waterTests, setWaterTests] = useState<WaterTest[]>([]);
  const [exceedances, setExceedances] = useState<Exceedance[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<'quality' | 'filters'>('quality');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [rawSamplesData, setRawSamplesData] = useState<Record<string, any[]>>({});
  const [rawSamplesLoading, setRawSamplesLoading] = useState<Record<string, boolean>>({});
  const [showAllParameters, setShowAllParameters] = useState(false);
  const [showAllContaminants, setShowAllContaminants] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAestheticModal, setShowAestheticModal] = useState(false);
  const [showMetalsModal, setShowMetalsModal] = useState(false);
  const [showMicrobesModal, setShowMicrobesModal] = useState(false);
  const [showAdditivesModal, setShowAdditivesModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'exceedance'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'municipal' | 'other'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'microbe' | 'chemical' | 'additive'>('all');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const isDetailLoading = dataLoading || filterLoading;

  useEffect(() => {
    if (selectedLocation) {
      setFilterLoading(true);
      const timer = setTimeout(() => {
        setFilterLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [statusFilter, categoryFilter, typeFilter]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const hardnessInfo = selectedLocation 
    ? getHardnessInfo(waterTests, selectedLocation.dwsp_data) 
    : { hardness: 0, pct: 10, statusText: "NO DATA", textColor: "text-gray-400", userTip: "No hardness mineral measurements available.", feelsLike: "", practicalAdvice: "" };

  const getParameterCategory = (name: string): 'microbe' | 'chemical' | 'additive' | 'aesthetic' => {
    const lower = name.toLowerCase();
    if (
      lower.includes('coliform') || 
      lower.includes('e. coli') || 
      lower.includes('e.coli') || 
      lower.includes('bacteria') || 
      lower.includes('microbe') || 
      lower.includes('heterotrophic') || 
      lower.includes('hpc') ||
      lower.includes('background')
    ) {
      return 'microbe';
    }
    if (
      lower.includes('fluoride') ||
      lower.includes('trihalomethane') ||
      lower.includes('haloacetic') ||
      lower.includes('chlorate') ||
      lower.includes('chlorite') ||
      lower.includes('chlorine')
    ) {
      return 'additive';
    }
    if (
      lower.includes('hardness') ||
      lower.includes('sodium') ||
      lower.includes('ph') ||
      lower.includes('turbidity') ||
      lower.includes('color') ||
      lower.includes('odour') ||
      lower.includes('taste') ||
      lower.includes('iron') ||
      lower.includes('manganese') ||
      lower.includes('zinc') ||
      lower.includes('copper') ||
      lower.includes('dissolved solids') ||
      lower.includes('alkalinity') ||
      lower.includes('temperature')
    ) {
      return 'aesthetic';
    }
    return 'chemical';
  };

  const getParameterIcon = (category: 'microbe' | 'chemical' | 'additive' | 'aesthetic') => {
    switch (category) {
      case 'microbe':
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-green-600/10" />
          </div>
        );
      case 'additive':
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-cyan-600/10" />
          </div>
        );
      case 'aesthetic':
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-blue-500/10" />
          </div>
        );
      case 'chemical':
      default:
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        );
    }
  };

  const microbes = waterTests.filter(t => getParameterCategory(t.contaminant) === 'microbe');
  const chemicals = waterTests.filter(t => getParameterCategory(t.contaminant) === 'chemical');
  const additives = waterTests.filter(t => getParameterCategory(t.contaminant) === 'additive');

  const isLowRiskParameter = (name: string): boolean => {
    const norm = name.toLowerCase().trim();
    return (
      norm.includes('coliform') ||
      norm.includes('sodium') ||
      norm.includes('hardness') ||
      norm.includes('manganese') ||
      norm.includes('iron') ||
      norm.includes('aluminum') ||
      norm.includes('ph') ||
      norm.includes('organic nitrogen') ||
      norm.includes('turbidity') ||
      norm.includes('taste') ||
      norm.includes('odour')
    );
  };

  const getSafetyBarConfig = (
    tests: WaterTest[],
    categories: ('microbe' | 'chemical' | 'additive' | 'aesthetic')[]
  ) => {
    const exceededContaminants = new Set<string>();

    tests.forEach(test => {
      if (categories.includes(getParameterCategory(test.contaminant))) {
        const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
        const isExceeded = limitInfo ? limitInfo.isExceeded : (test.exceedanceCount && test.exceedanceCount > 0);
        if (isExceeded) {
          exceededContaminants.add(test.contaminant);
        }
      }
    });

    exceedances.forEach(e => {
      if (categories.includes(getParameterCategory(e.parameter_name))) {
        exceededContaminants.add(e.parameter_name);
      }
    });

    const count = exceededContaminants.size;
    const list = Array.from(exceededContaminants);

    if (count > 0) {
      const hasHighRisk = list.some(name => !isLowRiskParameter(name));
      if (hasHighRisk) {
        return {
          width: "20%",
          color: "bg-red-500",
          statusText: "Attention Required",
          textColor: "text-red-600",
        };
      } else {
        return {
          width: "50%",
          color: "bg-amber-500",
          statusText: "Warning",
          textColor: "text-amber-500",
        };
      }
    }

    let nearLimit = false;
    tests.forEach(test => {
      if (categories.includes(getParameterCategory(test.contaminant))) {
        const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
        if (test.level !== null && limitInfo) {
          const match = limitInfo.limitText.trim().match(/^([0-9.]+)/);
          if (match) {
            const limitVal = parseFloat(match[1]);
            if (limitVal > 0 && test.level >= 0.8 * limitVal) {
              nearLimit = true;
            }
          }
        }
      }
    });

    if (nearLimit) {
      return {
        width: "50%",
        color: "bg-amber-500",
        statusText: "Warning",
        textColor: "text-amber-500",
      };
    }

    return {
      width: "100%",
      color: "bg-green-500",
      statusText: "Safe",
      textColor: "text-green-600",
    };
  };

  const getAdditiveStatus = (additivesList: WaterTest[]) => {
    return getSafetyBarConfig(waterTests, ['additive']);
  };

  const getParameterStatus = (test: WaterTest, isExceeded: boolean, limitInfo: any) => {
    if (isExceeded) {
      return "Action Required";
    }
    
    if (test.level !== null && limitInfo) {
      const match = limitInfo.limitText.trim().match(/^([0-9.]+)/);
      if (match) {
        const limitVal = parseFloat(match[1]);
        if (limitVal > 0 && test.level >= 0.8 * limitVal) {
          return "Warning";
        }
      }
    }
    
    return "Safe";
  };

  const getAdditivesDescription = (additivesList: WaterTest[]) => {
    if (additivesList.length === 0) {
      return "No additive or treatment data available.";
    }

    const fluorideTest = additivesList.find(t => t.contaminant.toLowerCase().includes('fluoride'));
    const thmTest = additivesList.find(t => t.contaminant.toLowerCase().includes('trihalomethane'));
    const haaTest = additivesList.find(t => t.contaminant.toLowerCase().includes('haloacetic'));

    const parts: string[] = [];
    if (fluorideTest && fluorideTest.level !== null) {
      parts.push(`Fluoride: ${fluorideTest.level.toFixed(2)} mg/L`);
    }

    let chlorineByproducts = 0;
    let hasByproducts = false;
    if (thmTest && thmTest.level !== null) {
      chlorineByproducts += thmTest.level;
      hasByproducts = true;
    }
    if (haaTest && haaTest.level !== null) {
      chlorineByproducts += haaTest.level;
      hasByproducts = true;
    }

    if (hasByproducts) {
      parts.push(`Chlorine Byproducts: ${chlorineByproducts.toFixed(1)} µg/L`);
    }

    if (parts.length === 0) {
      return "No active treatment additives detected in tested parameters.";
    }

    const isOptimalFluoride = fluorideTest && fluorideTest.level !== null && fluorideTest.level >= 0.5 && fluorideTest.level <= 0.8;
    if (isOptimalFluoride) {
      return parts.join(" | ") + ". Optimal mineral fluoridation level for dental health.";
    }

    return parts.join(" | ") + ". Additives and byproducts are within safe limits.";
  };

  const microbeConfig = getSafetyBarConfig(waterTests, ['microbe']);
  const chemicalConfig = getSafetyBarConfig(waterTests, ['chemical', 'additive']);
  const additiveConfig = getAdditiveStatus(additives);

  const getLatestSampleDate = () => {
    if (exceedances && exceedances.length > 0) {
      const dates = exceedances.map(e => new Date(e.sample_date)).filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        return maxDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    return `Oct 12, ${selectedYear}`;
  };

  const getNextSampleDateStr = (latestStr: string) => {
    const d = new Date(latestStr);
    if (!isNaN(d.getTime())) {
      d.setMonth(d.getMonth() + 3);
      return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return `Jan 12, ${selectedYear + 1}`;
  };

  const getSortTier = (t: WaterTest) => {
    const limitInfo = getOntarioLimitInfo(t.contaminant, t.level, t.unit, t.exceedanceCount || 0, t.parameterLimit);
    const isExceeded = limitInfo ? limitInfo.isExceeded : (t.exceedanceCount && t.exceedanceCount > 0);
    const status = getParameterStatus(t, isExceeded, limitInfo);
    if (status === "Action Required") return 0;
    if (status === "Warning") return 1;
    return 2;
  };

  const sortedWaterTests = [...waterTests].sort((a, b) => {
    const tierA = getSortTier(a);
    const tierB = getSortTier(b);
    if (tierA !== tierB) return tierA - tierB;
    
    const nameA = a.contaminant;
    const nameB = b.contaminant;
    const isLetterA = /^[a-zA-Z]/.test(nameA.trim());
    const isLetterB = /^[a-zA-Z]/.test(nameB.trim());
    
    if (isLetterA !== isLetterB) {
      return isLetterA ? 1 : -1; // letter starting ones come LAST
    }
    
    return nameA.localeCompare(nameB);
  });

  const toggleRowExpansion = (contaminant: string, unit: string) => {
    const key = `${contaminant}_${unit}`;
    const nextState = !expandedRows[key];
    setExpandedRows(prev => ({ ...prev, [key]: nextState }));
    if (nextState) {
      loadPastSamples(contaminant, unit);
    }
  };

  const loadPastSamples = async (contaminant: string, unit: string) => {
    const key = `${contaminant}_${unit}`;
    if (rawSamplesData[key] || rawSamplesLoading[key]) return;
    
    setRawSamplesLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`/api/water-data?location=${encodeURIComponent(selectedLocation!.dws_name)}&microbe=${encodeURIComponent(contaminant)}&limit=1000`);
      if (res.ok) {
        const data = await res.json();
        const filteredData = (data || []).filter((item: any) => {
          const u1 = formatUnitForDisplay(item.result_unit || "").toLowerCase().trim();
          const u2 = formatUnitForDisplay(unit || "").toLowerCase().trim();
          const unitMatch = u1 === u2;
          const nameMatch = (item.parameter_name || "").toLowerCase().trim() === contaminant.toLowerCase().trim();
          return unitMatch && nameMatch;
        });
        
        // De-duplicate on sample date + value + unit
        const uniqueData = Array.from(
          new Map(
            filteredData.map((item: any) => [
              `${item.sample_date}_${item.result_value}_${(item.result_unit || "").toLowerCase().trim()}`,
              item
            ])
          ).values()
        );
        setRawSamplesData(prev => ({ ...prev, [key]: uniqueData }));
      }
    } catch (err) {
      console.error("Error fetching raw samples:", err);
    } finally {
      setRawSamplesLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const renderSampleHistory = (rowKey: string, test: WaterTest, precision: number) => {
    if (rawSamplesData[rowKey] === undefined) {
      loadPastSamples(test.contaminant, test.unit);
    }

    if (rawSamplesLoading[rowKey] || rawSamplesData[rowKey] === undefined) {
      return (
        <div className="flex items-center justify-center gap-1 py-2.5 text-gray-400 text-[8px] sm:text-[10px] bg-white rounded-md sm:rounded-lg border border-gray-100">
          <Loader2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin text-blue-500" />
          Loading sample records...
        </div>
      );
    }
    
    if (rawSamplesData[rowKey].length > 0) {
      return (
        <div className="space-y-1 sm:space-y-1.5 max-h-36 sm:max-h-48 overflow-y-auto pr-1">
          {rawSamplesData[rowKey].map((sample: any, sIdx: number) => {
            const sampleLimitInfo = getOntarioLimitInfo(sample.parameter_name, sample.result_value, sample.result_unit, sample.exceedance === 'Y' ? 1 : 0, sample.parameter_limit);
            const sampleExceeded = sampleLimitInfo ? sampleLimitInfo.isExceeded : sample.exceedance === 'Y';
            return (
              <div key={sIdx} className="flex justify-between items-center bg-white px-1.5 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border border-gray-100 shadow-sm">
                <span className="font-semibold text-gray-600 text-[8px] sm:text-[10px]">{sample.sample_date}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900 text-[9px] sm:text-xs">
                    {sample.result_value !== null 
                      ? `${sample.result_value.toFixed(precision)} ${formatUnitForDisplay(sample.result_unit)}` 
                      : (sample.exceedance === 'Y' 
                        ? `Present (${formatUnitForDisplay(sample.result_unit || test.unit)})` 
                        : `${(0).toFixed(precision)} ${formatUnitForDisplay(sample.result_unit || test.unit)}`
                      )
                    }
                  </span>
                  <span className={cn(
                    "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0",
                    sampleExceeded ? "bg-red-500 animate-pulse" : "bg-green-500"
                  )} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <div className="text-center text-[8px] sm:text-[10px] text-gray-400 py-2.5 bg-white rounded-md sm:rounded-lg border border-gray-100">
        No sample history available.
      </div>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || searchTerm.length < 2) return;
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  };

  const fetchWaterData = async (locationName: string, year: number) => {
    setDataLoading(true);
    setExpandedRows({});
    setRawSamplesData({});
    setRawSamplesLoading({});
    setShowAllParameters(false);
    setShowAllContaminants(false);
    try {
      const url = `/api/water-data?location=${encodeURIComponent(locationName)}&year=${year}&aggregate=true`;
      const res = await fetch(url);
      const data: WaterDataResponse = await res.json();
      
      // De-duplicate tests
      const testsMap = new Map<string, WaterTest>();
      (data.tests || []).forEach(t => {
        const key = `${t.contaminant.toLowerCase().trim()}_${(t.unit || "").toLowerCase().trim()}`;
        if (!testsMap.has(key)) {
          testsMap.set(key, t);
        } else {
          const existing = testsMap.get(key)!;
          existing.sampleCount += t.sampleCount;
          if (t.latestYear > existing.latestYear) {
            existing.latestYear = t.latestYear;
          }
          if (t.level !== null && (existing.level === null || t.level > existing.level)) {
            existing.level = t.level;
          }
          if (t.maxLevel !== undefined && t.maxLevel !== null && (existing.maxLevel === undefined || existing.maxLevel === null || t.maxLevel > existing.maxLevel)) {
            existing.maxLevel = t.maxLevel;
          }
          existing.exceedanceCount = (existing.exceedanceCount || 0) + (t.exceedanceCount || 0);
        }
      });
      setWaterTests(Array.from(testsMap.values()));

      // De-duplicate exceedances
      const uniqueExceedances = Array.from(new Map((data.exceedances || []).map((e: any) => [
        `${e.parameter_name.toLowerCase().trim()}_${e.sample_date}_${e.result_value}`,
        e
      ])).values());
      setExceedances(uniqueExceedances);

      setSelectedLocation(data.location);
    } catch (error) {
      console.error("Fetch tests error:", error);
      setWaterTests([]);
      setExceedances([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const syncUrlState = async () => {
      const qParam = searchParams.get("q");
      const effectiveQuery = routeQuery || qParam;
      if (effectiveQuery) {
        setSearchTerm(effectiveQuery);
      }
      if (effectiveQuery && effectiveQuery.length >= 2) {
        setHasSearched(true);
        setLoading(true);
        if (!routeDwsId) {
          setSelectedLocation(null);
        }
        try {
          const res = await fetch(`/api/water-data?distinct_locations=true&q=${encodeURIComponent(effectiveQuery)}&year=${selectedYear}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data || []);
            
            if (routeDwsId) {
              const dwsIdNum = parseInt(routeDwsId, 10);
              if (!isNaN(dwsIdNum)) {
                const matched = (data || []).find((item: any) => item.dws_id === dwsIdNum);
                const locName = matched ? matched.dws_name : null;
                if (locName) {
                  await fetchWaterData(locName, selectedYear);
                } else {
                  setDataLoading(true);
                  const testRes = await fetch(`/api/locations/${dwsIdNum}/tests?year=${selectedYear}`);
                  if (testRes.ok) {
                    const testData = await testRes.json();
                    
                    // De-duplicate tests
                    const testsMap = new Map<string, WaterTest>();
                    (testData.tests || []).forEach(t => {
                      const key = `${t.contaminant.toLowerCase().trim()}_${(t.unit || "").toLowerCase().trim()}`;
                      if (!testsMap.has(key)) {
                        testsMap.set(key, t);
                      } else {
                        const existing = testsMap.get(key)!;
                        existing.sampleCount += t.sampleCount;
                        if (t.latestYear > existing.latestYear) {
                          existing.latestYear = t.latestYear;
                        }
                        if (t.level !== null && (existing.level === null || t.level > existing.level)) {
                          existing.level = t.level;
                        }
                        if (t.maxLevel !== undefined && t.maxLevel !== null && (existing.maxLevel === undefined || existing.maxLevel === null || t.maxLevel > existing.maxLevel)) {
                          existing.maxLevel = t.maxLevel;
                        }
                        existing.exceedanceCount = (existing.exceedanceCount || 0) + (t.exceedanceCount || 0);
                      }
                    });
                    setWaterTests(Array.from(testsMap.values()));

                    // De-duplicate exceedances
                    const uniqueExceedances = Array.from(new Map<string, Exceedance>((testData.exceedances || []).map((e: any) => [
                      `${e.parameter_name.toLowerCase().trim()}_${e.sample_date}_${e.result_value}`,
                      e
                    ])).values());
                    setExceedances(uniqueExceedances);

                    setSelectedLocation(testData.location);
                  }
                  setDataLoading(false);
                }
              }
            } else {
              setSelectedLocation(null);
            }
          }
        } catch (error) {
          console.error("URL sync error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setHasSearched(false);
        setSelectedLocation(null);
      }
    };

    syncUrlState();
  }, [routeQuery, routeDwsId, selectedYear, searchParams]);

  // Frontend filtering logic
  const filteredResults = results.filter((loc) => {
    // 1. Status Filter
    if (statusFilter === 'safe') {
      if (loc.exceedances && loc.exceedances > 0) return false;
    } else if (statusFilter === 'exceedance') {
      if (!loc.exceedances || loc.exceedances === 0) return false;
    }

    // 2. Category Filter
    if (categoryFilter === 'municipal') {
      const cat = (loc.dws_category || "").toLowerCase();
      if (!cat.includes("municipal") || cat.includes("non-municipal")) return false;
    } else if (categoryFilter === 'other') {
      const cat = (loc.dws_category || "").toLowerCase();
      if (cat.includes("municipal") && !cat.includes("non-municipal")) return false;
    }

    // 3. Type Filter
    if (typeFilter !== 'all') {
      const types = (loc.sample_types || []).map(t => t.toLowerCase());
      if (typeFilter === 'microbe') {
        const hasMicrobe = types.some(t => t.includes('micro') || t.includes('bacteria') || t.includes('coli') || t.includes('coliform'));
        if (!hasMicrobe) return false;
      } else if (typeFilter === 'chemical') {
        const hasChemical = types.some(t => t.includes('chem') || t.includes('metal') || t.includes('lead') || t.includes('arsenic') || t.includes('copper') || t.includes('nitrate') || t.includes('nitrite'));
        if (!hasChemical) return false;
      } else if (typeFilter === 'additive') {
        const hasAdditive = types.some(t => t.includes('add') || t.includes('fluoride') || t.includes('chlorine') || t.includes('treatment') || t.includes('byproduct') || t.includes('thms') || t.includes('haas'));
        if (!hasAdditive) return false;
      }
    }

    return true;
  });

  // Show results list or detail view — never both
  const showResultsList = hasSearched && !selectedLocation;
  const showDetailView = selectedLocation;

  // ---- Smart filter recommendation logic (uses exceedances + test levels) ----
  type FilterRec = {
    primary: string;
    tagline: string;
    why: string;
    warning: string | null;
    badgeColor: string;
    badgeBg: string;
    badgeText: string;
    icon: string;
  };

  const recommendFiltersSmart = (waterTests: WaterTest[], exceedances: Exceedance[]) => {
    const recs: Record<string, { score: number; tag: string; warning: string | null }> = {};

    const paramNames = new Set([
      ...exceedances.map(e => (e.parameter_name || "").toLowerCase()),
      ...waterTests.map(t => (t.contaminant || "").toLowerCase()),
    ]);

    const knownParams = waterTests.filter(t => t.legalLimit > 0);
    const highLevel = knownParams.filter(t => {
      const ratio = t.level / t.legalLimit;
      return ratio >= 0.5; // at 50%+ of limit, flag it
    });

    const heavyMetalKeywords = ["lead", "mercury", "arsenic", "antimony", "cadmium", "chromium", "uranium", "barium"];
    const nitrateKeywords = ["nitrate", "nitrite", "nitrogen"];
    const thmKeywords = ["trihalomethanes", "thm", "haloacetic", "haloa", "chloroform", "bromoform", "bromodichloromethane"];
    const hardnessKeywords = ["hard", "calcium", "magnesium", "hardness"];
    const tasteKeywords = ["chlorine", "taste", "odour", "odor", "colour"];

    // Score each category
    let heavyMetalScore = 0;
    let nitrateScore = 0;
    let thmScore = 0;
    let hardnessScore = 0;
    let tasteScore = 0;

    // Check exceedances first (strong indicators)
    exceedances.forEach(e => {
      const n = (e.parameter_name || "").toLowerCase();
      if (heavyMetalKeywords.some(k => n.includes(k))) heavyMetalScore += 5;
      if (nitrateKeywords.some(k => n.includes(k))) nitrateScore += 5;
      if (thmKeywords.some(k => n.includes(k))) thmScore += 3;
      if (hardnessKeywords.some(k => n.includes(k))) hardnessScore += 4;
      if (tasteKeywords.some(k => n.includes(k))) tasteScore += 2;
    });

    // Check high-level tests
    highLevel.forEach(t => {
      const n = (t.contaminant || "").toLowerCase();
      if (heavyMetalKeywords.some(k => n.includes(k))) heavyMetalScore += 3;
      if (nitrateKeywords.some(k => n.includes(k))) nitrateScore += 3;
      if (thmKeywords.some(k => n.includes(k))) thmScore += 2;
      if (hardnessKeywords.some(k => n.includes(k))) hardnessScore += 3;
      if (tasteKeywords.some(k => n.includes(k))) tasteScore += 1;
    });

    // Build recommendations based on highest scores
    if (heavyMetalScore >= 3 || nitrateScore >= 3) {
      recs["Reverse Osmosis"] = {
        score: heavyMetalScore + nitrateScore,
        tag: "Heavy metals / nitrates detected",
        warning: "Standard pitcher filters will NOT remove these contaminants. An under-sink RO or specialized heavy-metal filter is required.",
      };
    }

    if (thmScore >= 2 || tasteScore >= 2) {
      recs["Activated Carbon"] = {
        score: thmScore + tasteScore,
        tag: "THMs / taste concerns",
        warning: null,
      };
    }

    if (hardnessScore >= 3) {
      recs["Water Softener"] = {
        score: hardnessScore,
        tag: "Hard water indicators",
        warning: null,
      };
    }

    // Return primary rec + any secondary recs, sorted by score
    const sorted = Object.entries(recs)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.score - a.score);

    if (sorted.length === 0 && exceedances.length > 0) {
      return [{
        name: "Combined Systems",
        score: 1,
        tag: "General contaminant concerns",
        warning: null,
      }];
    }

    if (sorted.length === 0 && waterTests.length > 0) {
      // No specific flags — suggest basic carbon
      return [{
        name: "Activated Carbon",
        score: 1,
        tag: "General water quality",
        warning: null,
      }];
    }

    return sorted;
  };

  const filterRecDisplay = (rec: any): FilterRec => {
    switch (rec.name) {
      case "Reverse Osmosis":
        return {
          primary: "Reverse Osmosis (RO) System",
          tagline: rec.tag,
          why: "Your water shows elevated heavy metals or nitrates — RO is the most effective residential option, removing up to 99% of dissolved contaminants including lead, arsenic, and nitrates.",
          warning: rec.warning,
          badgeColor: "bg-purple-600",
          badgeBg: "bg-purple-50 text-purple-700",
          badgeText: "Recommended",
          icon: "RO",
        };
      case "Activated Carbon":
        return {
          primary: "Activated Carbon Filter",
          tagline: rec.tag,
          why: "Activated carbon excels at adsorbing chlorine, THMs, and taste/odour compounds. A standard pitcher or faucet-mount carbon filter will significantly improve taste if that's your main concern.",
          warning: rec.warning,
          badgeColor: "bg-green-600",
          badgeBg: "bg-green-50 text-green-700",
          badgeText: "Recommended",
          icon: "C",
        };
      case "Water Softener":
        return {
          primary: "Water Softener + Scale Reducer",
          tagline: rec.tag,
          why: "Your water shows signs of hardness (scale-forming minerals). A whole-house softener will protect appliances and reduce scaling; pair with a carbon filter for drinking water.",
          warning: rec.warning,
          badgeColor: "bg-amber-600",
          badgeBg: "bg-amber-50 text-amber-700",
          badgeText: "Recommended",
          icon: "S",
        };
      default:
        return {
          primary: "Combined Multi-Stage System",
          tagline: rec.tag,
          why: "Consider a multi-stage system (sediment → carbon → optional RO) to address the range of contaminants detected in your water.",
          warning: rec.warning,
          badgeColor: "bg-blue-600",
          badgeBg: "bg-blue-50 text-blue-700",
          badgeText: "Recommended",
          icon: "Cmb",
        };
    }
  };

  // ---- Risk descriptions for common contaminants ----
  const contaminationRisks: Record<string, string[]> = {
    "lead": ["Lead poisoning (neurological damage)", "Cognitive impairment in children", "Developmental delays", "Kidney damage"],
    "mercury": ["Nerve damage", "Impaired vision/hearing", "Kidney toxicity"],
    "arsenic": ["Skin lesions", "Cancer risk (lung, bladder, skin)", "Cardiovascular effects"],
    "antimony": ["Stomach irritation", "Heart problems at high levels"],
    "cadmium": ["Kidney damage", "Bone demineralization"],
    "chromium": ["Allergic dermatitis", "Respiratory irritation", "Liver/kidney effects (high levels)"],
    "uranium": ["Kidney toxicity", "Increased cancer risk"],
    "barium": ["High blood pressure", "Heart rhythm changes"],
    "nitrate": ["Blue baby syndrome (methemoglobinemia)", "Reduced oxygen transport in blood"],
    "nitrite": ["Same as nitrate — oxygen transport interference"],
    "trihalomethanes": ["Increased cancer risk with long-term exposure", "Liver/kidney effects"],
    "haloacetic": ["Liver/kidney effects", "Potential cancer risk"],
    "chlorine": ["Irritation of eyes/nose/throat", "Aggravates asthma symptoms"],
    "copper": ["Stomach cramps / nausea", "Liver damage at very high levels"],
    "fluoride": ["Dental fluorosis (above safe levels)", "Skeletal fluorosis (rare, extreme levels)"],
    "hardness": ["Scale buildup in pipes/appliances", "Reduced soap effectiveness"],
  };

  const getRisksForParam = (name: string): string[] => {
    const n = name.toLowerCase();
    for (const [key, risks] of Object.entries(contaminationRisks)) {
      if (n.includes(key)) return risks;
    }
    return [];
  };

  return (
    <div className="pt-0 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Sticky Search Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md pt-4 pb-3 px-4 -mx-4 sm:-mx-6 lg:-mx-8 transition-all duration-200">
        <div className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-blue-900 leading-tight font-sans">Water Quality Reports</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold font-sans">Enter a city or water system name</p>
            </div>
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Toronto, London..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm sm:text-base pl-11 pr-24 font-sans font-medium"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button 
                  type="submit"
                  disabled={searchTerm.length < 2}
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 text-white px-4 rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer font-sans"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 pt-3">
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="text-xs text-gray-400 font-bold uppercase mr-1.5 font-sans">Year:</span>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="appearance-none bg-gray-50 text-gray-700 px-3.5 py-2 pr-9 rounded-xl text-xs font-extrabold hover:bg-gray-100 cursor-pointer outline-none font-sans transition-all border-0"
                >
                  {AVAILABLE_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none stroke-[2.5]" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer font-sans",
                showFiltersPanel || statusFilter !== 'all' || categoryFilter !== 'all' || typeFilter !== 'all'
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(statusFilter !== 'all' || categoryFilter !== 'all' || typeFilter !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>
          </div>

          {/* Expandable Filter Options Drawer */}
          <AnimatePresence>
            {showFiltersPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3.5 pb-1">
                  {/* Filter 1: Status */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Safety Status</label>
                    <div className="flex gap-1.5">
                      {(['all', 'safe', 'exceedance'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={cn(
                            "flex-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all truncate cursor-pointer font-sans",
                            statusFilter === s
                              ? "bg-slate-900 text-white shadow-sm"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {s === 'all' ? 'All' : s === 'safe' ? 'Safe' : 'Exceedance'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter 2: Category */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">System Type</label>
                    <div className="flex gap-1.5">
                      {(['all', 'municipal', 'other'] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => setCategoryFilter(c)}
                          className={cn(
                            "flex-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all truncate cursor-pointer font-sans",
                            categoryFilter === c
                              ? "bg-slate-900 text-white shadow-sm"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {c === 'all' ? 'All' : c === 'municipal' ? 'Municipal' : 'Other'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter 3: Tested Parameter Types */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Tested Types</label>
                    <div className="flex gap-1.5">
                      {(['all', 'microbe', 'chemical', 'additive'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTypeFilter(t)}
                          className={cn(
                            "flex-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all truncate cursor-pointer font-sans",
                            typeFilter === t
                              ? "bg-slate-900 text-white shadow-sm"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          {t === 'all' ? 'All' : t === 'microbe' ? 'Microbe' : t === 'chemical' ? 'Chem' : 'Additive'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="search-loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto py-20 flex flex-col items-center justify-center text-gray-500 gap-3 bg-white border border-gray-100 rounded-3xl shadow-sm min-h-[350px]"
          >
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <span className="text-base font-bold text-gray-800 font-sans">Searching locations...</span>
            <span className="text-xs text-gray-400 font-sans">Finding water systems matching "{searchTerm}"</span>
          </motion.div>
        ) : showResultsList ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto space-y-2"
          >
            {filteredResults.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm font-medium">No water systems found matching active filters</p>
                <p className="text-xs mt-1">Try toggling safety status, parameter types, or system category filters</p>
              </div>
            ) : filteredResults.length > 0 ? (
              <>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">
                  {filteredResults.length} result{filteredResults.length > 1 ? 's' : ''} found
                </h3>
                {filteredResults.map((loc) => (
                  <div
                    key={loc.dws_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/search/${encodeURIComponent(routeQuery || searchTerm)}/${loc.dws_id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/search/${encodeURIComponent(routeQuery || searchTerm)}/${loc.dws_id}`); } }}
                    className="w-full flex items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 shrink-0 transition-colors">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{formatSystemName(loc.display_name || titleCase(loc.label || loc.dws_name))}</p>
                        {loc.owner_name && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {formatOwnerName(loc.owner_name)}
                          </p>
                        )}
                        {loc.latest_date && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            <span className="font-bold text-gray-600 font-sans">Latest Reporting Date:</span> {formatDateStr(loc.latest_date)}
                          </p>
                        )}
                        {loc.sample_types && loc.sample_types.length > 0 && (
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            <span className="font-bold text-gray-500">Water Tested:</span> {formatSampleTypes(loc.sample_types)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {loc.totalTests !== undefined && loc.totalTests > 0 && (
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold leading-tight border flex items-center gap-1",
                          loc.exceedances && loc.exceedances > 0
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            loc.exceedances && loc.exceedances > 0 ? "bg-red-500" : "bg-green-500"
                          )} />
                          {loc.exceedances && loc.exceedances > 0 ? "Attention Required" : "Safe"}
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </motion.div>
        ) : null}

        {/* Detail View with Tabs */}
        {showDetailView && !loading && (
          <motion.div
            key={selectedLocation.dws_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto space-y-4 sm:space-y-6"
          >
            {/* Return to Results */}
            <button
              onClick={() => { navigate(`/search/${encodeURIComponent(routeQuery || searchTerm)}`); setDetailTab('quality'); }}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Results
            </button>

            {/* Location Header */}
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="min-w-0 space-y-1">
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight">
                    {formatSystemName(selectedLocation.display_name || titleCase(selectedLocation.dws_name))}
                  </h2>
                  {selectedLocation.owner_name && (
                    <p className="text-xs sm:text-base text-gray-500 font-semibold">
                      {formatOwnerName(selectedLocation.owner_name)}
                    </p>
                  )}
                  {selectedLocation.sample_types && selectedLocation.sample_types.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      <span className="font-bold text-gray-500">Water Tested:</span> {formatSampleTypes(selectedLocation.sample_types)}
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-1">
                  {(() => {
                    const hasHighRiskExceedance = exceedances.some(e => !isLowRiskParameter(e.parameter_name));
                    const hasLowRiskExceedance = exceedances.some(e => isLowRiskParameter(e.parameter_name));
                    
                    if (hasHighRiskExceedance || hasLowRiskExceedance) {
                      return (
                        <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-red-50 text-red-700 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 border border-red-200 shadow-sm uppercase tracking-wider">
                          <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" /> STATUS: ATTENTION REQUIRED
                        </span>
                      );
                    } else {
                      return (
                        <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-green-50 text-green-700 rounded-full text-[10px] sm:text-xs font-extrabold flex items-center gap-1.5 border border-green-200 shadow-sm uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 fill-green-50/10" /> STATUS: SAFE
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Tab Toggle */}
              <div className="flex gap-1 p-1 bg-gray-100/80 rounded-xl border border-gray-200 mb-6">
                <button
                  onClick={() => setDetailTab('quality')}
                  className={cn(
                    "flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                    detailTab === 'quality' 
                      ? "bg-white text-blue-800 shadow-sm border border-gray-200/50" 
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                  )}
                >
                  Water Quality Data
                </button>
                <button
                  onClick={() => setDetailTab('filters')}
                  className={cn(
                    "flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center justify-center gap-2 relative cursor-pointer",
                    detailTab === 'filters' 
                      ? "bg-white text-blue-800 shadow-sm border border-gray-200/50" 
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                  )}
                >
                  Water Filter Recommendations
                </button>
              </div>

              {/* Tab Content */}
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[400px] transition-all duration-300">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <span className="text-sm font-bold text-gray-800 font-sans">Updating water reports...</span>
                  <span className="text-xs text-gray-400 font-sans">Fetching and compiling parameters for {selectedYear}</span>
                </div>
              ) : (
                detailTab === 'quality' ? (
                  /* ---- TAB: Water Quality Data ---- */
                  waterTests.length === 0 && exceedances.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No test data available for this location</p>
                      <p className="text-xs mt-1">The data may not be processed yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* At-a-Glance Summary Card Section */}
                      <div className="space-y-2.5 sm:space-y-3">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-950">Summary</h3>
                        <div className="border border-gray-200 bg-gray-50/5 rounded-2xl p-3 sm:p-5 shadow-sm">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                            {/* Card 1: Bacteria & Microbes */}
                            <div 
                              onClick={() => setShowMicrobesModal(true)}
                              className="flex flex-col space-y-2.5 p-3.5 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm group relative transition-all duration-200 justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                    <Microscope className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                                      <DefinitionLink term="Microbes">
                                        Bacteria & Microbes
                                      </DefinitionLink>
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-normal font-medium">
                                  {microbes.length === 0 
                                    ? "No microbe data available." 
                                    : microbeConfig.statusText === "Safe"
                                      ? "Tested for E. Coli and Coliforms. All criteria met."
                                      : "Bacteria criteria exceeded. Purification recommended."}
                                </p>
                                
                                {/* Safety Bar */}
                                <div className="space-y-1 pt-1">
                                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                    <span className="font-bold text-gray-500 font-sans">Safety:</span>
                                    <span className={cn("font-black font-sans text-[10px] sm:text-xs", microbeConfig.textColor)}>
                                      {microbeConfig.statusText === "Safe" ? "100%" : microbeConfig.statusText === "Warning" ? "50%" : "20%"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={cn("h-full rounded-full transition-all duration-500", microbeConfig.color)} 
                                      style={{ width: microbeConfig.statusText === "Safe" ? "100%" : microbeConfig.statusText === "Warning" ? "50%" : "20%" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-gray-100 flex justify-end">
                                <span className="text-[9px] font-bold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-0.5">
                                  Details <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>

                            {/* Card 2: Heavy Metals and Pollutants */}
                            <div 
                              onClick={() => setShowMetalsModal(true)}
                              className="flex flex-col space-y-2.5 p-3.5 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm group relative transition-all duration-200 justify-between"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                    <FlaskConical className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                                      <DefinitionLink term="Heavy Metals">
                                        Heavy Metals and Pollutants
                                      </DefinitionLink>
                                    </h4>
                                  </div>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-600 leading-normal font-medium">
                                  {chemicals.length === 0 && additives.length === 0
                                    ? "No chemical or additive data available." 
                                    : chemicalConfig.statusText === "Safe"
                                      ? "Lead, arsenic, and treatment additive levels meet safety guidelines."
                                      : chemicalConfig.statusText === "Warning"
                                        ? "Elevated levels detected for some chemical/treatment parameters."
                                        : "Critical exceedance of heavy metal or chemical limits."}
                                </p>

                                {/* Safety Bar */}
                                <div className="space-y-1 pt-1">
                                  <div className="flex justify-between items-center text-[10px] sm:text-xs">
                                    <span className="font-bold text-gray-500 font-sans">Safety:</span>
                                    <span className={cn("font-black font-sans text-[10px] sm:text-xs", chemicalConfig.textColor)}>
                                      {chemicalConfig.statusText === "Safe" ? "100%" : chemicalConfig.statusText === "Warning" ? "50%" : "20%"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={cn("h-full rounded-full transition-all duration-500", chemicalConfig.color)} 
                                      style={{ width: chemicalConfig.statusText === "Safe" ? "100%" : chemicalConfig.statusText === "Warning" ? "50%" : "20%" }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-gray-100 flex justify-end">
                                <span className="text-[9px] font-bold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-0.5">
                                  Details <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>

                            {/* Card 3: Water Hardness & Softeners */}
                            <div 
                              onClick={() => setShowAestheticModal(true)}
                              className="flex flex-col space-y-2.5 p-3.5 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm group relative transition-all duration-200 justify-between"
                            >
                              <div className="space-y-2">
                                {(() => {
                                  const hasAestheticData = selectedLocation && (selectedLocation.dwsp_data || (hardnessInfo && hardnessInfo.hardness > 0));
                                  return (
                                    <>
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                          <Waves className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
                                        </div>
                                        <div>
                                          <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                                            <DefinitionLink term="Hardness">
                                              Hardness & Softeners
                                            </DefinitionLink>
                                          </h4>
                                        </div>
                                      </div>
                                      
                                      {hasAestheticData ? (
                                        <>
                                          <p className="text-[10px] sm:text-xs text-gray-600 leading-normal font-medium mt-1">
                                            {hardnessInfo.statusText === "Very Hard Water" ? (
                                              "Very hard water found due to high minerals."
                                            ) : hardnessInfo.statusText === "Hard Water" ? (
                                              "Hard water found due to high minerals."
                                            ) : hardnessInfo.statusText === "Moderately Hard" ? (
                                              "Moderately hard water found due to mineral deposits."
                                            ) : (
                                              "Soft water found due to low mineral levels."
                                            )}
                                          </p>

                                          {/* Spectrum Indicator Bar */}
                                          <div className="space-y-1 mt-2.5">
                                            <div className="flex justify-between text-[7px] sm:text-[8px] font-bold text-slate-400">
                                              <span>Hardness Spectrum</span>
                                              <span>{hardnessInfo.hardness.toFixed(0)} mg/L</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full relative overflow-visible bg-slate-100 flex shadow-inner">
                                              <div className="h-full rounded-l-full bg-emerald-400" style={{ width: '20%' }} />
                                              <div className="h-full bg-blue-400" style={{ width: '20%' }} />
                                              <div className="h-full bg-amber-400" style={{ width: '20%' }} />
                                              <div className="h-full rounded-r-full bg-red-500" style={{ width: '40%' }} />
                                              
                                              {/* Positioned Marker */}
                                              {(() => {
                                                const clamped = Math.min(300, Math.max(0, hardnessInfo.hardness));
                                                const indicatorPct = (clamped / 300) * 100;
                                                return (
                                                  <div 
                                                    className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-indigo-600 shadow z-10 flex items-center justify-center"
                                                    style={{ left: `${indicatorPct}%` }}
                                                  />
                                                );
                                              })()}
                                            </div>
                                            <div className="flex justify-between text-[7px] font-black uppercase text-slate-400 pt-0.5">
                                              <span className="text-emerald-600">Soft</span>
                                              <span className="text-blue-500">Mod</span>
                                              <span className="text-amber-500">Hard</span>
                                              <span className="text-red-500">Very Hard</span>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <p className="text-[10px] sm:text-xs text-gray-600 leading-normal font-medium">
                                          No hardness data was found.
                                        </p>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                              <div className="pt-2 border-t border-gray-100 flex justify-end">
                                <span className="text-[9px] font-bold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-0.5">
                                  Details <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Parameter Check */}
                      <div className="space-y-4">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-950">Detailed Parameter Check</h3>
                        <div className="relative pb-4">
                          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                            {(showAllParameters ? sortedWaterTests : sortedWaterTests.slice(0, 6)).map((test, idx) => {
                              const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
                              const isExceeded = limitInfo ? limitInfo.isExceeded : (test.exceedanceCount && test.exceedanceCount > 0);
                              const category = getParameterCategory(test.contaminant);
                              const rowKey = `${test.contaminant}_${test.unit}`;
                              const isExpanded = !!expandedRows[rowKey];
                              const isExpandable = true;

                              const paramStatus = getParameterStatus(test, isExceeded, limitInfo);

                              return (
                                <div 
                                  key={idx}
                                  className={cn(
                                    "border rounded-xl transition-all overflow-hidden shadow-sm flex flex-col justify-between",
                                    paramStatus === "Action Required" 
                                      ? cn("border-red-200 bg-red-50/5", isExpanded && "ring-2 ring-blue-500/10 border-blue-400")
                                      : paramStatus === "Warning"
                                        ? cn("border-amber-200/60 bg-amber-50/20", isExpanded ? "ring-2 ring-blue-500/10 border-blue-400" : "hover:border-amber-300")
                                        : cn("border-gray-100 bg-white", isExpanded ? "ring-2 ring-blue-500/10 border-blue-400" : "hover:border-gray-200 hover:shadow-md")
                                  )}
                                >
                                  {/* Row Content (Horizontal on all screen sizes) */}
                                  <div 
                                    onClick={() => toggleRowExpansion(test.contaminant, test.unit)}
                                    className="p-3 sm:p-4 flex flex-row items-center justify-between gap-4 cursor-pointer select-none"
                                  >
                                    {/* Left side: Icon + Parameter Name */}
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                      {getParameterIcon(category)}
                                      <span className="font-bold text-gray-950 text-xs sm:text-sm leading-snug truncate">
                                        <DefinitionLink term={test.contaminant}>
                                          {formatParameterName(test.contaminant)}
                                        </DefinitionLink>
                                      </span>
                                    </div>

                                    {/* Right side: Safety Status Badge + Chevron */}
                                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                      <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className={cn(
                                          "w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center text-white shrink-0",
                                          paramStatus === "Action Required" ? "bg-red-500" : paramStatus === "Warning" ? "bg-amber-500" : "bg-green-500"
                                        )}>
                                          {paramStatus === "Action Required" ? (
                                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                          ) : paramStatus === "Warning" ? (
                                            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                          ) : (
                                            <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                        <span className={cn(
                                          "font-bold text-[10px] sm:text-xs leading-none",
                                          paramStatus === "Action Required" ? "text-red-600" : paramStatus === "Warning" ? "text-amber-600" : "text-green-600"
                                        )}>
                                          {paramStatus}
                                        </span>
                                      </div>
                                      <ChevronDown className={cn("w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200", isExpanded && "rotate-180")} />
                                    </div>
                                  </div>

                                  {/* Expandable panel */}
                                  <AnimatePresence initial={false}>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="border-t border-gray-100 bg-gray-50/50"
                                      >
                                        {(() => {
                                          const rowSamples = rawSamplesData[rowKey] || [];
                                          const precision = getParameterPrecision(test, rowSamples);
                                          return (
                                            <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 text-[10px] sm:text-xs text-gray-600">
                                              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm leading-snug">
                                                <div>
                                                  <p className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 font-sans">
                                                    {isExceeded ? "Highest Amount Detected" : "Average Amount Found"}
                                                  </p>
                                                  <p className="font-mono font-bold text-[10px] sm:text-sm text-gray-900">
                                                    {isExceeded
                                                      ? formatLevel(test.maxLevel !== undefined && test.maxLevel !== null ? test.maxLevel : test.level, test.unit, test.exceedanceCount || 0, precision)
                                                      : formatLevel(test.level, test.unit, test.exceedanceCount || 0, precision)
                                                    }
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 font-sans">Ontario Limit</p>
                                                  <p className="font-mono font-bold text-[10px] sm:text-sm text-gray-900">
                                                    {limitInfo ? formatLimitText(limitInfo.limitText, precision) : (test.legalLimit > 0 ? `${test.legalLimit.toFixed(precision)} ${formatUnitForDisplay(test.unit)}` : "No regulated limit")}
                                                  </p>
                                                </div>
                                                <div className="col-span-2 pt-1 border-t border-gray-50">
                                                  <p className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 font-sans">What is it?</p>
                                                  <p className="text-gray-600 leading-snug font-sans font-semibold sm:font-medium text-[9px] sm:text-xs">
                                                    {renderDescriptionWithLinksAndHighlights(getParameterDescription(test.contaminant))}
                                                  </p>
                                                </div>
                                                {isExpandable && (
                                                 <div className="space-y-1.5 pt-1 col-span-2">
                                                   <div className="flex justify-between items-center">
                                                     <span className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                                       All Samples: {rawSamplesData[rowKey] !== undefined ? rawSamplesData[rowKey].length : "..."}
                                                     </span>
                                                   </div>

                                                   {renderSampleHistory(rowKey, test, precision)}
                                                 </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })()}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>

                          {/* Show All overlay with fade out */}
                          {!showAllParameters && sortedWaterTests.length > 6 && (
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-2 pointer-events-none">
                              <button
                                onClick={() => setShowAllParameters(true)}
                                className="pointer-events-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer transform translate-y-3"
                              >
                                Show All Parameters ({sortedWaterTests.length}) <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Show Less option below the list */}
                        {showAllParameters && sortedWaterTests.length > 6 && (
                          <div className="flex justify-center pt-2">
                            <button
                              onClick={() => setShowAllParameters(false)}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              Show Less <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Health & Action Advice */}
                      <div className="space-y-3 sm:space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4">
                          {/* Health Card */}
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 flex items-start gap-2.5 sm:gap-3 shadow-inner">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 shadow-sm">
                              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-green-500 text-green-500" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Health</h4>
                              <p className="text-[11px] sm:text-sm text-gray-700 leading-normal font-semibold">
                                {exceedances.length > 0
                                  ? "Exceedance found. We recommend filtered water or checking local public health advisories."
                                  : "No immediate health risks associated with drinking this water."}
                              </p>
                            </div>
                          </div>

                          {/* Filters Card */}
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 flex items-start gap-2.5 sm:gap-3 shadow-inner">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 shadow-sm">
                              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 fill-blue-500/10" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Filters</h4>
                              <p className="text-[11px] sm:text-sm text-gray-700 leading-normal font-semibold">
                                {exceedances.length > 0
                                  ? "Active carbon or specialized heavy-metal filtration is recommended for this location."
                                  : "While safe, an optional charcoal filter can improve taste."}
                              </p>
                            </div>
                          </div>

                          {/* Updates Card */}
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 flex items-start gap-2.5 sm:gap-3 shadow-inner">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 shadow-sm">
                              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Updates</h4>
                              <p className="text-[11px] sm:text-sm text-gray-700 leading-normal font-semibold">
                                Last sampled: <span className="text-gray-950 font-bold">{getLatestSampleDate()}</span>.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  /* ---- TAB: Recommended Filters ---- */
                  (() => {
                    const rawRecs = recommendFiltersSmart(waterTests, exceedances);
                    const recs = rawRecs.map((r: any) => ({ ...r, ...filterRecDisplay(r) }));

                    if (recs.length === 0) {
                      return (
                        <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                          <Filter className="w-10 h-10 mx-auto mb-2 opacity-50" />
                          <p className="text-sm font-medium">No filter recommendations available</p>
                          <p className="text-xs mt-1">Test data is needed to generate personalized filter suggestions.</p>
                        </div>
                      );
                    }

                    const primaryRec = recs[0];
                    const secondaryRecs = recs.slice(1);
                    const amazonProduct = getAmazonProducts(primaryRec.primary)[0];

                    const detectedParams = waterTests.filter(t => {
                      const limitInfo = getOntarioLimitInfo(t.contaminant, t.level, t.unit, t.exceedanceCount || 0, t.parameterLimit);
                      const isExceeded = limitInfo ? limitInfo.isExceeded : (t.exceedanceCount && t.exceedanceCount > 0);
                      return isExceeded || (t.level !== null && t.level > 0);
                    });

                    return (
                      <div className="space-y-6">
                        {/* Featured Primary Filter Box */}
                        <div className="border border-blue-200 rounded-2xl p-5 sm:p-7 bg-gradient-to-br from-blue-50/20 via-white to-blue-50/10 shadow-md">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
                                {primaryRec.icon}
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                  Primary Recommendation
                                </span>
                                <h4 className="text-lg sm:text-2xl font-black text-gray-900 mt-1 leading-tight">
                                  {primaryRec.primary}
                                </h4>
                              </div>
                            </div>
                            <span className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 sm:self-start self-start",
                              primaryRec.primary.includes("Reverse Osmosis") 
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : primaryRec.primary.includes("Carbon")
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                              Highly Recommended
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-750 leading-relaxed font-medium">
                            {primaryRec.why}
                          </p>
                          <div className="mt-3.5">
                            <a
                              href={amazonProduct.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50/55 hover:bg-blue-50 border border-blue-100/60 hover:border-blue-200 text-blue-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                              <span>
                                View Compatible Filter on Amazon ({amazonProduct.price})
                                <span className="hidden sm:inline font-normal text-gray-505 ml-1.5 border-l border-blue-100 pl-1.5">
                                  {amazonProduct.name}
                                </span>
                              </span>
                              <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            </a>
                          </div>
                          {primaryRec.warning && (
                            <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5">
                              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-red-800 leading-relaxed font-semibold">{primaryRec.warning}</p>
                            </div>
                          )}
                        </div>

                        {/* Secondary Recommendations (if any) */}
                        {secondaryRecs.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="text-xs sm:text-sm font-extrabold text-gray-400 uppercase tracking-wider">Secondary Recommendations</h5>
                            <div className="grid grid-cols-1 gap-3">
                              {secondaryRecs.map((rec: any) => (
                                <div key={rec.primary} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex items-start gap-3 justify-between">
                                  <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center font-black shrink-0 text-sm">
                                      {rec.icon}
                                    </div>
                                    <div>
                                      <h5 className="text-xs sm:text-sm font-bold text-gray-900">{rec.primary}</h5>
                                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{rec.tagline}</span>
                                      <p className="text-[11px] sm:text-xs text-gray-505 mt-1 leading-relaxed">{rec.why}</p>
                                    </div>
                                  </div>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 self-start ${rec.badgeBg}`}>{rec.badgeText}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Detected Contaminants section */}
                        <div className="pt-6 border-t border-gray-100 space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-bold text-gray-950 text-sm sm:text-base">
                              Contaminants found:{" "}
                              <span className={cn(
                                "text-base sm:text-lg font-black",
                                exceedances.length > 0 ? "text-red-600" : "text-yellow-500"
                              )}>
                                {detectedParams.length}
                              </span>
                            </h4>
                            {exceedances.length > 0 ? (
                              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] sm:text-xs text-red-850 leading-relaxed font-semibold">
                                  <strong>High Risk:</strong> The contaminants below exceed standard drinking water thresholds. Make sure your chosen filtration system is certified to remove these specific compounds.
                                </p>
                              </div>
                            ) : (
                              <div className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed font-medium">
                                  <strong>Trace Contaminants Detected:</strong> No parameters exceeded health guidelines, but trace amounts are present. You can review their impacts and choose a filter type below.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Grid of contaminant cards */}
                          <div className="relative">
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                              {detectedParams.length === 0 ? (
                                <div className="col-span-full py-4 text-center text-xs text-gray-400 font-medium">
                                  No contaminants detected in trace or exceeded amounts.
                                </div>
                              ) : (
                                (showAllContaminants ? detectedParams : detectedParams.slice(0, isMobile ? 4 : 8)).map((param, pIdx) => {
                                const limitInfo = getOntarioLimitInfo(param.contaminant, param.level, param.unit, param.exceedanceCount || 0, param.parameterLimit);
                                const isExceeded = limitInfo ? limitInfo.isExceeded : (param.exceedanceCount && param.exceedanceCount > 0);
                                const filterTarget = getContaminantFilterTarget(param.contaminant);

                                return (
                                  <motion.div
                                    layout
                                    key={pIdx}
                                    className={cn(
                                      "border rounded-xl p-3 select-none shadow-sm flex flex-col justify-center",
                                      isExceeded
                                        ? "border-red-200 bg-red-50/10"
                                        : "border-yellow-200/50 bg-yellow-50/10",
                                      "sm:aspect-square sm:text-center"
                                    )}
                                  >
                                    <div className="flex flex-col w-full text-left sm:items-center sm:text-center gap-1.5 sm:gap-2">
                                      {/* Contaminant Name */}
                                      <span className={cn(
                                        "font-extrabold text-[11px] sm:text-base leading-snug truncate sm:whitespace-normal sm:line-clamp-2",
                                        isExceeded ? "text-red-600" : "text-amber-600"
                                      )}>
                                        {formatParameterName(param.contaminant)}
                                      </span>

                                      {/* Recommended Filter (bold) */}
                                      <span className="font-bold text-[10px] sm:text-sm text-blue-600">
                                        {filterTarget}
                                      </span>

                                      {/* Reason (small text below) */}
                                      <span className="text-[9px] sm:text-xs text-gray-500 font-medium leading-tight">
                                        {getFilterActionDescription(filterTarget)}
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })
                            )}
                          </div>

                          {/* Pagination controls for Contaminants grid */}
                          {detectedParams.length > (isMobile ? 4 : 8) && (
                            <div className="flex justify-center mt-4">
                              {showAllContaminants ? (
                                <button
                                  onClick={() => setShowAllContaminants(false)}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                >
                                  Show Less <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setShowAllContaminants(true)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                  {isMobile ? (
                                    <>Show More <ChevronDown className="w-3.5 h-3.5" /></>
                                  ) : (
                                    <>Show All ({detectedParams.length}) <ChevronDown className="w-3.5 h-3.5" /></>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cross-link to Filter Guide */}
                        <div className="pt-3 px-1 text-center sm:text-left">
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            Learn more about how these systems work in our <a href="/filters" className="text-blue-600 font-semibold hover:text-blue-800 underline">Filter Guide</a>.
                          </p>
                        </div>
                      </div>
                    );
                  })()
                ))}
              </div>

              {/* Return to Results (bottom) */}
              <div className="text-center pt-2">
                <button
                  onClick={() => { navigate(`/search/${encodeURIComponent(routeQuery || searchTerm)}`); setDetailTab('quality'); }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Results
                </button>
              </div>
            </motion.div>
          )}

        {/* Initial empty state */}
        {!hasSearched && !selectedLocation && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-lg mx-auto text-center bg-blue-50/50 border border-blue-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-blue-200">
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">Search for a location</h3>
          </motion.div>
        )}
        {/* Bacteria & Microbes Modal */}
        {showMicrobesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMicrobesModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-slate-50/95 rounded-[32px] max-w-md w-full shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden z-10"
            >
              <div className="bg-white px-5 py-4 border-b border-slate-100/80 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-green-600 fill-green-600/10 shrink-0" />
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Bacteria & Microbes</span>
                </div>
                <button
                  onClick={() => setShowMicrobesModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full cursor-pointer z-20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-b from-green-50/50 via-green-100/10 to-white flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-2 text-center py-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight px-1">
                    Microbiological Safety
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-500 font-semibold leading-relaxed px-4">
                    Pathogen monitoring and microbial analysis details.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Microscope className="w-5 h-5" />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">
                        <DefinitionLink term="Microbes">
                          Biological Status
                        </DefinitionLink>
                      </h4>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border",
                      microbeConfig.statusText === "Safe"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    )}>
                      {microbeConfig.statusText}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-left border-t border-slate-100/80 pt-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Pathogens Monitored</span>
                        {renderDescriptionWithLinksAndHighlights("Escherichia coli (E. coli) and Total Coliform bacteria.")}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Strict Limit</span>
                        Safety guidelines require exactly zero CFU/100mL for all pathogens.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Droplet className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Current Findings</span>
                        {microbes.length === 0
                          ? "No microbial testing results are available for the selected year."
                          : microbeConfig.statusText === "Safe"
                            ? "All biological criteria met. Zero E. coli or coliform counts detected."
                            : "Microbial limits exceeded. Fecal indicator or system breakdown warning."}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Filter className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Practical Advice</span>
                        {microbeConfig.statusText === "Safe"
                          ? "Water is safe for consumption. No boiling or disinfection required."
                          : "Boil water for at least 1 minute or use a certified UV system."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-center">
                  <Link
                    to="/education#microbes"
                    onClick={() => setShowMicrobesModal(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1.5 transition-colors"
                  >
                    Deep-dive: Pathogen & Bacteria Science <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Heavy Metals and Pollutants Modal */}
        {showMetalsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMetalsModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-slate-50/95 rounded-[32px] max-w-md w-full shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden z-10"
            >
              <div className="bg-white px-5 py-4 border-b border-slate-100/80 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-600 fill-blue-600/10 shrink-0" />
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Heavy Metals & Pollutants</span>
                </div>
                <button
                  onClick={() => setShowMetalsModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full cursor-pointer z-20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-b from-blue-50/50 via-blue-100/10 to-white flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-2 text-center py-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight px-1">
                    Heavy Metals & Pollutants
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-500 font-semibold leading-relaxed px-4">
                    Analysis of heavy metals, chemical runoff, and disinfection additives.
                  </p>
                </div>

                {/* Section 1: Heavy Metals & Runoff */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">
                        <DefinitionLink term="Heavy Metals">
                          Toxic Metals & Runoff
                        </DefinitionLink>
                      </h4>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border",
                      getSafetyBarConfig(waterTests, ['chemical']).statusText === "Safe"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : getSafetyBarConfig(waterTests, ['chemical']).statusText === "Warning"
                          ? "bg-orange-100 text-orange-800 border-orange-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    )}>
                      {getSafetyBarConfig(waterTests, ['chemical']).statusText}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-left border-t border-slate-100/80 pt-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Monitored Contaminants</span>
                        {renderDescriptionWithLinksAndHighlights("Lead, arsenic, mercury, copper, cadmium, antimony, and uranium.")}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Droplet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Common Sources</span>
                        Corroding old copper/brass household pipes, plumbing solder, or industrial/agricultural runoff.
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Status Findings</span>
                        {chemicals.length === 0
                          ? "No chemical pollutant measurements available for this year."
                          : getSafetyBarConfig(waterTests, ['chemical']).statusText === "Safe"
                            ? "All tested metals and chemicals meet strict safe consumption guidelines."
                            : "Elevated levels detected. Reverse Osmosis (RO) system recommended."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Added Minerals & Treatments */}
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">
                        <DefinitionLink term="Fluoride">
                          Disinfection & Additives
                        </DefinitionLink>
                      </h4>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border",
                      additiveConfig.statusText === "Safe"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    )}>
                      {additiveConfig.statusText}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-left border-t border-slate-100/80 pt-3">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Disinfectants Used</span>
                        {renderDescriptionWithLinksAndHighlights("Chlorine is added by water treatment facilities to sanitize supply and eliminate pathogens.")}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Smile className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Fluoridation details</span>
                        {renderDescriptionWithLinksAndHighlights("Fluoride is maintained at low, safe levels (0.5 to 0.8 mg/L) to prevent tooth decay.")}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Current Levels</span>
                        {getAdditivesDescription(additives)}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Filter className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                      <div className="text-[10px] sm:text-xs text-slate-600 leading-snug">
                        <span className="font-extrabold text-slate-800 block">Filtration Option</span>
                        Activated carbon filters (pitcher/faucet mount) easily absorb chlorine and improve taste.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-center">
                  <Link
                    to="/education#metals"
                    onClick={() => setShowMetalsModal(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1.5 transition-colors"
                  >
                    Deep-dive: Heavy Metals & Runoff <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Water Hardness & Softeners Modal */}
        {showAestheticModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAestheticModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-slate-50/95 rounded-[32px] max-w-md w-full shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden z-10"
            >
              <div className="bg-white px-5 py-4 border-b border-slate-100/80 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <Waves className="w-5 h-5 text-indigo-600 fill-indigo-600/10 shrink-0" />
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Hardness & Softeners</span>
                </div>
                <button
                  onClick={() => setShowAestheticModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full cursor-pointer z-20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-b from-indigo-50/50 via-indigo-100/10 to-white flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-2 text-center py-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight px-1">
                    Water Hardness & Softeners
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-500 font-semibold leading-relaxed px-4">
                    Analysis of secondary minerals (calcium and magnesium) and dedicated guidance on softeners and filtration.
                  </p>
                </div>

                {selectedLocation?.is_regional_estimate && (
                  <div className="p-2 sm:p-3 bg-blue-50/80 border border-blue-100/50 rounded-xl text-[10px] sm:text-xs text-blue-700 leading-relaxed font-semibold text-center max-w-sm mx-auto shadow-sm">
                    Specific data was not found for this region, so we estimate based on the surrounding {selectedLocation.estimate_city_name || "local"} municipal water data!
                  </div>
                )}

                {selectedLocation && (selectedLocation.dwsp_data || (hardnessInfo && hardnessInfo.hardness > 0)) ? (
                  <div className="space-y-5">
                    {(() => {
                      const hardness = hardnessInfo.hardness;
                      const status = hardnessInfo.statusText;
                      const hardnessStatusText = (status === "Hard Water" || status === "Very Hard Water") ? "Attention Required" : "Safe";
                      
                      let badgeColors = "bg-emerald-100 text-emerald-800 border-emerald-200";
                      let circleBgAndText = "bg-emerald-50 text-emerald-600";
                      let iconColor = "text-emerald-600";
                      
                      if (hardnessStatusText === "Attention Required") {
                        badgeColors = "bg-red-100 text-red-800 border-red-200";
                        circleBgAndText = "bg-red-50 text-red-600";
                        iconColor = "text-red-600";
                      }
                      
                      return (
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", circleBgAndText)}>
                                <Waves className="w-5 h-5" />
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Hardness Classification</h4>
                            </div>
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border", badgeColors)}>
                              {hardnessStatusText} ({status})
                            </span>
                          </div>
                          
                          <div className="space-y-4 text-left">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Smile className={cn("w-4.5 h-4.5 shrink-0", iconColor)} />
                                <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">What It Feels Like</span>
                              </div>
                              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                                {hardnessInfo.feelsLike}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Wrench className={cn("w-4.5 h-4.5 shrink-0", iconColor)} />
                                <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Practical Advice</span>
                              </div>
                              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                                {hardnessInfo.practicalAdvice}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end text-[8px] sm:text-[10px] text-gray-400 font-bold pt-2 border-t border-slate-100/50">
                            <span>System Average: {hardness > 0 ? `${hardness.toFixed(0)} mg/L` : "Not Tracked"}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Dynamic Hard Water Effects Card */}
                    {(() => {
                      const hardness = hardnessInfo.hardness;
                      const status = hardnessInfo.statusText;
                      
                      // 1. Soft Water Effects (hardness <= 60)
                      if (status === "Soft Water" || hardness <= 60) {
                        return (
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Check className="w-5 h-5 text-emerald-600" />
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Soft Water Effects</h4>
                            </div>
                            <div className="space-y-4 text-left">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Great Soap Lather</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Soaps and shampoos lather incredibly easily. You can use 50% less soap and detergent for the same cleaning.
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Smooth Skin & Hair</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Hair feels naturally soft and clean. Skin retains its natural moisture without a drying mineral soap film.
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Scale-Free Plumbing</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Faucets, pipes, and appliances stay completely clean and free of white crusty buildup, extending their lifetime.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // 2. Moderately Hard Water Effects (60 < hardness <= 120)
                      if (status === "Moderately Hard" || (hardness > 60 && hardness <= 120)) {
                        return (
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Waves className="w-5 h-5 text-blue-600" />
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Moderately Hard Water Effects</h4>
                            </div>
                            <div className="space-y-4 text-left">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Mild Mineral Spots</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  You may notice slight white spots on glassware, shower doors, and chrome fixtures after air drying.
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Slight Soap Reduction</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Lathering soap and shampoo requires slightly more effort and water, but soap residue/film is minimal.
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Low Scale Accumulation</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Very slow, harmless mineral buildup may occur inside kettles and hot water tanks over several years.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // 3. Very Hard Water Effects (hardness > 180)
                      if (status === "Very Hard Water" || hardness > 180) {
                        return (
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight text-red-700">Very Hard Water Effects</h4>
                            </div>
                            <div className="space-y-4 text-left">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Severe Appliance Scaling</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Heavy, rock-like scale builds up rapidly in water heaters, boilers, and pipes, restricting water flow and causing early failures.
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Hair & Skin Damage</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  High minerals leave a drying film on skin, exacerbate eczema/irritation, and make hair extremely dry, brittle, and stiff.
                                </p>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">No Soap Lather & Heavy Film</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                  Soap forms a sticky curd instead of lathering. Dishes get cloudy and spotted, and clothes look dingy, feel rough, and wear out 25% faster.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // 4. Default: Hard Water (120 < hardness <= 180)
                      return (
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <Sparkles className="w-5 h-5 text-amber-600" />
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Hard Water Effects</h4>
                          </div>
                          <div className="space-y-4 text-left">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Hair & Skin Dryness</span>
                              </div>
                              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                High minerals dry out your skin, make hair feel dry or straw-like, and can cause itchy scalp or dandruff.
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Mineral Stains & Crusts</span>
                              </div>
                              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                Leaves white, chalky scale buildup on faucets, showerheads, glassware, and dishes that is hard to scrub off.
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Soap & Detergent Issues</span>
                              </div>
                              <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-3.5">
                                Minerals block soap from lathering properly. You end up using more soap, and clothes can look dingy or feel stiff.
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center text-xs text-slate-500 font-semibold leading-relaxed my-4">
                    Hardness data not explicitly tracked for this specific facility pipeline. Water is regulated under provincial baseline compliance guidelines.
                  </div>
                )}

                <div className="pt-2 flex justify-center">
                  <Link
                    to="/education#hardness"
                    onClick={() => setShowAestheticModal(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1.5 transition-colors text-center"
                  >
                    View Softeners & Filtration Guidance in Education Tab <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
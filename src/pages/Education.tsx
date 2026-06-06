import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { Info, Droplets, Waves, Shield, AlertTriangle, Beaker, TrendingUp, Search, X, ArrowUpDown, Settings, Droplet, Filter } from "lucide-react";

export function getSlug(term: string): string {
  let slug = term.toLowerCase()
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*&\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug === "escherichia-coli" || slug === "e-coli" || slug === "total-coliform" || slug === "coliform") {
    return "microbes";
  }
  if (slug === "nitrate-nitrite" || slug === "nitrate-nitrite-as-nitrogen" || slug === "nitrate-as-nitrogen" || slug === "nitrite-as-nitrogen") {
    return "nitrate";
  }
  if (slug === "trihalomethane" || slug === "trihalomethanes" || slug === "trihalomethanes-total" || slug === "trihalomethanes-thms") {
    return "trihalomethanes-thms";
  }
  if (slug === "haloacetic" || slug === "total-haloacetic-acids" || slug === "haloacetic-acids" || slug === "haloacetic-acids-haas") {
    return "haloacetic-acids-haas";
  }
  if (slug === "calcium-magnesium") {
    return "calcium-magnesium";
  }
  if (["hardness", "iron", "manganese", "aluminum", "zinc", "ph", "sodium", "turbidity"].includes(slug)) {
    return "hardness";
  }
  return slug;
}

// Expanded minerals list covering contaminants from Ontario water reports
const minerals = [
  {
    name: "Calcium & Magnesium",
    category: "Essential Mineral",
    description: "Minerals that make water hard. They can leave crusty white stains on pipes and faucets, but they are completely safe and healthy to drink.",
    commonSources: "Groundwater flowing through limestone rock.",
  },
  {
    name: "Lead",
    category: "Health Concern",
    description: "A toxic metal that can leak into water from old household pipes and plumbing. No amount is safe, and it can harm brain development in kids.",
    commonSources: "Old lead service pipes and brass metal fixtures.",
  },
  {
    name: "Nitrate",
    category: "Health Concern",
    description: "A farm chemical from fertilizers and animal waste. High levels are dangerous for babies under six months, making it hard for their blood to carry oxygen.",
    commonSources: "Fertilizers and septic systems washing into groundwater.",
  },
  {
    name: "Nitrite",
    category: "Health Concern",
    description: "A toxic chemical related to nitrate. Even small amounts can interfere with how oxygen is carried in the blood.",
    commonSources: "Fertilizer runoff and decaying plants or sewage.",
  },
  {
    name: "Chlorine",
    category: "Treatment Agent",
    description: "A sanitizer added by city water systems to kill harmful germs. It is vital for safety, but too much can give water a pool-like taste and smell.",
    commonSources: "Added at city water treatment plants to keep water safe.",
  },
  {
    name: "Arsenic",
    category: "Health Concern",
    description: "A natural poison found in rocks. High levels in well water over many years increase cancer risks and can cause skin issues.",
    commonSources: "Natural soil deposits dissolving into groundwater.",
  },
  {
    name: "Fluoride",
    category: "Treatment Agent",
    description: "A natural mineral added to city water to prevent tooth decay. Tightly controlled, but excessive amounts can stain teeth or weaken bones.",
    commonSources: "Added to city water, or occurs naturally in rock.",
  },
  {
    name: "Trihalomethanes (THMs)",
    category: "Byproduct",
    description: "Chemical byproducts created when chlorine disinfectants react with organic debris. Long-term exposure can increase cancer risk.",
    commonSources: "Formed during water disinfection treatment.",
  },
  {
    name: "Haloacetic Acids (HAAs)",
    category: "Byproduct",
    description: "Sanitizing byproducts from chlorination. Consuming high amounts over a very long time can cause liver/kidney damage and raise cancer risk.",
    commonSources: "Byproduct of disinfecting water with chlorine.",
  },
  {
    name: "Copper",
    category: "Essential Mineral",
    description: "A metal that leaks into tap water as home copper pipes wear down. Too much copper causes a bitter metallic taste and stomach upset.",
    commonSources: "Corroding household copper pipes.",
  },
  {
    name: "Mercury",
    category: "Health Concern",
    description: "A toxic heavy metal from factory waste. Very rare in city water, but long-term exposure can cause brain and kidney damage.",
    commonSources: "Industrial pollution or natural deposits.",
  },
  {
    name: "Cadmium",
    category: "Health Concern",
    description: "A toxic metal from industrial waste and pipe rust. It stays in the body a long time and can damage kidneys and bones.",
    commonSources: "Factory runoff or rusty galvanized water pipes.",
  },
  {
    name: "Chromium",
    category: "Health Concern",
    description: "A metal from natural erosion or factories. High levels can cause skin rashes and damage kidneys over time.",
    commonSources: "Factory waste or natural erosion of rocks.",
  },
  {
    name: "Uranium",
    category: "Health Concern",
    description: "A natural radioactive metal in rocks. Drinking high levels can damage kidneys and expose you to low-level radiation.",
    commonSources: "Deep underground rock formations.",
  },
  {
    name: "Barium",
    category: "Health Concern",
    description: "A natural mineral found in deep rocks. High amounts can raise blood pressure and cause abnormal heart rhythms.",
    commonSources: "Natural rocks or industrial waste.",
  },
  {
    name: "Boron",
    category: "Essential Mineral",
    description: "A natural element in groundwater. High levels can affect health and reproduction, so Ontario keeps limits strict.",
    commonSources: "Natural rock erosion or wastewater.",
  },
  {
    name: "Selenium",
    category: "Essential Mineral",
    description: "An essential trace mineral. Beneficial in small amounts, but too much can make hair and nails brittle.",
    commonSources: "Natural deposits or farm runoff.",
  },
  {
    name: "Antimony",
    category: "Health Concern",
    description: "A metal from factory processes or pipe solders. Consuming high levels over time causes stomach pain and heart issues.",
    commonSources: "Industrial emissions or plumbing solder.",
  },
  {
    name: "Benzene",
    category: "Health Concern",
    description: "A dangerous chemical compound linked to cancer. Regulated strictly in Ontario to a safe limit of 5 µg/L.",
    commonSources: "Industrial chemical spills or leaking fuel tanks.",
  },
  {
    name: "Vinyl Chloride",
    category: "Health Concern",
    description: "A chemical used to make plastics. Traces can leach into water from old PVC pipes. Strictly monitored to prevent cancer risks.",
    commonSources: "Old plastic pipes or chemical waste.",
  },
  {
    name: "PCBs",
    category: "Health Concern",
    description: "Banned industrial chemicals that last a long time in the environment. Extremely rare in modern drinking water systems.",
    commonSources: "Old industrial equipment or landfill leaks.",
  },
  {
    name: "Atrazine",
    category: "Pesticide",
    description: "A common farm weedkiller. High levels can affect hormones. Ontario monitors it closely in agricultural areas.",
    commonSources: "Runoff from treated farm fields.",
  },
  {
    name: "Glyphosate",
    category: "Pesticide",
    description: "A widely used weedkiller (Roundup). Monitored closely in Ontario water to ensure it stays well below safety limits.",
    commonSources: "Farm and home garden runoff.",
  },
  {
    name: "NDMA",
    category: "Byproduct",
    description: "A chemical byproduct from industrial processes and disinfection. Regulated under very strict, low limits to prevent cancer risk.",
    commonSources: "Byproduct of water treatment and factories.",
  },
  {
    name: "2,4-D",
    category: "Pesticide",
    description: "A common weedkiller used on lawns and farms. Levels are tested regularly to make sure they remain safe.",
    commonSources: "Runoff from lawns, parks, and farm fields.",
  },
  {
    name: "Total Coliform",
    category: "Health Concern",
    description: "Microscopic bacteria that can indicate contamination from soil, surface water, or sewage. High levels can cause intestinal issues.",
    commonSources: "Soil, surface water, or sewage.",
  },
  {
    name: "1,1-Dichloroethylene (vinylidene chloride)",
    category: "Health Concern",
    description: "An industrial chemical used to make plastic wrap and adhesives. Regulated strictly to prevent liver and kidney damage.",
    commonSources: "Industrial plastic manufacturing discharge."
  },
  {
    name: "1,2-Dichlorobenzene",
    category: "Health Concern",
    description: "A chemical used in industrial solvents, dyes, and paints. High levels can affect the liver and nervous system.",
    commonSources: "Industrial chemical factories and solvent releases."
  },
  {
    name: "1,2-Dichloroethane",
    category: "Health Concern",
    description: "A solvent used to make PVC pipes. It is regulated in drinking water because long-term exposure can raise cancer risk.",
    commonSources: "Industrial factory discharge and plastic manufacturing."
  },
  {
    name: "1,4-Dichlorobenzene",
    category: "Health Concern",
    description: "A chemical compound used in deodorizers and plastics. Long-term exposure can cause liver and kidney damage.",
    commonSources: "Industrial emissions or sewer deodorizer runoff."
  },
  {
    name: "2,3,4,6-Tetrachlorophenol",
    category: "Health Concern",
    description: "A chemical compound historically used as a wood preservative. Regulated in water systems due to toxicity concerns.",
    commonSources: "Wood preservation facilities and industrial runoff."
  },
  {
    name: "2,4,6-Trichlorophenol",
    category: "Health Concern",
    description: "A chemical byproduct used in pesticides and wood preservatives. Long-term consumption can increase cancer risk.",
    commonSources: "Pesticide manufacturers or chemical byproducts."
  },
  {
    name: "2,4-Dichlorophenol",
    category: "Health Concern",
    description: "A chemical compound used to make pesticides. High levels can cause kidney and liver issues.",
    commonSources: "Chemical factory runoff and pesticide degradation."
  },
  {
    name: "Alachlor",
    category: "Pesticide",
    description: "An agricultural herbicide used to control weeds in corn and soy crops. Strictly regulated due to potential health effects.",
    commonSources: "Agricultural field runoff."
  },
  {
    name: "Aluminum",
    category: "Essential Mineral",
    description: "A natural metal in the environment. High levels can discolor water or give it a metallic taste.",
    commonSources: "Natural rocks, soil, or water treatment plants."
  },
  {
    name: "Azinphos-methyl",
    category: "Pesticide",
    description: "An organophosphate insecticide. Monitored strictly in water to ensure levels remain safe for public consumption.",
    commonSources: "Runoff from agricultural orchards."
  },
  {
    name: "Benzo(a)pyrene",
    category: "Health Concern",
    description: "A byproduct of incomplete combustion of organic materials like coal tar or fuel. Strictly regulated due to high toxicity and cancer risk.",
    commonSources: "Industrial emissions, line coatings, or road runoff."
  },
  {
    name: "Bromate",
    category: "Byproduct",
    description: "A chemical byproduct formed when ozone used for water treatment reacts with natural bromide. High levels can increase cancer risk.",
    commonSources: "Disinfection treatment byproduct."
  },
  {
    name: "Bromide",
    category: "Essential Mineral",
    description: "A naturally occurring salt found in groundwater. It is harmless on its own but can form toxic byproducts during disinfection.",
    commonSources: "Deep groundwater deposits."
  },
  {
    name: "Bromoxynil",
    category: "Pesticide",
    description: "A pesticide used to control weeds in grain crops. Monitored closely in agricultural regions to protect tap water safety.",
    commonSources: "Agricultural crop spraying runoff."
  },
  {
    name: "Carbaryl",
    category: "Pesticide",
    description: "A common insecticide used to control insects on crops and lawns. Levels in drinking water are kept well below safety limits.",
    commonSources: "Crop protection runoff and lawn care."
  },
  {
    name: "Carbofuran",
    category: "Pesticide",
    description: "A toxic insecticide used on various agricultural crops. Strictly regulated in Ontario to protect drinking water sources.",
    commonSources: "Agricultural soil treatment runoff."
  },
  {
    name: "Carbon tetrachloride",
    category: "Health Concern",
    description: "A toxic solvent once widely used in cleaning agents. Banned in household items, it is monitored to prevent liver and kidney issues.",
    commonSources: "Industrial solvent disposal and chemical plants."
  },
  {
    name: "Chlorate",
    category: "Byproduct",
    description: "A byproduct formed during water disinfection when using chlorine dioxide or sodium hypochlorite. Regulated to protect red blood cells.",
    commonSources: "Water purification disinfection byproduct."
  },
  {
    name: "Chlorite",
    category: "Byproduct",
    description: "A byproduct of water treatment disinfection using chlorine dioxide. Strictly monitored to prevent nervous system issues.",
    commonSources: "Disinfection of public drinking water."
  },
  {
    name: "Chlorpyrifos",
    category: "Pesticide",
    description: "An insecticide used in farming and greenhouses. Ontario monitors its levels closely to prevent nervous system risks.",
    commonSources: "Agricultural insecticide application."
  },
  {
    name: "Diazinon",
    category: "Pesticide",
    description: "An agricultural insecticide. Ontario regulates its presence to ensure levels stay safe for public use.",
    commonSources: "Lawn, garden, and crop insecticide runoff."
  },
  {
    name: "Dicamba",
    category: "Pesticide",
    description: "A herbicide used to control broadleaf weeds. Levels are monitored to protect water quality in agricultural zones.",
    commonSources: "Broadleaf weed control on farms."
  },
  {
    name: "Dichloromethane",
    category: "Health Concern",
    description: "An organic solvent used in paint strippers and metal cleaning. Regulated strictly in drinking water due to potential health risks.",
    commonSources: "Industrial paint strippers and factory solvents."
  },
  {
    name: "Diclofop-methyl",
    category: "Pesticide",
    description: "A selective herbicide used to control wild oats and annual grassy weeds. Regulated to ensure safety.",
    commonSources: "Agricultural field application."
  },
  {
    name: "Dimethoate",
    category: "Pesticide",
    description: "An organophosphate insecticide used on agricultural crops. Monitored strictly in drinking water systems.",
    commonSources: "Runoff from agricultural crop spraying."
  },
  {
    name: "Dioxin and furan",
    category: "Health Concern",
    description: "Highly toxic industrial byproducts of combustion and chemical manufacturing. Strictly regulated at extremely low levels.",
    commonSources: "Industrial incineration and waste incineration."
  },
  {
    name: "Diquat",
    category: "Pesticide",
    description: "A fast-acting herbicide used to control aquatic weeds. Regulated to prevent liver and kidney issues.",
    commonSources: "Aquatic weed control runoff."
  },
  {
    name: "Dissolved Organic Carbon",
    category: "Essential Mineral",
    description: "Organic carbon compounds dissolved in water from decaying leaves and plants. Harmless on its own but can form byproducts.",
    commonSources: "Natural organic decay in surface water sources."
  },
  {
    name: "Diuron",
    category: "Pesticide",
    description: "A herbicide used for weed control in agricultural and non-crop areas. Regulated to ensure safety.",
    commonSources: "Industrial vegetation control and farming."
  },
  {
    name: "Gross Alpha",
    category: "Health Concern",
    description: "Alpha particle radiation from natural radioactive minerals in deep rocks. Monitored to prevent long-term cancer risks.",
    commonSources: "Deep underground rock formations."
  },
  {
    name: "Gross Beta",
    category: "Health Concern",
    description: "Beta particle radiation from natural and man-made radioactive minerals. Regulated to ensure public safety.",
    commonSources: "Natural radioactive deposits or industrial emissions."
  },
  {
    name: "Iron",
    category: "Essential Mineral",
    description: "A common natural metal in groundwater. It is harmless to health but can discolor water and leave red-brown stains.",
    commonSources: "Natural soil deposits or corroding pipes."
  },
  {
    name: "MCPA",
    category: "Pesticide",
    description: "A herbicide used to control broadleaf weeds in crops and turf. Monitored regularly to ensure water remains safe.",
    commonSources: "Pasture and agricultural field runoff."
  },
  {
    name: "Malathion",
    category: "Pesticide",
    description: "A widely used insecticide for farming and mosquito control. Regulated in water to ensure levels stay safe.",
    commonSources: "Mosquito control spraying or agricultural runoff."
  },
  {
    name: "Manganese",
    category: "Essential Mineral",
    description: "A naturally occurring mineral. Harmless in small amounts, but high levels can leave black stains and affect water taste.",
    commonSources: "Natural soil deposits or groundwater erosion."
  },
  {
    name: "Metolachlor",
    category: "Pesticide",
    description: "A herbicide used on corn, soybeans, and other crops. Regularly monitored in drinking water sources.",
    commonSources: "Agricultural crop herbicide runoff."
  },
  {
    name: "Metribuzin",
    category: "Pesticide",
    description: "A herbicide used to control weeds in potato, tomato, and soybean crops. Regulated to protect drinking water.",
    commonSources: "Agricultural crop protection runoff."
  },
  {
    name: "Microcystin",
    category: "Health Concern",
    description: "A natural toxin produced by blue-green algae blooms. Highly toxic to the liver; strictly monitored during warm seasons.",
    commonSources: "Warm-weather blue-green algae blooms in lakes."
  },
  {
    name: "Monochlorobenzene",
    category: "Health Concern",
    description: "An industrial solvent and chemical intermediate. High levels can affect the liver, kidneys, and nervous system.",
    commonSources: "Chemical manufacturing and solvent waste."
  },
  {
    name: "O-Phosphate",
    category: "Essential Mineral",
    description: "Orthophosphate is added to water systems to coat pipes and prevent lead from leaching into tap water.",
    commonSources: "Added at municipal water treatment plants."
  },
  {
    name: "Organic Carbon",
    category: "Essential Mineral",
    description: "Total organic carbon from natural vegetation decay. Indicates general biological activity and organic content.",
    commonSources: "Natural plants and organic material decay."
  },
  {
    name: "Paraquat",
    category: "Pesticide",
    description: "A highly toxic agricultural herbicide. Regulated strictly to prevent accidental exposure and protect water safety.",
    commonSources: "Agricultural field weed control runoff."
  },
  {
    name: "Pentachlorophenol",
    category: "Health Concern",
    description: "A heavy-duty wood preservative chemical. Regulated strictly in drinking water due to high toxicity.",
    commonSources: "Wood treatment facilities and chemical spills."
  },
  {
    name: "Phorate",
    category: "Pesticide",
    description: "A highly toxic organophosphate insecticide used on agricultural crops. Monitored strictly to prevent health risks.",
    commonSources: "Agricultural soil treatment runoff."
  },
  {
    name: "Picloram",
    category: "Pesticide",
    description: "A herbicide used to control woody plants and broadleaf weeds. Monitored closely in farming regions.",
    commonSources: "Agricultural field application."
  },
  {
    name: "Prometryne",
    category: "Pesticide",
    description: "A selective herbicide used for weed control. Regulated in Ontario to ensure levels stay within safety limits.",
    commonSources: "Crop herbicide runoff."
  },
  {
    name: "Simazine",
    category: "Pesticide",
    description: "A herbicide used to control weeds in crop and non-crop areas. Regulated to protect public drinking water.",
    commonSources: "Agricultural weed control runoff."
  },
  {
    name: "Sulphide",
    category: "Essential Mineral",
    description: "A natural compound that can give water a 'rotten egg' smell. Harmless to health but aesthetically unpleasant.",
    commonSources: "Natural underground geologic formations."
  },
  {
    name: "Terbufos",
    category: "Pesticide",
    description: "A toxic soil insecticide used on agricultural crops. Regulated strictly to keep drinking water safe.",
    commonSources: "Farming soil insecticide runoff."
  },
  {
    name: "Tetrachloroethylene (perchloroethylene)",
    category: "Health Concern",
    description: "A dry-cleaning solvent and industrial degreaser. Regulated strictly to prevent liver damage and cancer risk.",
    commonSources: "Dry cleaners and industrial waste."
  },
  {
    name: "Toluene",
    category: "Health Concern",
    description: "An industrial chemical found in gasoline and solvents. High levels can cause nervous system and kidney issues.",
    commonSources: "Industrial petroleum product discharge."
  },
  {
    name: "Triallate",
    category: "Pesticide",
    description: "A herbicide used to control wild oats in cereal crops. Monitored regularly in agricultural water supplies.",
    commonSources: "Cereal crop herbicide runoff."
  },
  {
    name: "Trichloroethylene",
    category: "Health Concern",
    description: "A toxic solvent used as a metal degreaser. Regulated strictly in drinking water to prevent cancer risk.",
    commonSources: "Industrial factory degreasing waste."
  },
  {
    name: "Trifluralin",
    category: "Pesticide",
    description: "A widely used herbicide. Ontario monitors it to make sure agricultural runoff does not affect drinking water.",
    commonSources: "Runoff from farming field weed control."
  },
  {
    name: "Tritium",
    category: "Health Concern",
    description: "A radioactive isotope of hydrogen, naturally occurring or from nuclear facilities. Ontario regulates it strictly.",
    commonSources: "Nuclear power plants or natural reactions."
  },
  {
    name: "Zinc",
    category: "Essential Mineral",
    description: "An essential trace mineral. Beneficial in small amounts, but high levels cause metallic taste and cloudy water.",
    commonSources: "Natural rocks or corroded galvanized pipes."
  }
];

function highlightMatchedText(text: string, search: string): React.ReactNode {
  if (!search || !search.trim()) return text;
  const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase()
          ? <mark key={i} className="bg-yellow-100 text-gray-900 rounded-sm px-0.5 font-semibold">{part}</mark>
          : part
      )}
    </>
  );
}

// Mineral data for trend chart: avg values across Ontario by year
const MINERAL_TRENDS = [
  { name: "Lead", unit: "μg/L", data: { 2016: 2.6, 2017: 3.4, 2018: 3.5, 2019: 3.5, 2020: 2.1, 2021: 4.3, 2022: 2.7, 2023: 2.3, 2024: 2.4, 2025: 1.6 }, color: "#ef4444", limit: 15 },
  { name: "Arsenic", unit: "μg/L", data: { 2016: 1.4, 2017: 1.6, 2018: 1.4, 2019: 1.6, 2020: 1.3, 2021: 1.7, 2022: 1.3, 2023: 1.4, 2024: 1.4, 2025: 1.7 }, color: "#f97316", limit: 10 },
  { name: "Nitrate", unit: "MG/L", data: { 2016: 0.92, 2017: 0.97, 2018: 0.92, 2019: 0.92, 2020: 0.96, 2021: 1.02, 2022: 1.05, 2023: 1.10, 2024: 1.08, 2025: 1.43 }, color: "#22c55e", limit: 10 },
  { name: "THMs", unit: "μg/L", data: { 2016: 32.0, 2017: 31.0, 2018: 31.3, 2019: 30.8, 2020: 27.6, 2021: 34.6, 2022: 31.7, 2023: 32.2, 2024: 33.7, 2025: 27.6 }, color: "#8b5cf6", limit: 100 },
  { name: "Fluoride", unit: "MG/L", data: { 2016: 0.30, 2017: 0.37, 2018: 0.36, 2019: 0.35, 2020: 0.36, 2021: 0.32, 2022: 0.48, 2023: 0.42, 2024: 0.47, 2025: 0.49 }, color: "#06b6d4", limit: 1.5 },
];

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const CHART_H = 320;
const CHART_W = 920;
const PAD = { top: 28, right: 160, bottom: 100, left: 60 };

function TrendChart() {
  const series = MINERAL_TRENDS.map(m => {
    const vals = YEARS.map(y => m.data[y as keyof typeof m.data] || 0);
    const hasLimit = !!m.limit && m.limit > 0;
    const dataPct = vals.map(v => hasLimit ? (v / m.limit!) * 100 : v);
    return { ...m, vals, hasLimit, dataPct };
  });
  const maxPct = Math.max(...series.flatMap(s => s.dataPct));
  const yMax = Math.ceil(maxPct * 1.15);
  const toY = (pct: number) => PAD.top + CHART_H - (pct / yMax) * CHART_H;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${CHART_W + PAD.left + PAD.right} ${CHART_H + PAD.top + PAD.bottom}`} className="w-full min-w-[720px]" xmlns="http://www.w3.org/2000/svg">
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
          const y = PAD.top + CHART_H - frac * CHART_H;
          const label = Math.round(yMax * frac);
          return <g key={i}>
            <line x1={PAD.left} y1={y} x2={PAD.left + CHART_W} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.left - 8} y={y + 4} textAnchor="end" className="text-[9px] fill-gray-400">{label}%</text>
          </g>;
        })}
        {YEARS.map((y, i) => {
          const x = PAD.left + (i / (YEARS.length - 1)) * CHART_W;
          return <text key={i} x={x} y={CHART_H + PAD.top + 22} textAnchor="middle" className="text-[10px] fill-gray-400">{y}</text>;
        })}
        {series.map(s => {
          const points = s.dataPct.map((p, i) => {
            const x = PAD.left + (i / (YEARS.length - 1)) * CHART_W;
            return `${x},${toY(p)}`;
          }).join(' ');
          const markers = s.dataPct.map((p, i) => {
            const x = PAD.left + (i / (YEARS.length - 1)) * CHART_W;
            return <circle key={s.name + '-pt-' + i} cx={x} cy={toY(p)} r={3.6} fill={s.color} opacity="0.95" />;
          });
          return <g key={s.name}>
            <polyline points={points} fill="none" stroke={s.color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" opacity="0.95" />
            {markers}
          </g>;
        })}
        <g>
          <text x={PAD.left + CHART_W + 12} y={PAD.top - 6} className="text-[11px] fill-gray-700">Legend</text>
          {series.map((m, i) => {
            const ly = PAD.top + 12 + i * 34;
            return <g key={m.name}>
              <rect x={PAD.left + CHART_W + 12} y={ly} width="12" height="12" rx="2" fill={m.color} />
              <text x={PAD.left + CHART_W + 30} y={ly + 10} className="text-[11px] fill-gray-700">{m.name}</text>
              <text x={PAD.left + CHART_W + 30} y={ly + 22} className="text-[9px] fill-gray-500">{m.hasLimit ? `Limit: ${m.limit}${m.unit.toUpperCase() === 'MG/L' ? ' mg/L' : ' μg/L'}` : `Unit: ${m.unit.replace(/UG/i, 'μg')}`}</text>
            </g>;
          })}
          <text x={PAD.left + CHART_W + 12} y={PAD.top + series.length * 34 + 18} className="text-[9px] fill-gray-500">Values as % of limit (100% = limit)</text>
        </g>
      </svg>
    </div>
  );
}

export function EducationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "category-asc">("name-asc");
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      setActiveHash(hash);
      if (!hash) return;

      let targetId = "";
      const cleanHash = hash.substring(1).toLowerCase();
      // Check if cleanHash matches any mineral name (slugified)
      const matchedMineral = minerals.find(m =>
        getSlug(m.name) === cleanHash
      );

      if (hash === "#hardness" || hash === "#softener") {
        setSelectedCategory("All");
        setSearchTerm("");
        targetId = "hardness";
      } else if (hash === "#microbes") {
        setSelectedCategory("Health Concern");
        setSearchTerm("coliform");
        targetId = "minerals";
      } else if (hash === "#metals") {
        setSelectedCategory("Health Concern");
        setSearchTerm("lead");
        targetId = "minerals";
      } else if (hash === "#additives") {
        setSelectedCategory("Treatment Agent");
        setSearchTerm("");
        targetId = "minerals";
      } else if (hash === "#minerals") {
        setSelectedCategory("All");
        setSearchTerm("");
        targetId = "minerals";
      } else if (matchedMineral) {
        setSelectedCategory("All");
        setSearchTerm("");
        targetId = getSlug(matchedMineral.name);
      } else {
        targetId = hash.substring(1);
      }

      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 180);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => {
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(minerals.map(m => m.category)))];
  }, []);

  const filteredAndSortedMinerals = useMemo(() => {
    let result = [...minerals];

    // 1. Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(m => m.category === selectedCategory);
    }

    // 2. Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.commonSources.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "category-asc") {
        const catCompare = a.category.localeCompare(b.category);
        if (catCompare !== 0) return catCompare;
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-2.5">
          Water Education Centre
        </h2>
        <p className="text-sm md:text-lg text-gray-600 mt-2 max-w-3xl md:leading-relaxed">
          Understanding the chemistry of your water is the first step toward better health and better plumbing.
        </p>
      </header>

      {/* Water Types Section */}
      <section id="hardness" className="mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-2xl md:text-[26px] font-bold text-gray-900 mb-3 sm:mb-5 flex items-center gap-2">
          <Waves className="text-blue-500 w-4 h-4 md:w-6 md:h-6" /> Hard vs. Soft Water
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h4 className="text-sm md:text-lg font-bold text-blue-900">Hard Water</h4>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
              High in dissolved calcium and magnesium. Common in parts of Ontario like London and Guelph. Safe to drink — provides dietary minerals — but can cause scale in appliances.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
              </div>
              <h4 className="text-sm md:text-lg font-bold text-cyan-900">Soft Water</h4>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
              Low mineral content. Feels slippery on skin and is gentle on appliances. Water softeners replace calcium and magnesium with sodium through ion exchange.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm md:col-span-3 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                </div>
                <h4 className="text-sm md:text-lg font-bold text-indigo-900">Softeners & Filtration</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-0.5">
                    <Droplet className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> What a Softener Does
                  </h5>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Water softeners remove hard minerals (like calcium) so your appliances stay clean. However, they do this by adding small amounts of <strong>sodium (salt)</strong> to your tap water.
                  </p>
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-0.5">
                    <Filter className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> What to Do If You Have One
                  </h5>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    Softened water isn't ideal for drinking or cooking. If you use a softener, we recommend two simple workarounds:
                  </p>
                  <ul className="text-xs text-gray-600 list-disc pl-4 mt-1 space-y-1">
                    <li><strong>Bypass Line:</strong> Keep one kitchen tap on normal, unsoftened water for drinking.</li>
                    <li><strong>RO Filter:</strong> Install a Reverse Osmosis system under your sink to strip out the added salt.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Water Explained */}
      <section id="types" className="mb-6 sm:mb-8">
        <h3 className="text-sm sm:text-2xl md:text-[26px] font-bold text-gray-900 mb-3 sm:mb-5 flex items-center gap-2">
          <Beaker className="text-blue-500 w-4 h-4 md:w-6 md:h-6" /> Types of Water Explained
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-4">
            <h4 className="font-bold text-green-900 mb-1 text-sm md:text-lg">Potable Water</h4>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">Safe to drink and cook with. Ontario's municipal systems are tested thousands of times per year to meet strict standards.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-1 text-sm md:text-lg">Groundwater</h4>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">From underground aquifers. Naturally filtered through rock and soil, giving it a consistent mineral profile. Common for rural communities.</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-4">
            <h4 className="font-bold text-amber-900 mb-1 text-sm md:text-lg">Surface Water</h4>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">From lakes and rivers — source for most big cities like Toronto (Lake Ontario) and Ottawa. Requires more treatment than groundwater.</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-1 text-sm md:text-lg">Spring Water</h4>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">Flows naturally from underground sources. Must meet the same safety standards as municipal tap water if sold commercially.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-4">
            <h4 className="font-bold text-purple-900 mb-1 text-sm md:text-lg">Distilled Water</h4>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">Boiled into steam and condensed, removing dissolved minerals. Great for appliances but flat-tasting since minerals are gone.</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-xl p-4">
            <h4 className="font-bold text-red-900 mb-1 text-sm md:text-lg">Greywater</h4>
            <p className="text-xs md:text-base text-gray-600 leading-relaxed">Wastewater from baths and sinks. Not drinkable but can be reused for irrigation. Ontario regulates greywater reuse to prevent health risks.</p>
          </div>
        </div>
      </section>

      {/* Trend Chart Section */}
      <section id="trends" className="mb-6 sm:mb-8">
        <div className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm sm:text-2xl md:text-[26px] font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <TrendingUp className="text-blue-500 w-4 h-4 md:w-6 md:h-6" /> Mineral Trends in Ontario's Water
          </h3>
          <p className="text-xs md:text-base text-gray-500 mb-3">Average contaminant levels relative to regulatory limits (2016–2025). All well below 100%.</p>
          <div className="-mx-2 sm:-mx-0">
            <TrendChart />
          </div>
        </div>
      </section>

      {/* Expanded Minerals Grid */}
      <section id="minerals" className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-sm sm:text-2xl md:text-[26px] font-bold text-gray-900 flex items-center gap-2">
              <Info className="text-blue-500 w-4 h-4 md:w-6 md:h-6" /> Common Minerals & Contaminants
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Search and filter water compounds, chemicals, and contaminants in Ontario water.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, description, source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter categories & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const count = cat === "All"
                ? minerals.length
                : minerals.filter(m => m.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200/60"
                    }`}
                >
                  {cat}
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-400"
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-[10px] sm:text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm cursor-pointer"
            >
              <option value="name-asc">Alphabetical (A - Z)</option>
              <option value="name-desc">Alphabetical (Z - A)</option>
              <option value="category-asc">Category</option>
            </select>
          </div>
        </div>

        {/* Minerals list / Grid */}
        {filteredAndSortedMinerals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredAndSortedMinerals.map((m) => (
              <motion.div
                layout
                key={m.name}
                id={getSlug(m.name)}
                whileHover={{ y: -2 }}
                className={`bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${activeHash.substring(1).toLowerCase() === getSlug(m.name)
                  ? "border-blue-500 ring-4 ring-blue-500/20 shadow-lg scale-[1.02] bg-gradient-to-br from-blue-50/10 to-white"
                  : "border-gray-100 hover:border-gray-200"
                  }`}
              >
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full self-start ${m.category === 'Health Concern' ? 'bg-red-50 text-red-600' :
                    m.category === 'Byproduct' ? 'bg-orange-50 text-orange-600' :
                      m.category === 'Pesticide' ? 'bg-yellow-50 text-yellow-700' :
                        m.category === 'Treatment Agent' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                    }`}>
                    {m.category}
                  </span>
                  <h4 className="font-bold text-gray-900 mt-3 mb-1 text-sm md:text-lg">{m.name}</h4>
                  <p className="text-xs md:text-base text-gray-500 leading-relaxed">
                    {highlightMatchedText(m.description, searchTerm)}
                  </p>
                </div>
                <p className="text-[10px] md:text-xs text-gray-400 italic mt-2 pt-2 border-t border-gray-50">
                  Source: {highlightMatchedText(m.commonSources, searchTerm)}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm w-full">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">No Matching Entries Found</h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              We couldn't find any water parameters matching "{searchTerm}". Try checking your spelling or selecting another category filter.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>

      {/* Safety Stats */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 text-white overflow-hidden relative">
        {/* Star decorations */}
        <div className="absolute top-4 left-4 text-yellow-300/30 text-2xl sm:text-4xl">★</div>
        <div className="absolute top-6 right-16 text-yellow-300/20 text-xl sm:text-3xl">★</div>
        <div className="absolute bottom-8 left-1/3 text-yellow-300/15 text-lg sm:text-2xl">★</div>
        <div className="absolute bottom-12 right-8 text-yellow-300/25 text-xl sm:text-3xl">★</div>
        <div className="absolute top-1/2 left-12 text-yellow-300/10 text-sm">★</div>
        <div className="absolute top-0 right-0 opacity-5 sm:opacity-10 translate-x-1/4 -translate-y-1/4">
          <AlertTriangle className="w-48 sm:w-96 h-48 sm:h-96" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-5 flex items-center gap-3">
            <span className="text-yellow-300 text-2xl sm:text-4xl">★</span>
            Ontario's Safety Record
            <span className="text-yellow-300 text-2xl sm:text-4xl">★</span>
          </h3>
          <p className="text-sm md:text-base text-blue-200 leading-relaxed mb-4 md:mb-6">
            Over <strong className="text-white">6 million</strong> water quality tests every year. The <strong className="text-white">Safe Drinking Water Act</strong> sets some of North America's strictest standards. Exceedances trigger immediate health unit notification.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 text-center">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-bold text-white">99.9%</p>
              <p className="text-[10px] md:text-xs text-blue-300 mt-1">Tests Pass Rate</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-bold text-white">12,000+</p>
              <p className="text-[10px] md:text-xs text-blue-300 mt-1">Water Systems</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-bold text-white">10</p>
              <p className="text-[10px] md:text-xs text-blue-300 mt-1">Years of Data</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-bold text-white">6M+</p>
              <p className="text-[10px] md:text-xs text-blue-300 mt-1">Test Results</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
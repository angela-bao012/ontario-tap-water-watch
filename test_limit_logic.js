// Removed import to avoid typescript import issues

const EXCEL_LIMITS_MAP = {
  "lead": ".01 MG/L",
  "total coliform": "0 CFU/100ML",
  "boron": "5 MG/L",
  "barium": "1 MG/L",
  "trihalomethanes": ".1 MG/L",
  "nitrate": "10 MG/L",
  "dichloromethane": ".05 MG/L",
  "arsenic": ".01 MG/L",
  "escherichia coli": "0 CFU/100ML",
  "uranium": ".02 MG/L",
  "glyphosate": ".28 MG/L",
  "nitrate + nitrite": "10 MG/L",
  "diuron": ".15 MG/L",
  "tritium": "7000 BQ/L",
  "selenium": ".05 MG/L",
  "diquat": ".07 MG/L",
  "chromium": ".05 MG/L",
  "triallate": ".23 MG/L",
  "antimony": ".006 MG/L",
  "nitrite": "1 MG/L",
  "carbofuran": ".09 MG/L",
  "malathion": ".19 MG/L",
  "carbaryl": ".09 MG/L",
  "picloram": ".19 MG/L",
  "metribuzin": ".08 MG/L",
  "tetrachloroethylene": ".01 MG/L",
  "metolachlor": ".05 MG/L",
  "fluoride": "1.5 MG/L",
  "dimethoate": ".02 MG/L",
  "azinphos-methyl": ".02 MG/L",
  "paraquat": ".01 MG/L",
  "bromoxynil": ".005 MG/L",
  "trichloroethylene": ".005 MG/L",
  "benzene": ".001 MG/L",
  "mercury": ".001 MG/L",
  "tetrachlorophenol": ".1 MG/L",
  "dichlorophenol": ".9 MG/L",
  "pentachlorophenol": ".06 MG/L",
  "2,4-d": ".1 MG/L",
  "diazinon": ".02 MG/L",
  "atrazine": ".005 MG/L",
  "chlorpyrifos": ".09 MG/L",
  "simazine": ".01 MG/L",
  "trifluralin": ".045 MG/L",
  "dicamba": ".12 MG/L",
  "diclofop-methyl": ".009 MG/L",
  "chlorate": "1 MG/L",
  "monochlorobenzene": ".08 MG/L",
  "vinylidene chloride": ".014 MG/L",
  "dichlorobenzene": ".2 MG/L",
  "dichloroethane": ".005 MG/L",
  "terbufos": ".001 MG/L",
  "alachlor": ".005 MG/L",
  "phorate": ".002 MG/L",
  "trichlorophenol": ".005 MG/L",
  "cadmium": ".005 MG/L",
  "pcbs": ".003 MG/L",
  "mcpa": ".1 MG/L",
  "vinyl chloride": ".001 MG/L",
  "chlorite": "1 MG/L",
  "prometryne": ".001 MG/L",
  "carbon tetrachloride": ".002 MG/L",
  "benzo(a)pyrene": ".00001 MG/L",
  "toluene": ".06 MG/L",
  "ndma": ".000009 MG/L",
  "bromate": ".01 MG/L",
  "dioxin": ".000000015 MG/L"
};

function getParameterLimit(parameterName) {
  const norm = parameterName.toLowerCase().trim();
  for (const [k, v] of Object.entries(EXCEL_LIMITS_MAP)) {
    if (norm.includes(k) || k.includes(norm)) {
      return v;
    }
  }
  return "N/A";
}

function getLegalLimitValue(parameterName, sampleUnit) {
  const limitStr = getParameterLimit(parameterName);
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

console.log("getParameterLimit('Lead') =", getParameterLimit("Lead"));
console.log("getLegalLimitValue('Lead', 'UG/L') =", getLegalLimitValue("Lead", "UG/L"));

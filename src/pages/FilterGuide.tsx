import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Filter, Droplets, Home, Zap, RefreshCw, AlertTriangle, ChevronRight, ChevronDown, ExternalLink, HelpCircle } from "lucide-react";

const FILTER_ROWS = [
  {
    type: "Pitcher",
    icon: Filter,
    color: "bg-sky-50 border-sky-200",
    iconBg: "bg-sky-100 text-sky-700",
    removes: "Chlorine (taste & odour), some VOCs, loose sediment",
    pros: "Cheap, portable, no installation, zero electricity",
    cons: "Slow flow, small capacity, does NOT remove heavy metals, nitrates, or hardness",
    maintenance: "Replace cartridge every 2–3 months (~$10–20)",
  },
  {
    type: "Faucet Mount",
    icon: Droplets,
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100 text-blue-700",
    removes: "Chlorine, taste & odour, many VOCs, some pesticides",
    pros: "Easy install, switchable between filtered/ unfiltered, better flow than pitcher",
    cons: "May not fit all faucets, limited cartridge life, still no heavy metal removal",
    maintenance: "Replace cartridge every 3–4 months (~$25–40)",
  },
  {
    type: "Under-Sink",
    icon: Home,
    color: "bg-indigo-50 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-700",
    removes: "Chlorine, VOCs, heavy metals (lead, arsenic), sediment, tastes & odours",
    pros: "High capacity, hidden design, dedicated tap, broad contaminant removal",
    cons: "Requires under-sink space and plumbing. Higher upfront cost.",
    maintenance: "Replace pre-filter every 6 months, carbon stage annually (~$50–100/yr)",
  },
  {
    type: "Reverse Osmosis",
    icon: Zap,
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100 text-purple-700",
    removes: "Heavy metals (lead, arsenic), nitrates, PFAS, dissolved solids, hardness, most contaminants",
    pros: "Removes up to 99% of dissolved solids and nearly all regulated contaminants",
    cons: "Slow flow, wastes ~3–4x water filtered, needs professional install, higher cost",
    maintenance: "Replace sediment/carbon pre-filters every 6–12 mos, RO membrane every 2–3 yrs (~$100–200/yr)",
  },
];

const FAQS = [
  {
    q: "Do I really need a filter if my water passes all tests?",
    a: "Most municipal water in Ontario meets safety standards. Filters are mainly for taste (chlorine), peace of mind, and removing specific contaminants if your tests show they're near the limit.",
  },
  {
    q: "Can a pitcher filter remove lead or arsenic?",
    a: "No. Standard charcoal pitcher filters only reduce chlorine, taste, and some VOCs. They do not remove heavy metals, nitrates, or dissolved minerals like calcium/magnesium.",
  },
  {
    q: "What's the difference between a water softener and a filter?",
    a: "A softener removes hardness minerals (calcium, magnesium) to protect appliances. A filter removes contaminants for drinking. Most homes benefit from both if they have hard water plus contaminant concerns.",
  },
  {
    q: "How often should I replace my filter?",
    a: "Pitcher/fauce mounts every 2–4 months. Under-sink pre-filters every 6 months, carbon stage yearly. RO membranes every 2–3 years. Always follow the manufacturer schedule.",
  },
  {
    q: "Does boiling water remove contaminants?",
    a: "Boiling kills bacteria and viruses but does NOT remove heavy metals, nitrates, chlorine, or dissolved solids. It can actually concentrate some contaminants as water evaporates.",
  },
];

function Accordion({ row, i }: { row: typeof FILTER_ROWS[0]; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border overflow-hidden ${row.color}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3.5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.iconBg}`}>
            <row.icon className="w-4 h-4" />
          </div>
          <span className="font-bold text-gray-900 text-sm">{row.type}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 space-y-2 text-[12px] border-t border-gray-200/60 pt-2.5">
              <div>
                <span className="font-semibold text-gray-600">What it removes:</span>
                <p className="text-gray-700 mt-0.5">{row.removes}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <span className="font-semibold text-green-700">Pros</span>
                  <p className="text-green-800 mt-0.5">{row.pros}</p>
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-red-600">Cons</span>
                  <p className="text-red-700 mt-0.5">{row.cons}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 pt-1">
                <RefreshCw className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-600">{row.maintenance}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterGuidePage() {
  return (
    <div className="pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-2.5">
          <Filter className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
          Water Filter Guide
        </h2>
        <p className="text-sm md:text-lg text-gray-600 mt-2 max-w-3xl md:leading-relaxed">
          Not all filters are created equal. Here's what each type actually removes — and what it doesn't.
        </p>
      </header>

      {/* Quick Take + Common Misconception — side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-5 flex gap-3 items-start shadow-sm">
          <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 md:w-5 md:h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-xs md:text-lg mb-0.5 md:mb-1">Common Misconception</h3>
            <p className="text-[11px] md:text-base text-amber-800 md:leading-relaxed">
              Charcoal pitchers remove taste & chlorine —{" "}
              <strong className="text-amber-900">they do NOT remove heavy metals, nitrates, PFAS, or hard minerals.</strong>{" "}
              For those you need under-sink carbon + RO.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-3 sm:p-5 shadow-sm">
          <h4 className="font-bold text-blue-900 text-xs md:text-lg mb-1 md:mb-1.5">Quick Take</h4>
          <p className="text-[11px] md:text-base text-gray-700 md:leading-relaxed">
            <strong className="text-blue-700">Taste/chlorine?</strong> Pitcher or faucet.{" "}
            <strong className="text-blue-700">Lead/nitrates?</strong> Under-sink carbon + RO.{" "}
            <strong className="text-blue-700">Hard water?</strong> Add a softener.
          </p>
        </div>
      </div>

      {/* The Filter Matrix — Comparison Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4 text-blue-500" />
            The Filter Matrix
          </h3>
        </div>

        {/* Desktop table — hidden below 768px */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full w-auto table-fixed border-collapse">
            <colgroup>
              <col className="w-[160px] min-w-[150px]" />
              <col className="w-auto" />
              <col className="w-[200px] min-w-[170px]" />
              <col className="w-[200px] min-w-[170px]" />
              <col className="w-[200px] min-w-[170px]" />
            </colgroup>
            <thead>
              <tr className="border-b-2 border-gray-100 bg-gray-50/80">
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Filter Type</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">What It Removes</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Main Pros</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Main Cons</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Maintenance</th>
              </tr>
            </thead>
            <tbody>
              {FILTER_ROWS.map((row, i) => (
                <motion.tr
                  key={row.type}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-gray-50 transition-colors hover:bg-gray-50/60"
                >
                  <td className="px-4 py-5 align-top">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${row.iconBg}`}>
                        <row.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-gray-900 text-base">{row.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-5 align-top">
                    <span className="text-sm md:text-base text-gray-700 leading-relaxed">{row.removes}</span>
                  </td>
                  <td className="px-4 py-5 align-top">
                    <span className="text-sm md:text-base text-green-800 leading-relaxed">{row.pros}</span>
                  </td>
                  <td className="px-4 py-5 align-top">
                    <span className="text-sm md:text-base text-red-800 leading-relaxed">{row.cons}</span>
                  </td>
                  <td className="px-4 py-5 align-top">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-sm md:text-base text-gray-600 leading-relaxed">{row.maintenance}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile accordion layout — shown below 768px */}
        <div className="md:hidden p-3 space-y-2">
          {FILTER_ROWS.map((row, i) => (
            <Accordion key={row.type} row={row} i={i} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-sm sm:text-2xl md:text-[26px] font-bold text-gray-900 mb-3 sm:mb-5 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
          FAQ — Filter Edition
        </h3>
        <div className="space-y-2 sm:space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg p-3 sm:p-5">
              <h4 className="font-bold text-gray-800 mb-1 sm:mb-2 text-sm md:text-base">{faq.q}</h4>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Links */}
      <div className="mt-6 sm:mt-8 bg-gray-50 border border-gray-100 rounded-xl p-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Official References</h4>
        <ul className="space-y-1.5">
          <li>
            <a
              href="https://www.ontario.ca/page/drinking-water-quality-standards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              Ontario Drinking Water Quality Standards
            </a>
          </li>
          <li>
            <a
              href="https://www.ontario.ca/page/water-treatment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              Ontario Water Treatment & Safety
            </a>
          </li>
          <li>
            <a
              href="https://www.canada.ca/en/health-canada/services/environmental-workplace-health/water-quality/drinking-water.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              Health Canada — Drinking Water Quality
            </a>
          </li>
          <li>
            <a
              href="https://www.wqa.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              Water Quality Association (filter certification info)
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
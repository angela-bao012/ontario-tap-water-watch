import { motion } from "motion/react";
import { Clock } from "lucide-react";

const UPDATES = [
  { date: "2026-05-19", items: [
    "Filter Matrix table text enlarged to text-sm/text-base for easy desktop reading.",
    "Homepage safety blurb rewritten for clarity.",
    "Filter Guide desktop typography: body text 18px, FAQ answers 18px, headings 26px.",
    "Filter Guide: FAQ fonts and matrix fonts aligned for easier desktop reading.",
    "Filter Matrix table and mobile accordion improved spacing and padding.",
    "Education page: minerals list expanded to cover 25 contaminants found in reports.",
    "Trend chart moved above minerals list and compacted for small vertical footprint.",
    "Ontario Safety Record: added star accents to highlight excellent pass rates.",
    "Scroll progress bar added under navbar (desktop) with light track + blue fill.",
    "Navbar: desktop header made sticky (md:sticky); mobile retains drawer behavior.",
    "Mobile hamburger nav replaces crowded tabs on phones.",
    "Sidebar drawer slides in from right with backdrop, auto-closes on link click.",
    "Filter Guide page: mobile accordion layout replaces table on phones.",
    "Filter Guide page: Quick Take and Misconception side-by-side.",
    "Filter Guide page: FAQ + official reference links added.",
    "Risks section added to Filters tab — shows health dangers for each exceedance found.",
    "Search results now have two tabs: 'Water Quality Data' and 'Recommended Filters'.",
    "Red dot appears on Filters tab when exceedances are found.",
    "New Water Filter Guide page with comparison table.",
    "Filter table turns into stacked cards on mobile.",
    "Misconception callout: charcoal pitchers don't remove heavy metals.",
    "Filter recommendations link to the Filter Guide page.",
    "Smart filter engine scores exceedances and suggests RO, carbon, or softener.",
    "Changelog page added with footer link.",
    "Navbar tab renamed to 'Water Filter Guide'.",
  ]},
  { date: "2026-05-17", items: [
    "Filter matrix with clickable column highlighting added to Education page.",
    "Result labels shortened to readable names (e.g. 'Toronto - Island').",
    "Pass/fail badges on search results.",
    "Clicking a result opens the detail view.",
    "Bug fix: search results now respond to clicks.",
    "Detail view shows exceedances, averages, risk levels, and limits.",
    "Year selector (2016–2025) for filtering data.",
    "SQLite FTS5 full-text search with LIKE fallback.",
  ]},
  { date: "2026-05-16", items: [
    "Search page UI with Tailwind and animations.",
    "Express + Vite dev server.",
    "SQLite database from 9 Ontario water Excel files (500k+ rows).",
    "Python ETL script to parse 9 years of test results.",
    "Home page with hero, stats, and navigation cards.",
    "Education page with minerals, water types, and safety stats.",
    "Navbar with Home, Find Your Place, Education tabs.",
    "Project scaffolded with Vite, React, TypeScript, Tailwind.",
    "Database with locations + test_results + FTS5.",
    "API: location search + test data endpoints.",
  ]},
];

export function ChangelogPage() {
  return (
    <div className="pt-6 sm:pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <header className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 flex items-center gap-2">
          <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500" />
          Site Changelog
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mt-2">Major updates and features added to Ontario Tap Water Watch.</p>
      </header>

      <div className="space-y-8">
        {UPDATES.map((entry) => (
          <motion.div
            key={entry.date}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="border-l-4 border-blue-200 pl-4 sm:pl-6"
          >
            <h3 className="text-sm sm:text-base font-bold text-blue-800 mb-2">{entry.date}</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
              {entry.items.map((item, i) => (
                <li key={i} className="leading-relaxed">— {item}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
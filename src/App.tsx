/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/Home";
import { SearchPage } from "./pages/Search";
import { EducationPage } from "./pages/Education";
import { FilterGuidePage } from "./pages/FilterGuide";
import { ChangelogPage } from "./pages/Changelog";
import { DebugWaterDataPage } from "./pages/DebugWaterData";
import { DebugMainDataPage } from "./pages/DebugMainData";
import { MatchesPage } from "./pages/Matches";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
        <span>Ontario Tap Water Watch &copy; {new Date().getFullYear()}</span>
        <Link to="/changelog" className="hover:text-blue-600 transition-colors">Site Changelog</Link>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        <Navbar />
        <main className="flex-1 md:pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/search/:query/:dwsId" element={<SearchPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/filters" element={<FilterGuidePage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/debug-water-data" element={<DebugWaterDataPage />} />
            <Route path="/debug-main-data" element={<DebugMainDataPage />} />
            <Route path="/debug-matched-data" element={<MatchesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

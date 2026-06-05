import { motion } from "motion/react";
import { Droplets, ShieldCheck, Info, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="pt-6 sm:pt-8 pb-12 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-0 -z-10 opacity-5 sm:opacity-10">
          <Droplets className="w-48 sm:w-96 h-48 sm:h-96 text-blue-600" />
        </div>
        
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-blue-900 tracking-tight leading-tight"
          >
            Know What's in Your <span className="text-blue-600">Tap Water</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-600 leading-relaxed"
          >
            Ontario Tap Water Watch provides comprehensive data on water quality across the province. 
            We make complex environmental testing results easy to understand.
          </motion.p>

          {/* Ontario Water Quality Blurb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 sm:mt-8 bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Ontario's tap water is among the safest globally, with over 99.9% of municipal tests consistently 
              meeting strict provincial standards. This reliability is maintained through a multi-barrier approach, 
              combining source protection, continuous testing, and mandatory training for system operators.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
          >
            <Link 
              to="/search" 
              className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              Search My Location <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link 
              to="/education" 
              className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 border-2 border-blue-100 rounded-xl font-bold text-base sm:text-lg hover:border-blue-200 hover:bg-blue-50 transition-all"
            >
              Learn About Water
            </Link>
          </motion.div>

          {/* Quick City Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 sm:mt-8"
          >
            <p className="text-xs sm:text-sm text-gray-400 font-medium mb-3 text-center">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/search/toronto" className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                Toronto
              </Link>
              <Link to="/search/ottawa" className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                Ottawa
              </Link>
              <Link to="/search/london" className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                London
              </Link>
              <Link to="/search/newmarket" className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                Newmarket
              </Link>
              <Link to="/search/hamilton" className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                Hamilton
              </Link>
              <Link to="/search/kingston" className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                Kingston
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="mt-16 sm:mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-blue-50 rounded-2xl sm:rounded-3xl py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
        <div className="flex flex-col items-center text-center p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Accountability</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            We track thousands of water quality reports to ensure municipalities are meeting safety standards.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
            <Info className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Education</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Minerals aren't always "contaminants." We help you understand the difference between hard water and health risks.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4">Transparency</h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Access data that was previously hidden in large reports, now searchable in seconds.
          </p>
        </div>
      </section>

      {/* Floating Debug Buttons in Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row gap-2.5">
        <Link
          to="/debug-water-data"
          className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 hover:text-gray-900 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-sm hover:-translate-y-0.5"
        >
          ⚙️ Debug DWSP Data
        </Link>
        <Link
          to="/debug-main-data"
          className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 hover:text-gray-900 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-sm hover:-translate-y-0.5"
        >
          📋 Debug Main Database
        </Link>
        <Link
          to="/debug-matched-data"
          className="flex items-center gap-2 px-4 py-3 bg-white text-gray-700 hover:text-gray-900 border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold text-sm hover:-translate-y-0.5"
        >
          💚 View Matched Aesthetic Data
        </Link>
      </div>
    </div>
  );
}
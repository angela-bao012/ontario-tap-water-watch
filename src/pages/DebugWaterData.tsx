import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Filter, RefreshCw, BarChart2, Server, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface RawRecord {
  id: number;
  dws_name: string;
  parameter_name: string;
  result_value: number | null;
  result_unit: string;
  sample_date: string;
}

interface SummaryStats {
  total_rows: number;
  unique_systems: number;
  hardness_min: number | null;
  hardness_max: number | null;
  iron_min: number | null;
  iron_max: number | null;
  ph_min: number | null;
  ph_max: number | null;
}

export function DebugWaterDataPage() {
  const [records, setRecords] = useState<RawRecord[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [parameterFilter, setParameterFilter] = useState("ALL"); // ALL, HARDNESS, IRON, PH
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recordsRes, summaryRes] = await Promise.all([
        fetch("/api/debug/raw-dwsp"),
        fetch("/api/debug/summary")
      ]);

      if (!recordsRes.ok || !summaryRes.ok) {
        throw new Error("Failed to load debugging data from API.");
      }

      const recordsData = await recordsRes.json();
      const summaryData = await summaryRes.json();

      setRecords(recordsData);
      setSummary(summaryData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter records based on search term and parameter selection
  const filteredRecords = records.filter((rec) => {
    const matchesSearch = rec.dws_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParam = parameterFilter === "ALL" || rec.parameter_name.toUpperCase() === parameterFilter.toUpperCase();
    return matchesSearch && matchesParam;
  });

  // Calculate pagination boundaries
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Reset pagination if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, parameterFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              ⚙️ DWSP Ingestion Debug Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Isolated debugging view showing raw data ingested directly from the DWSP CSV surveillance files.
            </p>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <p className="font-bold">Error loading database records</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Analytics Summary Row */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Box 1: Total Rows Ingested */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Rows Ingested</span>
                <span className="block text-3xl font-extrabold text-blue-900 mt-1">
                  {summary.total_rows.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-semibold block mt-1 flex items-center gap-1">
                  ✓ Successfully saved in raw_dwsp_data
                </span>
              </div>
            </div>

            {/* Box 2: Unique Systems Found */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Unique Systems Found</span>
                <span className="block text-3xl font-extrabold text-purple-950 mt-1">
                  {summary.unique_systems.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 block mt-1">
                  Distinct system tracking names in CSV
                </span>
              </div>
            </div>

            {/* Box 3: Data Ranges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Filter className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ingested Data Ranges</span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-semibold text-gray-500">Hardness:</span>
                    <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded text-amber-800">
                      {summary.hardness_min !== null ? `${summary.hardness_min} to ${summary.hardness_max}` : "N/A"} mg/L
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-semibold text-gray-500">Iron:</span>
                    <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded text-amber-800">
                      {summary.iron_min !== null ? `${summary.iron_min} to ${summary.iron_max}` : "N/A"} mg/L
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-semibold text-gray-500">pH Range:</span>
                    <span className="font-mono bg-amber-50 px-1.5 py-0.5 rounded text-amber-800">
                      {summary.ph_min !== null ? `${summary.ph_min} to ${summary.ph_max}` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Drinking Water System Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Parameter Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline">Parameters:</span>
            {[
              { id: "ALL", label: "All Parameters" },
              { id: "HARDNESS", label: "Hardness Only" },
              { id: "IRON", label: "Iron Only" },
              { id: "PH", label: "pH Only" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setParameterFilter(btn.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                  parameterFilter === btn.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
              <span>Fetching raw records from PostgreSQL...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-700">No data found</p>
              <p className="text-sm mt-1">Make sure you ran the python ingestion script.</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-700">No matching records</p>
              <p className="text-sm mt-1">Try relaxing your search terms or filters.</p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Drinking Water System Name</th>
                      <th className="px-6 py-4">Parameter</th>
                      <th className="px-6 py-4">Result</th>
                      <th className="px-6 py-4">Sample Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {paginatedRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{rec.dws_name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                            rec.parameter_name === 'HARDNESS' ? 'bg-amber-100 text-amber-800' :
                            rec.parameter_name === 'IRON' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rec.parameter_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-700">
                          {rec.result_value !== null ? rec.result_value : "N/A"}{" "}
                          <span className="text-xs text-gray-400 font-normal">{rec.result_unit}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono">{rec.sample_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <span className="text-xs text-gray-500">
                  Showing <span className="font-bold text-gray-800">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-gray-800">{endIndex}</span> of{" "}
                  <span className="font-bold text-gray-800">{totalItems.toLocaleString()}</span> entries
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-gray-600">
                    Page <span className="text-gray-900">{currentPage}</span> of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

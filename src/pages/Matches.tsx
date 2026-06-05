import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, RefreshCw, CheckCircle2, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface MatchedRecord {
  location: string;
  dwsp_data: {
    matched_system_name: string;
    hardness_avg: number | null;
    iron_avg: number | null;
    ph_avg: number | null;
  };
}

interface SummaryStats {
  total_matched_locations: number;
}

export function MatchesPage() {
  const [records, setRecords] = useState<MatchedRecord[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recordsRes, summaryRes] = await Promise.all([
        fetch("/api/debug/matched-data"),
        fetch("/api/debug/matched-summary")
      ]);

      if (!recordsRes.ok || !summaryRes.ok) {
        throw new Error("Failed to load matched database audit data.");
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

  // Filter records based on search term (by location name or matched system name)
  const filteredRecords = records.filter((rec) => {
    const locMatch = rec.location.toLowerCase().includes(searchTerm.toLowerCase());
    const sysMatch = (rec.dwsp_data?.matched_system_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    return locMatch || sysMatch;
  });

  // Calculate pagination boundaries
  const totalItems = filteredRecords.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  // Reset pagination if search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
              💚 Matches
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Audit view of locations successfully linked to DWSP water surveillance systems with aesthetic and physical averages.
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
            {/* Box 1: Total Successfully Matched Locations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start gap-4 hover:shadow-md transition-shadow md:col-span-3">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Successfully Matched Locations</span>
                <span className="block text-3xl font-extrabold text-green-900 mt-1">
                  {summary.total_matched_locations.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-semibold block mt-1 flex items-center gap-1">
                  ✓ Successfully linked and stored in primary locations database
                </span>
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
              placeholder="Search by Location Name or Matched System Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
              <span>Fetching matched records from PostgreSQL...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <HelpCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-700">No matched data found</p>
              <p className="text-sm mt-1">Run the Python matching script to link and populate `dwsp_data`.</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="font-bold text-gray-700">No matching locations</p>
              <p className="text-sm mt-1">Try relaxing your search term.</p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Stored Location Name</th>
                      <th className="px-6 py-4">Matched DWSP System Name</th>
                      <th className="px-6 py-4">Hardness Average</th>
                      <th className="px-6 py-4">pH Average</th>
                      <th className="px-6 py-4">Iron Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {paginatedRecords.map((rec) => (
                      <tr key={rec.location} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900">{rec.location}</td>
                        <td className="px-6 py-4 text-gray-600 font-medium">{rec.dwsp_data?.matched_system_name || "N/A"}</td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-700">
                          {rec.dwsp_data?.hardness_avg !== null && rec.dwsp_data?.hardness_avg !== undefined 
                            ? `${rec.dwsp_data.hardness_avg.toFixed(3)} mg/L` 
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-700">
                          {rec.dwsp_data?.ph_avg !== null && rec.dwsp_data?.ph_avg !== undefined 
                            ? rec.dwsp_data.ph_avg.toFixed(3) 
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-700">
                          {rec.dwsp_data?.iron_avg !== null && rec.dwsp_data?.iron_avg !== undefined 
                            ? `${rec.dwsp_data.iron_avg.toFixed(3)} mg/L` 
                            : "N/A"}
                        </td>
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

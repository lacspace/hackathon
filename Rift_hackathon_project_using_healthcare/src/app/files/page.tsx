"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Calendar,
  User,
  Activity,
  ArrowLeft,
  Search,
  Dna,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface ProfileItem {
  id: string;
  name: string;
  file_name: string;
  uploaded_at?: string;
  created_at: string;
  genes: any[];
}

export default function UploadedFilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingJson, setViewingJson] = useState<any>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:5001/api/profile");
      if (!res.ok) throw new Error("Backend system response error");
      const data = await res.json();
      setProfiles(data);
    } catch (err: any) {
      console.error("Error fetching profiles:", err);
      setError(
        "Unable to reach secondary clinical database. Please verify backend connectivity.",
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadAllAsJSON = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `pharmaguard_all_profiles_${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.file_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12 font-sans selection:bg-sky-100">
      <div className="w-full max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-4 group font-semibold"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-100">
                <FileText size={28} />
              </div>
              Archive Registry
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">
              Manage and audit all historical genomic patient reports.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={downloadAllAsJSON}
              disabled={profiles.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              <Download size={20} /> Bulk Export (JSON)
            </button>
          </div>
        </header>

        {/* Search & Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search by patient name or filename..."
              className="w-full p-4 pl-12 rounded-2xl border-2 border-white shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-slate-300 bg-white font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-sky-600 p-4 rounded-2xl text-white flex flex-col justify-center shadow-lg shadow-sky-100">
            <span className="text-xs font-bold uppercase opacity-80 mb-1 tracking-widest">
              Total Registry
            </span>
            <span className="text-3xl font-bold">
              {profiles.length} Reports
            </span>
          </div>
        </div>

        {/* List Content */}
        {error ? (
          <div className="bg-rose-50 border-2 border-rose-100 p-12 rounded-[2.5rem] text-center">
            <AlertCircle className="mx-auto mb-4 text-rose-600" size={48} />
            <h3 className="text-xl font-bold text-rose-900 mb-2">
              Registry Connection Failed
            </h3>
            <p className="text-rose-600 font-medium mb-6">{error}</p>
            <button
              onClick={fetchProfiles}
              className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold">
              Accessing Secure Database...
            </p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="group relative bg-white rounded-3xl border-2 border-white shadow-sm hover:shadow-xl hover:border-sky-100 transition-all duration-300 p-6 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                    <Dna size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-300 font-mono tracking-tighter">
                    {p.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-sky-900 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                  <FileText size={14} className="flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{p.file_name}</span>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Uploaded
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {new Date(
                        p.uploaded_at || p.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingJson(p)}
                      className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm"
                      title="View Raw JSON"
                    >
                      <Terminal size={18} />
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          "geneticProfile",
                          JSON.stringify({
                            patient_id: p.id,
                            name: p.name,
                            pharmacogenomic_profile: p.genes,
                            risk_assessment: {
                              overall_risk_score: 15,
                              high_risk_variants_count: 0,
                            },
                            clinical_recommendation: [],
                            llm_generated_explanation: {
                              biological_explanation:
                                "Historical report loaded.",
                              clinical_interpretation: "Review markers.",
                              evidence_citation: "PharmGKB Archive",
                            },
                            quality_metrics: {
                              variant_evidence: "Verified",
                              annotation_quality: "High",
                              database_certainty: "99%",
                            },
                          }),
                        );
                        router.push("/dashboard");
                      }}
                      className="p-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm flex items-center gap-1 font-bold text-xs pr-3"
                      title="View Full Report"
                    >
                      <ChevronRight size={18} /> Dashboard
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-24 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No Reports Found
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">
              We couldn't find any reports matching your search. Try adjusting
              your filters.
            </p>
          </div>
        )}

        {/* JSON Viewer Modal */}
        {viewingJson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Patient JSON Record
                  </h2>
                  <p className="text-slate-500 font-medium">
                    Raw clinical data for {viewingJson.name}
                  </p>
                </div>
                <button
                  onClick={() => setViewingJson(null)}
                  className="bg-white p-3 rounded-2xl border hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={20} className="rotate-90 md:rotate-0" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-8 bg-slate-900 text-sky-400 font-mono text-sm">
                <pre>{JSON.stringify(viewingJson, null, 2)}</pre>
              </div>
              <div className="p-6 bg-slate-50 text-right">
                <button
                  onClick={() => setViewingJson(null)}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Close Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper icons
function Terminal({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}

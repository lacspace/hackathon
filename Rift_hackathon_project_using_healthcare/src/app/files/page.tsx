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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 md:p-12 font-sans">
      <div className="w-full max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors mb-4 group font-medium"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-sky-600 text-white rounded-2xl shadow-lg shadow-sky-100">
                <FileText size={28} />
              </div>
              Archive Registry
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
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
              className="w-full p-4 pl-12 rounded-2xl border-2 border-white shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-slate-300 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-sky-600 p-4 rounded-2xl text-white flex flex-col justify-center">
            <span className="text-xs font-bold uppercase opacity-80 mb-1 tracking-widest">
              Total Registry
            </span>
            <span className="text-3xl font-black">
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
              className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-rose-700 transition-all"
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
                  <span className="text-[10px] font-black uppercase text-slate-300 font-mono tracking-tighter">
                    {p.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-sky-900 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <FileText size={14} className="flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{p.file_name}</span>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
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
                  <button
                    onClick={() => {
                      // Simulate loading into local storage and navigating (as if just uploaded)
                      localStorage.setItem(
                        "geneticProfile",
                        JSON.stringify({
                          patient_id: p.id,
                          name: p.name,
                          pharmacogenomic_profile: p.genes,
                          risk_assessment: {
                            overall_risk_score:
                              p.genes.filter(
                                (g) => (g as any).riskLevel === "Toxic",
                              ).length *
                                20 +
                              10,
                            high_risk_variants_count: p.genes.filter(
                              (g) => (g as any).riskLevel === "Toxic",
                            ).length,
                          },
                          clinical_recommendation: [], // Simplified for historical view
                          llm_generated_explanation: {
                            biological_explanation:
                              "Historical report loaded from database.",
                            clinical_interpretation:
                              "Review historical markers below.",
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
                    className="p-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                    title="View Full Report"
                  >
                    <ChevronRight size={20} />
                  </button>
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
            <p className="text-slate-500 max-w-sm mx-auto">
              We couldn't find any reports matching your search. Try adjusting
              your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

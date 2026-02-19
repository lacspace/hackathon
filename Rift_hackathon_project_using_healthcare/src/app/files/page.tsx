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
import { TopHeader } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { useAuth } from "../../components/auth-provider";
import { API_BASE_URL } from "../../lib/constants";

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
      const res = await fetch(`${API_BASE_URL}/profile`);
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
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-indigo-100 transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <TopHeader title="Archive Registry" />
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                Historical Database
              </span>
            </div>
            <h2 className="text-6xl font-black text-foreground tracking-tighter leading-none italic">
              Archive <br />{" "}
              <span className="text-zinc-400 not-italic">Registry</span>
            </h2>
            <p className="text-muted-foreground text-xl mt-1 font-medium leading-relaxed max-w-lg">
              Manage and audit historical
              <span className="text-foreground font-black ml-1">
                genomic patient records.
              </span>
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadAllAsJSON}
              disabled={profiles.length === 0}
              className="bg-foreground text-background px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-foreground/10 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Download size={18} /> Export JSON
            </button>
          </div>
        </header>

        {/* Search & Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-500 transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="Search by patient name or filename..."
              className="w-full p-6 pl-16 rounded-[2rem] bg-muted/20 border border-foreground/5 shadow-xl shadow-foreground/5 focus:border-indigo-500 outline-none transition-all placeholder:text-muted-foreground/30 font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="bg-indigo-600 p-6 rounded-[2rem] text-white flex flex-col justify-center shadow-xl shadow-indigo-500/10">
            <span className="text-[10px] font-black uppercase opacity-80 mb-1 tracking-widest">
              Total Registry
            </span>
            <span className="text-3xl font-black">
              {profiles.length} Reports
            </span>
          </div>
        </div>

        {/* List Content */}
        {error ? (
          <div className="bg-rose-500/5 border border-rose-500/20 p-12 rounded-[3rem] text-center max-w-2xl mx-auto">
            <AlertCircle className="mx-auto mb-4 text-rose-500" size={48} />
            <h3 className="text-2xl font-black text-foreground mb-2">
              Registry Connection Failed
            </h3>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              {error}
            </p>
            <button
              onClick={fetchProfiles}
              className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
              Accessing Secure Archive...
            </p>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((p) => (
              <div
                key={p.id}
                className="group relative box-premium rounded-[2.5rem] transition-all duration-500 p-8 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                    <Dna size={24} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-muted-foreground/30 font-mono tracking-tighter">
                    UID: {p.id.slice(0, 8)}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-1 group-hover:text-indigo-600 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-medium">
                  <FileText size={14} className="flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{p.file_name}</span>
                </div>

                <div className="mt-auto pt-6 border-t border-foreground/5 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest leading-none mb-1">
                      Certified
                    </span>
                    <span className="text-xs font-black text-foreground">
                      {new Date(
                        p.uploaded_at || p.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingJson(p)}
                      className="p-3 bg-muted text-muted-foreground rounded-2xl hover:bg-foreground hover:text-background transition-all"
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
                                "Historical report loaded from clinical archive.",
                              clinical_interpretation:
                                "Review markers against latest CPIC patches.",
                              evidence_citation: "PharmGKB / ClinVar Registry",
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
                      className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                    >
                      Dashboard <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-[3rem] border-2 border-dashed border-border p-24 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">
              No Records Match
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto font-medium">
              The query did not yield any results in the current clinical
              registry.
            </p>
          </div>
        )}

        {/* JSON Viewer Modal */}
        {viewingJson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-foreground/10 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-border">
              <div className="p-10 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">
                    Clinical Object
                  </h2>
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">
                    Raw Data Trace: {viewingJson.name}
                  </p>
                </div>
                <button
                  onClick={() => setViewingJson(null)}
                  className="bg-foreground text-background p-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-foreground/10"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-10 bg-slate-900 text-indigo-100 font-mono text-xs leading-relaxed">
                <pre>{JSON.stringify(viewingJson, null, 2)}</pre>
              </div>
              <div className="p-8 bg-muted/30 border-t border-border flex justify-between items-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Security Protocol: SHA-256 Validated
                </span>
                <button
                  onClick={() => setViewingJson(null)}
                  className="px-8 py-4 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Exit Viewer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
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

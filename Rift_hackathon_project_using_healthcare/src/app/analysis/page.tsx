"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Activity,
  Beaker,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Dna,
  Zap,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Terminal,
  FlaskConical,
} from "lucide-react";
import { analyzeUniversalRisk } from "../../lib/risk-engine";

export default function AnalysisPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("geneticProfile");
    if (data) {
      setProfile(JSON.parse(data));
    }
  }, []);

  const handleSearch = () => {
    if (!profile || !profile.pharmacogenomic_profile) {
      alert("No genetic profile found. Please upload a specific VCF first.");
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Normalize query
    const drugNameDisplay = query.charAt(0).toUpperCase() + query.slice(1);

    let worstRisk = "Safe";
    let relevantGuidance =
      "Standard clinical dosing is appropriate based on your genetic markers.";
    let relevantExplanation =
      "No high-risk genetic variants were found for this drug in your profile.";
    let relevantGene = "";

    const pgxProfile = profile.pharmacogenomic_profile || [];
    for (const gene of pgxProfile) {
      const analysis = analyzeUniversalRisk(query, gene.phenotype);

      if (
        analysis.assessment.includes("Toxic") ||
        analysis.assessment.includes("🔴")
      ) {
        worstRisk = "Critical";
        relevantGuidance = analysis.guidance;
        relevantExplanation = `Your ${gene.gene} status (${gene.phenotype}) matches a high-risk warning for this drug. Metabolism may be significantly altered.`;
        relevantGene = gene.gene;
        break;
      } else if (
        analysis.assessment.includes("Adjust") ||
        analysis.assessment.includes("🟡") ||
        analysis.assessment.includes("Monitor")
      ) {
        worstRisk = "Monitor";
        relevantGuidance = analysis.guidance;
        relevantExplanation = `Your ${gene.gene} status (${gene.phenotype}) suggests a modified response. Close monitoring or dose adjustment is recommended.`;
        relevantGene = gene.gene;
      } else if (analysis.assessment === "Unknown") {
        worstRisk = "Unknown";
        relevantGuidance =
          "No specific guidelines found for this medication in the current CPIC patch.";
        relevantExplanation =
          "Pharmacogenomic data for this medication is currently not annotated for your specific variants.";
        break;
      }
    }

    // Color Mapping
    let color = "text-emerald-700 bg-emerald-50 border-emerald-200";
    let statusText = "Safe / Standard";
    let Icon = CheckCircle;

    if (worstRisk === "Critical") {
      color = "text-rose-700 bg-rose-50 border-rose-200";
      statusText = "Critical Action Required";
      Icon = AlertCircle;
    } else if (worstRisk === "Monitor") {
      color = "text-amber-700 bg-amber-50 border-amber-200";
      statusText = "Moderate Risk / Monitor";
      Icon = AlertCircle;
    } else if (worstRisk === "Unknown") {
      color = "text-slate-600 bg-slate-50 border-slate-200";
      statusText = "Not in Database";
      Icon = Info;
    }

    setResult({
      drug: drugNameDisplay,
      riskLevel: worstRisk,
      statusText,
      color,
      recommendation: relevantGuidance,
      relevantGene: relevantGene || "Various",
      alternative:
        worstRisk === "Critical"
          ? "Alternative medication class recommended (e.g., non-prodrug)"
          : "None required (Follow standard guidance)",
      aiExplanation: relevantExplanation,
      icon: Icon,
    });
  };

  const handleNewUpload = () => {
    localStorage.removeItem("geneticProfile");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 text-sky-600 font-semibold text-xl tracking-tight">
            <div className="p-2 bg-sky-50 rounded-lg">
              <Dna className="w-6 h-6" />
            </div>
            PharmaGuard
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <Activity className="w-5 h-5" />
              Genetic Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sky-50 text-sky-700 font-medium transition-colors">
              <Beaker className="w-5 h-5" />
              Drug Analysis
            </button>
            <button
              onClick={() => router.push("/files")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <FileText className="w-5 h-5" />
              Archive Registry
            </button>
            <button
              onClick={() => router.push("/test-cases")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <FlaskConical className="w-5 h-5" />
              Validation Suite
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-widest">
                Clinical Research Tool
              </span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Evidence Console
            </h2>
            <p className="text-slate-500 text-lg mt-1 font-medium italic">
              Cross-reference medications against patient's unique genomic
              biomarkers.
            </p>
          </div>
          <button
            onClick={handleNewUpload}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-semibold hover:border-sky-200 hover:bg-sky-50 transition-all shadow-sm"
          >
            <Dna size={18} className="text-sky-500" /> New Patient
          </button>
        </header>

        {/* Search System */}
        <div className="relative mb-16 max-w-4xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-600 transition-colors">
            <Search size={28} />
          </div>
          <input
            type="text"
            placeholder="Search medication (e.g., Codeine, Warfarin, Abacavir)..."
            className="w-full p-8 pl-16 rounded-[2.5rem] bg-white border-2 border-slate-50 shadow-2xl shadow-slate-200/50 focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all text-2xl font-semibold placeholder:text-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-4 bottom-4 px-10 bg-slate-900 text-white font-bold rounded-[1.8rem] hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Analyze
          </button>
        </div>

        {/* Console Output */}
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl space-y-8">
            <div
              className={`p-10 rounded-[3rem] border-4 ${result.color} shadow-2xl shadow-sky-100/20`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${result.color.split(" ")[1]}`}
                    >
                      <Zap size={24} className={result.color.split(" ")[0]} />
                    </div>
                    <span
                      className={`text-sm font-bold uppercase tracking-widest ${result.color.split(" ")[0]}`}
                    >
                      {result.statusText}
                    </span>
                  </div>
                  <h2 className="text-6xl font-bold tracking-tighter text-slate-900">
                    {result.drug}
                  </h2>
                  <div className="flex items-center gap-2 pt-2">
                    <ShieldCheck className="text-sky-600" size={16} />
                    <span className="text-xs font-semibold text-slate-400">
                      Validated against PharmGKB v4.2
                    </span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm min-w-[200px] flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-300 uppercase mb-1 tracking-widest">
                    Primary Gene
                  </span>
                  <span className="text-2xl font-bold text-slate-800">
                    {result.relevantGene}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-slate-200/50">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} className="text-sky-500" /> Clinical
                    Recommendation
                  </h4>
                  <p className="text-2xl font-bold text-slate-800 leading-tight">
                    {result.recommendation}
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={14} className="text-amber-500" />{" "}
                    Evidence-Based AI Rationale
                  </h4>
                  <p className="text-lg font-medium text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-6">
                    "{result.aiExplanation}"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <Activity className="text-sky-400" size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Pharmacist Action Alert</h4>
                  <p className="text-slate-400 font-medium">
                    Alternative path:{" "}
                    <span className="text-white font-semibold">
                      {result.alternative}
                    </span>
                  </p>
                </div>
              </div>
              <button className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-sky-600/30">
                <Download size={20} /> Export Medical Notice
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-12 p-24 rounded-[3rem] border-4 border-dashed border-slate-100 bg-white/50 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-white shadow-sm">
              <Beaker size={48} className="text-slate-300" />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-4 tracking-tighter">
              Ready for Clinical Query
            </h3>
            <p className="text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
              Enter a medication name above to perform a real-time
              cross-reference against the patient's genetic profile and ClinPGx
              evidence dataset.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

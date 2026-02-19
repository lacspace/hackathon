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
    if (!profile || !profile.genes) {
      alert("No genetic profile found. Please upload a specific VCF first.");
      return;
    }

    const query = searchQuery.trim();
    if (!query) return;

    // Normalize query (simple capitalization for display, but engine handles lowercase)
    const drugNameDisplay = query.charAt(0).toUpperCase() + query.slice(1);

    let worstRisk = "Safe";
    let relevantGuidance = "Standard clinical dosing is appropriate.";
    let relevantExplanation =
      "No high-risk genetic variants were found for this drug.";
    let foundRisk = false;

    // Iterate through all user genes to find a match
    for (const gene of profile.genes) {
      const analysis = analyzeUniversalRisk(query, gene.phenotype);

      if (
        analysis.assessment.includes("Toxic") ||
        analysis.assessment.includes("HIGH RISK")
      ) {
        worstRisk = "Critical";
        relevantGuidance = analysis.guidance;
        relevantExplanation = `Your ${gene.gene} gene status (${gene.phenotype}) matches a high-risk warning for this drug.`;
        foundRisk = true;
        break; // Stop at first critical risk
      } else if (
        analysis.assessment.includes("Adjust") ||
        analysis.assessment.includes("Monitor") ||
        analysis.assessment.includes("Intermediate")
      ) {
        worstRisk = "Monitor";
        relevantGuidance = analysis.guidance;
        relevantExplanation = `Your ${gene.gene} gene status (${gene.phenotype}) requires dose consideration.`;
        foundRisk = true;
      } else if (analysis.assessment === "Unknown") {
        // Drug not in DB
        worstRisk = "Unknown";
        relevantGuidance = "Drug not found in CPIC database.";
        relevantExplanation =
          "We do not have pharmacogenomic data for this medication.";
        foundRisk = true;
        break;
      }
    }

    // Map to UI colors from the new Theme
    let color = "text-emerald-700";
    let bgColor = "bg-emerald-50";
    let borderColor = "border-emerald-200";
    let Icon = CheckCircle;

    if (worstRisk === "Critical") {
      color = "text-rose-700";
      bgColor = "bg-rose-50";
      borderColor = "border-rose-200";
      Icon = AlertCircle;
    } else if (worstRisk === "Monitor") {
      color = "text-amber-700";
      bgColor = "bg-amber-50";
      borderColor = "border-amber-200";
      Icon = AlertCircle;
    } else if (worstRisk === "Unknown") {
      color = "text-slate-600";
      bgColor = "bg-slate-50";
      borderColor = "border-slate-200";
      Icon = Info;
    }

    setResult({
      drug: drugNameDisplay,
      riskLevel: worstRisk,
      color,
      bgColor,
      borderColor,
      recommendation: relevantGuidance,
      alternative:
        worstRisk === "Critical"
          ? "Consult Doctor for Alternatives"
          : "None required",
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
      {/* Sidebar - Consistent with Dashboard */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 text-sky-600 font-bold text-xl tracking-tight">
            <div className="p-2 bg-sky-50 rounded-lg">
              <Dna className="w-6 h-6" />
            </div>
            PharmaGuard
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Navigation
            </p>
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
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-slate-700">
                System Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <header className="mb-10 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Drug-Gene Clinical Console
            </h2>
            <p className="text-slate-500 text-lg">
              Search any medication to cross-reference with the patient's
              genetic markers.
            </p>
          </div>
          <button
            onClick={handleNewUpload}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Dna size={18} /> Upload New Profile
          </button>
        </header>

        {/* MODULE 2: Drug Search System */}
        <div className="relative mb-12 max-w-3xl group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
            <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Enter drug name (e.g., Codeine, Warfarin)..."
            className="w-full p-5 pl-12 pr-32 text-xl rounded-2xl border-2 border-slate-200 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          <div className="absolute right-3 top-2.5 bottom-2.5 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setResult(null);
                }}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Clear Search"
              >
                <span className="sr-only">Clear</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
            <button
              onClick={handleSearch}
              className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition shadow-md active:scale-95"
            >
              Analyze
            </button>
          </div>
        </div>

        {/* RESULTS SECTION (Module 3, 4, 6) */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div
              className={`p-8 rounded-3xl border-2 ${result.borderColor} ${result.bgColor} mb-8 shadow-sm`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Risk Assessment
                  </h3>
                  <h2
                    className={`text-4xl font-black ${result.color} tracking-tight`}
                  >
                    {result.riskLevel} Risk
                  </h2>
                  <p className="text-slate-600 mt-2 font-medium">
                    {result.drug}
                  </p>
                </div>
                <result.icon className={result.color} size={48} />
              </div>

              {/* MODULE 4: Clinical Recommendation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-200/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Clinical Recommendation
                  </h4>
                  <p className="text-lg font-bold text-slate-800 leading-snug">
                    {result.recommendation}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Safer Alternative
                  </h4>
                  <p className="text-lg font-semibold text-sky-700">
                    {result.alternative}
                  </p>
                </div>
              </div>
            </div>

            {/* MODULE 6: Explainable AI Panel */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Dna size={120} />
              </div>
              <div className="flex items-center gap-2 text-sky-600 font-bold mb-4 relative z-10">
                <Info size={20} /> Explainable AI Summary
              </div>
              <p className="text-slate-600 leading-relaxed text-lg italic border-l-4 border-sky-100 pl-4 relative z-10">
                "{result.aiExplanation}"
              </p>
            </div>

            {/* MODULE 7: Downloadable Medical Report */}
            <button className="flex items-center justify-center gap-3 w-full p-5 border-2 border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all group">
              <Download
                size={20}
                className="group-hover:text-sky-600 transition-colors"
              />{" "}
              Download Clinical Report (PDF)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

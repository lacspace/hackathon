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
  HelpCircle,
} from "lucide-react";
import { TopHeader } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { analyzeUniversalRisk, getDrugList } from "../../lib/risk-engine";

export default function AnalysisPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [autoResults, setAutoResults] = useState<any[] | null>(null);
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
      color = "text-rose-700 bg-rose-500/5 border-rose-500/10";
      statusText = "Critical Action Required";
      Icon = AlertCircle;
    } else if (worstRisk === "Monitor") {
      color = "text-amber-700 bg-amber-500/5 border-amber-500/10";
      statusText = "Moderate Risk / Monitor";
      Icon = AlertCircle;
    } else if (worstRisk === "Unknown") {
      color =
        "text-slate-600 dark:text-muted-foreground dark:text-muted-foreground bg-background dark:bg-background border-border dark:border-border dark:border-border";
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
    setAutoResults(null);
  };

  const handleAutoAnalyze = () => {
    if (!profile || !profile.pharmacogenomic_profile) {
      alert("No genetic profile found. Please upload a specific VCF first.");
      return;
    }

    const allDrugs = getDrugList();
    const findings: any[] = [];

    for (const d of allDrugs) {
      const drugNameDisplay = d.charAt(0).toUpperCase() + d.slice(1);
      const pgxProfile = profile.pharmacogenomic_profile || [];

      for (const gene of pgxProfile) {
        const analysis = analyzeUniversalRisk(d, gene.phenotype);
        if (
          analysis.assessment.includes("Toxic") ||
          analysis.assessment.includes("🔴") ||
          analysis.assessment.includes("Adjust") ||
          analysis.assessment.includes("🟡") ||
          analysis.assessment.includes("Monitor")
        ) {
          const isCritical =
            analysis.assessment.includes("Toxic") ||
            analysis.assessment.includes("🔴");
          findings.push({
            drug: drugNameDisplay,
            riskLevel: isCritical ? "Critical" : "Monitor",
            statusText: isCritical
              ? "Critical Action Required"
              : "Moderate Risk / Monitor",
            color: isCritical
              ? "text-rose-700 bg-rose-50 border-rose-200"
              : "text-amber-700 bg-amber-50 border-amber-200",
            recommendation: analysis.guidance,
            relevantGene: gene.gene,
          });
          break;
        }
      }
    }

    // De-duplicate in case of multiple hits
    const uniqueFindings = Array.from(
      new Map(findings.map((item) => [item.drug, item])).values(),
    );
    setAutoResults(uniqueFindings);
    setResult(null);
  };

  const handleNewUpload = () => {
    localStorage.removeItem("geneticProfile");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-indigo-100 transition-colors duration-500">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <TopHeader title="Evidence Console" />
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                Clinical Research Tool
              </span>
            </div>
            <h2 className="text-6xl font-black text-foreground tracking-tighter leading-none italic">
              Evidence <br />{" "}
              <span className="text-zinc-400 not-italic">Console</span>
            </h2>
            <p className="text-muted-foreground text-xl mt-1 font-medium leading-relaxed max-w-lg">
              Cross-reference medications against unique patient
              <span className="text-foreground font-black ml-1">
                biological signatures.
              </span>
            </p>
          </div>
          <button
            onClick={handleNewUpload}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-muted/20 border border-foreground/5 text-foreground font-semibold hover:bg-muted transition-all shadow-sm"
          >
            <Dna size={18} className="text-sky-500" /> New Patient
          </button>
        </header>

        {/* Search System */}
        <div className="relative mb-16 max-w-4xl group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-indigo-600 dark:text-indigo-400 transition-colors">
            <Search size={28} />
          </div>
          <input
            type="text"
            placeholder="Search medication (e.g., Codeine, Warfarin, Abacavir)..."
            className="w-full p-8 pl-16 rounded-[2.5rem] bg-muted/20 border border-foreground/5 shadow-2xl shadow-foreground/5 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all text-2xl font-semibold placeholder:text-muted-foreground/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-4 bottom-4 px-10 bg-slate-900 dark:bg-slate-800 dark:bg-slate-800 text-white font-bold rounded-[1.8rem] hover:bg-indigo-600 dark:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
          >
            Analyze
          </button>
        </div>

        <div className="mb-12 flex justify-center">
          <button
            onClick={handleAutoAnalyze}
            className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 flex items-center gap-3 dark:shadow-none"
          >
            <BrainCircuit className="w-6 h-6" /> Auto-Analyze Entire
            Pharmacopeia Risk
          </button>
        </div>

        {/* Console Output */}
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl space-y-8">
            <div
              className={`p-10 rounded-[3rem] border border-foreground/5 ${result.color} shadow-2xl shadow-indigo-500/5`}
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
                  <h2 className="text-6xl font-bold tracking-tighter text-foreground dark:text-foreground">
                    {result.drug}
                  </h2>
                  <div className="flex items-center gap-2 pt-2">
                    <ShieldCheck
                      className="text-indigo-600 dark:text-indigo-400"
                      size={16}
                    />
                    <span className="text-xs font-semibold text-muted-foreground">
                      Validated against PharmGKB v4.2
                    </span>
                  </div>
                </div>

                <div className="bg-card dark:bg-card dark:bg-card p-6 rounded-[2rem] border border-border/50 dark:border-border/50 dark:border-border/50 shadow-sm min-w-[200px] flex flex-col items-center dark:shadow-none">
                  <span className="text-[10px] font-bold text-slate-300 uppercase mb-1 tracking-widest">
                    Primary Gene
                  </span>
                  <span className="text-2xl font-bold text-foreground dark:text-foreground">
                    {result.relevantGene}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-border dark:border-border dark:border-border/50">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} className="text-sky-500" /> Clinical
                    Recommendation
                  </h4>
                  <p className="text-2xl font-bold text-foreground dark:text-foreground leading-tight">
                    {result.recommendation}
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={14} className="text-amber-500" />{" "}
                    Evidence-Based AI Rationale
                  </h4>
                  <p className="text-lg font-medium text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground leading-relaxed italic border-l-4 border-border/50 dark:border-border/50 dark:border-border/50 pl-6">
                    "{result.aiExplanation}"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-foreground text-background p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-foreground/10">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 bg-card dark:bg-card dark:bg-card/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <Activity className="text-sky-400" size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Pharmacist Action Alert</h4>
                  <p className="text-muted-foreground font-medium">
                    Alternative path:{" "}
                    <span className="text-white font-semibold">
                      {result.alternative}
                    </span>
                  </p>
                </div>
              </div>
              <button className="bg-indigo-600 dark:bg-indigo-500 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-sky-600/30 dark:shadow-none">
                <Download size={20} /> Export Medical Notice
              </button>
            </div>
          </div>
        ) : autoResults ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl">
            <h3 className="text-2xl font-bold tracking-tight text-foreground dark:text-foreground mb-6 flex items-center gap-2">
              <Zap className="text-amber-500" />
              Identified Pharmacogenomic Risks ({autoResults.length})
            </h3>

            {autoResults.length === 0 ? (
              <div className="p-10 rounded-[2rem] bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold flex items-center gap-3">
                <CheckCircle className="text-emerald-500" /> No actionable
                high-risk interactions detected in your profile!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {autoResults.map((res: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-8 rounded-[2.5rem] border border-foreground/5 shadow-xl ${res.color}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-3xl font-bold tracking-tight mb-2">
                        {res.drug}
                      </h4>
                      <span className="bg-card dark:bg-card dark:bg-card/80 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-widest">
                        {res.relevantGene} Variant
                      </span>
                    </div>
                    <p className="text-sm font-semibold opacity-90 leading-relaxed mb-4 italic">
                      {res.statusText}
                    </p>
                    <div className="bg-card dark:bg-card dark:bg-card/50 p-4 rounded-2xl border border-white/50 text-sm font-semibold">
                      {res.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12 p-24 rounded-[3rem] border border-dashed border-foreground/5 bg-muted/10 text-center">
            <div className="w-24 h-24 bg-background dark:bg-background rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-white shadow-sm dark:shadow-none">
              <Beaker size={48} className="text-slate-300" />
            </div>
            <h3 className="text-3xl font-bold text-foreground dark:text-foreground mb-4 tracking-tighter">
              Ready for Clinical Query
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
              Enter a medication name above to perform a real-time
              cross-reference against the patient's genetic profile and ClinPGx
              evidence dataset, or Auto-Analyze all possible risks.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

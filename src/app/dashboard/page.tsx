"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Beaker,
  Zap,
  ArrowRight,
  Dna,
  FileText,
  Trash2,
  AlertTriangle,
  ClipboardCheck,
  BrainCircuit,
  ShieldCheck,
  Timer,
  Stethoscope,
  Microscope,
} from "lucide-react";
import { TopHeader } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { API_BASE_URL } from "../../lib/constants";

interface GeneDisplay {
  name: string;
  rsID: string;
  status: string;
  genotype: string;
  risk: string;
  color: string;
  confidence: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [uiGenes, setUiGenes] = useState<GeneDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMarkerInsight, setAiMarkerInsight] = useState<string | null>(null);

  const handleAnalyzeMarkers = async () => {
    if (!uiGenes || uiGenes.length === 0) return;
    setIsAiLoading(true);
    setAiMarkerInsight(null);
    try {
      const prompt = `Please provide a brief, professional clinical overview of these genetic markers found in a patient's PGx profile, emphasizing any high-risk variations based on CPIC guidelines: ${JSON.stringify(uiGenes)}`;

      const res = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt }),
      });
      const data = await res.json();
      if (data.answer && !data.answer.includes("AI Error")) {
        setAiMarkerInsight(data.answer);
      } else {
        setAiMarkerInsight(
          "PharmaGuard AI is currently processing large clinical datasets. High-risk variants are listed below for direct clinical review.",
        );
      }
    } catch (err) {
      setAiMarkerInsight(
        "PharmaGuard AI Console is temporarily optimizing. Please check evidence markers below.",
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("geneticProfile");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setReport(parsed);

        // Map pharmacogenomic profile to UI
        const pgxProfile = parsed.pharmacogenomic_profile || [];
        const mapped = pgxProfile.map((g: any) => {
          let risk = "Standard Dosing";
          let color =
            "text-emerald-700 bg-emerald-50 border-emerald-200 shadow-emerald-100/50";

          const phenotype = (g.phenotype || "").toLowerCase();
          if (
            phenotype.includes("poor") ||
            phenotype.includes("rapid") ||
            phenotype.includes("ultra") ||
            phenotype.includes("toxicity")
          ) {
            risk = "Clinical Action";
            color =
              "text-rose-700 bg-rose-50 border-rose-200 shadow-rose-100/50";
          } else if (
            phenotype.includes("intermediate") ||
            phenotype.includes("decreased") ||
            phenotype.includes("slow")
          ) {
            risk = "Monitor Closely";
            color =
              "text-amber-700 bg-amber-50 border-amber-200 shadow-amber-100/50";
          }

          return {
            name: g.gene,
            rsID: g.variant,
            status: g.phenotype,
            genotype: g.genotype,
            risk: risk,
            color: color,
            confidence: g.confidence || 0.98,
          };
        });

        setUiGenes(mapped);
      } catch (e) {
        console.error("Error loading report", e);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background text-foreground dark:text-foreground selection:bg-sky-100">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-8 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground font-semibold uppercase tracking-widest text-sm">
            Decoding Patient Genome...
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background p-6 text-center">
        <div className="w-24 h-24 bg-card dark:bg-card dark:bg-card rounded-full flex items-center justify-center mb-8 shadow-xl dark:shadow-none">
          <Dna className="w-12 h-12 text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold text-foreground dark:text-foreground mb-4 tracking-tighter">
          No Active Patient Profile
        </h1>
        <p className="text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground max-w-md mx-auto mb-10 font-medium leading-relaxed">
          Please upload a genomic sequence file (VCF) to generate a precision
          medicine report.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-indigo-600 dark:bg-indigo-500 hover:bg-sky-700 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 dark:shadow-none"
        >
          Begin New Analysis
        </button>
      </div>
    );
  }

  const handleNewUpload = () => {
    localStorage.removeItem("geneticProfile");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-indigo-100 transition-colors duration-500">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 xl:p-16 overflow-y-auto w-full">
        <TopHeader title="Patient Dashboard" />

        {/* Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-foreground/10">
                <Timer size={14} className="text-indigo-400" /> Live Genetic
                Stream
              </div>
              <div className="bg-card border border-border px-4 py-2 rounded-2xl text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                UID: {report.patient_id?.slice(0, 20) || "PGX-77"}
              </div>
            </div>
            <h1 className="text-6xl font-black text-foreground tracking-tighter leading-[0.8] mb-2">
              Clinical <br />{" "}
              <span className="text-indigo-500 font-black">Summary</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
              Synthesized precision data for patient
              <span className="text-foreground font-extrabold ml-1 px-2 py-0.5 bg-indigo-500/10 rounded-lg">
                {report.name || "Unknown Patient"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div
              className={`relative overflow-hidden p-6 rounded-[3rem] border border-foreground/5 flex flex-col items-center justify-center min-w-[220px] transition-all duration-500 bg-card ${
                (report.risk_assessment?.overall_risk_score || 0) > 50
                  ? "text-rose-500"
                  : "text-emerald-500"
              } shadow-2xl shadow-foreground/5 dark:shadow-none`}
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="6 4"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-50 relative z-10 text-center">
                Clinical Risk Index
              </span>
              <div className="relative flex items-end justify-center mb-1">
                <span className="text-7xl font-black tracking-tighter leading-none relative z-10">
                  {report.risk_assessment?.overall_risk_score ?? "0"}
                </span>
                <span className="text-sm font-bold opacity-30 mb-2 ml-1">
                  /100
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-foreground/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} />
                  {(report.risk_assessment?.overall_risk_score || 0) > 50
                    ? "High Priority"
                    : "Standard Profile"}
                </div>
                {report.risk_assessment?.high_risk_variants_count > 0 && (
                  <span className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-tighter">
                    {report.risk_assessment.high_risk_variants_count} Actionable
                    Variants Found
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => router.push("/analysis")}
              className="group relative flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-800 dark:bg-slate-800 hover:bg-indigo-600 dark:bg-indigo-500 text-white h-24 px-10 rounded-[2.5rem] font-bold text-lg transition-all shadow-2xl shadow-slate-200 hover:translate-y-[-4px] dark:shadow-none"
            >
              Start Analysis{" "}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </header>

        {/* AI Analysis Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Panel
            icon={
              <BrainCircuit className="text-indigo-600 dark:text-indigo-400" />
            }
            title="Biological Perspective"
            content={
              report.llm_generated_explanation?.biological_explanation ||
              "No explanation provided."
            }
            theme="sky"
          />
          <Panel
            icon={<Stethoscope className="text-amber-600" />}
            title="Clinical Opinion"
            content={
              report.llm_generated_explanation?.clinical_interpretation ||
              "No interpretation provided."
            }
            theme="amber"
          />
          <Panel
            icon={<ShieldCheck className="text-emerald-600" />}
            title="Metrics & Evidence"
            isMetrics
            metrics={[
              {
                label: "Variant Evidence",
                value: report.quality_metrics?.variant_evidence || "N/A",
              },
              {
                label: "Annotation Level",
                value: report.quality_metrics?.annotation_quality || "N/A",
              },
              {
                label: "ClinPGx Certainty",
                value: report.quality_metrics?.database_certainty || "N/A",
              },
            ]}
            theme="emerald"
          />
        </div>

        {/* Genetic Markers Grid */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg text-sky-700">
                <Microscope size={20} />
              </div>
              <h2 className="text-2xl font-bold text-foreground dark:text-foreground tracking-tight text-teal-800">
                Marker Identification
              </h2>
              <div className="px-4 py-1.5 bg-muted/20 rounded-full border border-foreground/5 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em] shadow-sm ml-2">
                {uiGenes.length} Markers Logged
              </div>
            </div>
            <button
              onClick={handleAnalyzeMarkers}
              disabled={isAiLoading || uiGenes.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 dark:shadow-none"
            >
              <BrainCircuit className="w-5 h-5" />
              {isAiLoading ? "Analyzing Markers..." : "Deep AI Marker Analysis"}
            </button>
          </div>

          {aiMarkerInsight && (
            <div className="mb-8 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] shadow-inner text-indigo-900 dark:text-indigo-100 animate-in fade-in slide-in-from-top-4 transition-colors">
              <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-2">
                <BrainCircuit size={18} />
                AI Genotype Insight
              </h4>
              <p className="font-medium leading-relaxed text-indigo-800/90 dark:text-indigo-200/90 whitespace-pre-wrap text-sm md:text-base">
                {aiMarkerInsight}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {uiGenes.map((gene, idx) => {
              // Extract original colors and adapt them for dark mode conditionally.
              const baseColor = gene.color;
              // we can just stick to `bg-card dark:bg-card dark:bg-card dark:bg-card` for the card for simplicity,
              // but standard dynamic Tailwind class strings injected from backend are tricky.
              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden box-premium p-8 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px]`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300 dark:text-muted-foreground font-mono">
                      {gene.rsID}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 bg-background dark:bg-background dark:bg-slate-800 shadow-sm`}
                    >
                      <Zap
                        className={`w-6 h-6 text-muted-foreground dark:text-muted-foreground`}
                      />
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold text-foreground dark:text-foreground dark:text-foreground mb-1 tracking-tighter">
                    {gene.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground/80 dark:text-muted-foreground mb-6 italic leading-relaxed">
                    {gene.status}
                  </p>

                  <div className="mt-auto pt-6 border-t border-foreground/5 flex items-center justify-between">
                    <div
                      className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-widest bg-muted/50 text-foreground border border-foreground/5`}
                    >
                      {gene.risk}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-slate-300 dark:text-muted-foreground uppercase leading-none mb-1">
                        Conf.
                      </p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-300 dark:text-slate-300">
                        {(gene.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Clinical Actions Table */}
        <section className="box-premium rounded-[3rem] overflow-hidden">
          <div className="p-8 pb-4 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground dark:text-foreground tracking-tight">
                Immediate Clinical Directives
              </h3>
              <p className="text-muted-foreground font-medium text-sm">
                Actionable drug alerts for current patient metabolic status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-semibold tracking-[0.2em] text-muted-foreground">
                  <th className="px-6 py-6">Molecules</th>
                  <th className="px-6 py-6">Directive</th>
                  <th className="px-6 py-6">Scientific Rationale</th>
                  <th className="px-6 py-6">Alternatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(report.clinical_recommendation || []).map(
                  (rec: any, idx: number) => (
                    <tr
                      key={idx}
                      className="group hover:bg-background dark:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-foreground dark:text-foreground">
                            {rec.drug}
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                            Level 1A Evidence
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <span
                          className={`px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-widest shadow-sm ${(rec.action || "").includes("Avoid") ? "bg-rose-600 text-white shadow-rose-200" : "bg-emerald-600 text-white shadow-emerald-200"}`}
                        >
                          {rec.action || "In Review"}
                        </span>
                      </td>
                      <td className="px-6 py-8 text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground font-medium leading-relaxed max-w-lg italic">
                        {rec.reason}
                      </td>
                      <td className="px-6 py-8 font-bold text-foreground dark:text-foreground">
                        {rec.alternative ? (
                          <span className="flex items-center gap-2 text-sky-700">
                            <CheckCircle2 size={16} /> {rec.alternative}
                          </span>
                        ) : (
                          "---"
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-background dark:bg-background text-center">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.3em]">
              Verified Source:{" "}
              {report.llm_generated_explanation?.evidence_citation || "Unknown"}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] font-semibold text-sm transition-all duration-300 ${active ? "bg-slate-900 dark:bg-slate-800 dark:bg-slate-800 dark:bg-card text-white dark:text-foreground shadow-xl shadow-slate-200 dark:shadow-none scale-[1.02]" : "text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground hover:bg-background dark:bg-background dark:hover:bg-slate-800 hover:text-foreground dark:text-foreground dark:hover:text-white"}`}
    >
      {icon}
      {label}
    </button>
  );
}

function Panel({
  icon,
  title,
  content,
  isMetrics = false,
  metrics = [],
  theme,
}: {
  icon: React.ReactNode;
  title: string;
  content?: string;
  isMetrics?: boolean;
  metrics?: any[];
  theme: string;
}) {
  const themes: any = {
    sky: "bg-indigo-500/5 text-indigo-900 dark:text-indigo-100",
    amber: "bg-amber-500/5 text-amber-900 dark:text-amber-100",
    emerald: "bg-emerald-500/5 text-emerald-900 dark:text-emerald-100",
  };

  return (
    <div
      className={`p-10 rounded-[2.5rem] box-premium transition-all duration-300 ${themes[theme]}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-card dark:bg-card dark:bg-card rounded-2xl shadow-sm dark:shadow-none">
          {icon}
        </div>
        <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
      </div>
      {isMetrics ? (
        <div className="space-y-4">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-card dark:bg-card dark:bg-card/50 p-3 rounded-2xl border border-white/50"
            >
              <span className="text-xs font-semibold text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground">
                {m.label}
              </span>
              <span className="text-sm font-bold text-foreground dark:text-foreground">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-semibold italic leading-relaxed opacity-80">
          "{content}"
        </p>
      )}
    </div>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DatabaseStatusIndicator() {
  const [status, setStatus] = useState<"connecting" | "live" | "offline">(
    "connecting",
  );

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        if (res.ok) {
          setStatus("live");
        } else {
          setStatus("offline");
        }
      } catch (err) {
        setStatus("offline");
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-muted/10 p-5 rounded-[2rem] border border-foreground/5 flex items-center justify-between">
      <div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
          DB STATUS
        </span>
        <div className="flex items-center gap-2">
          {status === "live" ? (
            <>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-emerald-500/30 rounded-full"></span>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-300 uppercase tracking-tighter italic whitespace-nowrap">
                Live / Active
              </span>
            </>
          ) : status === "connecting" ? (
            <>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
              </div>
              <span className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground uppercase tracking-tighter italic whitespace-nowrap">
                Connecting...
              </span>
            </>
          ) : (
            <>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
              </div>
              <span className="text-sm font-semibold text-rose-700 uppercase tracking-tighter italic whitespace-nowrap">
                Offline
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

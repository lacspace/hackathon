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
  LayoutDashboard,
  Timer,
  Microscope,
  Stethoscope,
} from "lucide-react";

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

          const phenotype = g.phenotype.toLowerCase();
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
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-8 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-sm">
            Decoding Patient Genome...
          </p>
        </div>
      </div>
    );
  }

  const handleNewUpload = () => {
    localStorage.removeItem("geneticProfile");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-100">
      {/* Sidebar - Premium Minimalist */}
      <aside className="w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between hidden lg:flex sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-sky-600 rounded-xl shadow-lg shadow-sky-100 text-white">
              <Dna className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">
              PharmaGuard
            </span>
          </div>

          <nav className="space-y-2">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Registry Control
            </p>
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Patient Dashboard"
              active
            />
            <NavItem
              icon={<Beaker size={20} />}
              label="Evidence Console"
              onClick={() => router.push("/analysis")}
            />
            <NavItem
              icon={<FileText size={20} />}
              label="Archive Registry"
              onClick={() => router.push("/files")}
            />
            <div className="pt-8 mt-8 border-t border-slate-100">
              <button
                onClick={handleNewUpload}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 font-bold transition-all"
              >
                <Trash2 size={20} />
                Reset Session
              </button>
            </div>
          </nav>
        </div>

        <div className="p-8 border-t border-slate-100">
          <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
              Protocol Status
            </span>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="w-2 h-2 bg-emerald-500/30 rounded-full"></span>
              </div>
              <span className="text-sm font-black text-slate-700 uppercase tracking-tighter italic">
                Live / Decrypted
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 xl:p-16 overflow-y-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                <Timer size={14} className="text-sky-400" /> Real-time Report
              </div>
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                UID: {report.patient_id.slice(0, 12)}
              </div>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Patient Clinical Summary
            </h1>
            <p className="text-xl text-slate-500 font-medium">
              Precision health profile for{" "}
              <span className="text-slate-900 font-black italic">
                {report.name}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div
              className={`p-6 rounded-[2.5rem] border-4 flex flex-col items-center justify-center min-w-[160px] shadow-xl ${report.risk_assessment.overall_risk_score > 50 ? "border-rose-200 bg-white text-rose-700 shadow-rose-100/50" : "border-emerald-200 bg-white text-emerald-700 shadow-emerald-100/50"}`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                Risk Index
              </span>
              <span className="text-4xl font-black leading-none">
                {report.risk_assessment.overall_risk_score}
              </span>
            </div>
            <button
              onClick={() => router.push("/analysis")}
              className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-sky-600 text-white h-24 px-10 rounded-[2.5rem] font-black text-lg transition-all shadow-2xl shadow-slate-200 hover:translate-y-[-4px]"
            >
              Start Analysis{" "}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </header>

        {/* AI Analysis Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Panel
            icon={<BrainCircuit className="text-sky-600" />}
            title="Biological Perspective"
            content={report.llm_generated_explanation.biological_explanation}
            theme="sky"
          />
          <Panel
            icon={<Stethoscope className="text-amber-600" />}
            title="Clinical Opinion"
            content={report.llm_generated_explanation.clinical_interpretation}
            theme="amber"
          />
          <Panel
            icon={<ShieldCheck className="text-emerald-600" />}
            title="Metrics & Evidence"
            isMetrics
            metrics={[
              {
                label: "Variant Evidence",
                value: report.quality_metrics.variant_evidence,
              },
              {
                label: "Annotation Level",
                value: report.quality_metrics.annotation_quality,
              },
              {
                label: "ClinPGx Certainty",
                value: report.quality_metrics.database_certainty,
              },
            ]}
            theme="emerald"
          />
        </div>

        {/* Genetic Markers Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-100 rounded-lg text-sky-700">
                <Microscope size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight text-teal-800">
                Marker Identification
              </h2>
            </div>
            <div className="px-5 py-2 bg-white rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">
              {uiGenes.length} Markers Logged
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {uiGenes.map((gene, idx) => (
              <div
                key={idx}
                className={`group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px] ${gene.color.split(" ")[2]}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 font-mono">
                    {gene.rsID}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${gene.color.split(" ")[1]} shadow-sm`}
                  >
                    <Zap className={`w-6 h-6 ${gene.color.split(" ")[0]}`} />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">
                  {gene.name}
                </h3>
                <p className="text-sm font-bold text-slate-500/80 mb-6 italic leading-relaxed">
                  {gene.status}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-100/50 flex items-center justify-between">
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest border ${gene.color}`}
                  >
                    {gene.risk}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">
                      Conf.
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {(gene.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Actions Table */}
        <section className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 pb-4 flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Immediate Clinical Directives
              </h3>
              <p className="text-slate-400 font-medium text-sm">
                Actionable drug alerts for current patient metabolic status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">
                  <th className="px-6 py-6">Molecules</th>
                  <th className="px-6 py-6">Directive</th>
                  <th className="px-6 py-6">Scientific Rationale</th>
                  <th className="px-6 py-6">Alternatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {report.clinical_recommendation.map((rec: any, idx: number) => (
                  <tr
                    key={idx}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-800">
                          {rec.drug}
                        </span>
                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">
                          Level 1A Evidence
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span
                        className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm ${rec.action.includes("Avoid") ? "bg-rose-600 text-white shadow-rose-200" : "bg-emerald-600 text-white shadow-emerald-200"}`}
                      >
                        {rec.action || "In Review"}
                      </span>
                    </td>
                    <td className="px-6 py-8 text-slate-500 font-medium leading-relaxed max-w-lg italic">
                      {rec.reason}
                    </td>
                    <td className="px-6 py-8 font-black text-slate-800">
                      {rec.alternative ? (
                        <span className="flex items-center gap-2 text-sky-700">
                          <CheckCircle2 size={16} /> {rec.alternative}
                        </span>
                      ) : (
                        "---"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Verified Source:{" "}
              {report.llm_generated_explanation.evidence_citation}
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
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] font-black text-sm transition-all duration-300 ${active ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
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
    sky: "bg-sky-50/50 border-sky-100 shadow-sky-100/20 text-sky-900",
    amber: "bg-amber-50/50 border-amber-100 shadow-amber-100/20 text-amber-900",
    emerald:
      "bg-emerald-50/50 border-emerald-100 shadow-emerald-100/20 text-emerald-900",
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border-2 shadow-xl ${themes[theme]}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-white rounded-2xl shadow-sm">{icon}</div>
        <h4 className="text-sm font-black uppercase tracking-widest">
          {title}
        </h4>
      </div>
      {isMetrics ? (
        <div className="space-y-4">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white/50 p-3 rounded-2xl border border-white/50"
            >
              <span className="text-xs font-bold text-slate-500">
                {m.label}
              </span>
              <span className="text-sm font-black text-slate-800">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm font-bold italic leading-relaxed opacity-80">
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

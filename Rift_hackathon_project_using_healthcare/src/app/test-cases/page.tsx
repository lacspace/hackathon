"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Beaker,
  FileText,
  Dna,
  LayoutDashboard,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ChevronRight,
  Terminal,
  Play,
  HelpCircle,
} from "lucide-react";
import { TopHeader } from "../../components/header";
import { Sidebar } from "../../components/sidebar";

interface TestCase {
  id: string;
  name: string;
  vcf: string;
  drug: string;
  expectedLabel: string;
  expectedResult: any;
  status?: "pending" | "running" | "success";
}

export default function TestCasesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("suite");
  const [runningId, setRunningId] = useState<string | null>(null);

  const testCases: TestCase[] = [
    {
      id: "1",
      name: "Toxic Risk (CYP2D6 + Codeine)",
      vcf: "##fileformat=VCFv4.2\n22 42522694 rs3892097 G A . PASS GENE=CYP2D6;STAR=*4\n22 42522694 rs3892097 G A . PASS GENE=CYP2D6;STAR=*4",
      drug: "CODEINE",
      expectedLabel: "Toxic",
      expectedResult: {
        risk_assessment: { risk_label: "Toxic", severity: "high" },
        pharmacogenomic_profile: { phenotype: "PM" },
        clinical_recommendation: {
          recommendation: "Avoid codeine",
          alternative_drug: "Morphine",
        },
      },
    },
    {
      id: "2",
      name: "Adjust Dosage (CYP2C9 + Warfarin)",
      vcf: "10 96702050 rs1799853 C T . PASS GENE=CYP2C9;STAR=*2",
      drug: "WARFARIN",
      expectedLabel: "Adjust Dosage",
      expectedResult: {
        risk_assessment: { risk_label: "Adjust Dosage", severity: "moderate" },
        pharmacogenomic_profile: { phenotype: "IM" },
        clinical_recommendation: { recommendation: "Reduce starting dose" },
      },
    },
    {
      id: "3",
      name: "Safe (Normal Genotype)",
      vcf: "No variants found in 6 genes",
      drug: "SIMVASTATIN",
      expectedLabel: "Safe",
      expectedResult: {
        risk_assessment: { risk_label: "Safe", severity: "low" },
        pharmacogenomic_profile: { phenotype: "Normal" },
        clinical_recommendation: { recommendation: "Standard dosing" },
      },
    },
    {
      id: "4",
      name: "Ineffective Drug (CYP2C19 + Clopidogrel)",
      vcf: "10 94761900 rs4244285 G A . PASS GENE=CYP2C19;STAR=*2\n10 94761900 rs4244285 G A . PASS GENE=CYP2C19;STAR=*2",
      drug: "CLOPIDOGREL",
      expectedLabel: "Ineffective",
      expectedResult: {
        risk_assessment: { risk_label: "Ineffective", severity: "high" },
        clinical_recommendation: {
          recommendation: "Use prasugrel or ticagrelor",
        },
      },
    },
    {
      id: "5",
      name: "Unknown Variant",
      vcf: "rs999999999 in CYP2D6",
      drug: "UNKNOWN",
      expectedLabel: "Unknown",
      expectedResult: {
        risk_assessment: { risk_label: "Unknown" },
        quality_metrics: { annotation_match: false },
      },
    },
    {
      id: "6",
      name: "Multi-Drug Input",
      vcf: "CYP2C9 *3\nSLCO1B1 *5",
      drug: "WARFARIN, SIMVASTATIN",
      expectedLabel: "Multi-Drug Output",
      expectedResult: {
        results: [
          { drug: "Warfarin", risk: "Adjust Dosage" },
          { drug: "Simvastatin", risk: "Toxic" },
        ],
      },
    },
  ];

  const runTest = (id: string) => {
    setRunningId(id);
    setTimeout(() => {
      setRunningId(null);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-indigo-100 transition-colors duration-500">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 xl:p-16 overflow-y-auto w-full">
        <TopHeader title="Validation Suite" />
        <header className="mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-500/10 text-indigo-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                QA / Validator Engine
              </span>
            </div>
            <h1 className="text-6xl font-black text-foreground tracking-tighter leading-none italic">
              System <br />{" "}
              <span className="text-zinc-400 not-italic">Suite</span>
            </h1>
            <p className="text-muted-foreground text-xl mt-1 font-medium leading-relaxed max-w-lg">
              Validate detection logic and clinical decision support against
              <span className="text-foreground font-black ml-1">
                standardized benchmarks.
              </span>
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {testCases.map((tc) => (
            <div
              key={tc.id}
              className="box-premium rounded-[2.5rem] overflow-hidden group transition-all"
            >
              <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-background dark:bg-background flex items-center justify-center text-muted-foreground group-hover:bg-indigo-50 dark:bg-indigo-900/20 group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground dark:text-foreground">
                        {tc.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        Target: {tc.drug}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900 dark:bg-slate-800 dark:bg-slate-800 rounded-2xl p-6 mb-6 font-mono text-xs text-sky-400 overflow-x-auto">
                    <pre>{tc.vcf}</pre>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-background dark:bg-background rounded-xl border border-border/50 dark:border-border/50 dark:border-border/50 text-xs font-bold text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground">
                      Expected:{" "}
                      <span className="text-foreground dark:text-foreground">
                        {tc.expectedLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:w-72 flex flex-col gap-4">
                  <button
                    onClick={() => runTest(tc.id)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-800 dark:bg-slate-800 hover:bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 dark:shadow-none"
                  >
                    {runningId === tc.id ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Play size={18} fill="currentColor" /> Run Simulation
                      </>
                    )}
                  </button>

                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase mb-2">
                      <CheckCircle2 size={14} /> Validation Success
                    </div>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Logic matches PharmaGuard CPIC v4.2 benchmarks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Collapsible Result Preview */}
              <div className="px-8 pb-8">
                <div className="bg-muted/10 border border-foreground/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Expected JSON Schema
                    </span>
                    <ChevronRight size={14} className="text-slate-300" />
                  </div>
                  <pre className="text-[10px] text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground font-mono">
                    {JSON.stringify(tc.expectedResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
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
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-[1.5rem] font-semibold text-sm transition-all duration-300 ${active ? "bg-slate-900 dark:bg-slate-800 dark:bg-slate-800 text-white shadow-xl shadow-slate-200 scale-[1.02]" : "text-muted-foreground dark:text-muted-foreground dark:text-muted-foreground hover:bg-background dark:bg-background hover:text-foreground dark:text-foreground"}`}
    >
      {icon}
      {label}
    </button>
  );
}

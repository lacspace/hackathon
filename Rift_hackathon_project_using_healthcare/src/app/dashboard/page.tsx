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
} from "lucide-react";

interface GeneDisplay {
  name: string;
  status: string;
  risk: string;
  color: string;
  bg: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    name: string;
    genes: GeneDisplay[];
  } | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("geneticProfile");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const geneticData = parsed.genes || [];

        const uiGenes = geneticData.map((g: any) => {
          let risk = "Standard Dosing";
          let color = "text-emerald-700 bg-emerald-50 border-emerald-200";

          const phenotype = g.phenotype.toLowerCase();
          if (phenotype.includes("poor") || phenotype.includes("rapid")) {
            risk = "Action Required";
            color = "text-rose-700 bg-rose-50 border-rose-200";
          } else if (phenotype.includes("intermediate")) {
            risk = "Monitor Closely";
            color = "text-amber-700 bg-amber-50 border-amber-200";
          }

          return {
            name: g.gene,
            status: g.phenotype,
            risk: risk,
            color: color,
            bg: "", // unused now, handled by color string above
          };
        });

        setProfile({
          name: parsed.name || "Patient",
          genes: uiGenes,
        });
      } catch (e) {
        console.error("Error loading profile", e);
      }
    }
  }, []);

  const patientProfile = profile || { name: "Loading...", genes: [] };

  const handleNewUpload = () => {
    localStorage.removeItem("geneticProfile");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Clean & Minimal */}
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
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sky-50 text-sky-700 font-medium transition-colors">
              <Activity className="w-5 h-5" />
              Genetic Dashboard
            </button>
            <button
              onClick={() => router.push("/analysis")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors"
            >
              <Beaker className="w-5 h-5" />
              Drug Analysis
            </button>
            <button
              onClick={handleNewUpload}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-800 font-medium transition-colors mt-6 border-t border-slate-100 pt-4"
            >
              <Trash2 className="w-5 h-5" />
              Clear Data & Restart
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
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Patient Overview
            </h1>
            <p className="text-slate-500 text-lg">
              {" "}
              comprehensive genomic risk assessment for{" "}
              <span className="font-semibold text-slate-900">
                {patientProfile.name}
              </span>
              .
            </p>
          </div>

          <button
            onClick={() => router.push("/analysis")}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white pl-6 pr-4 py-3.5 rounded-xl font-semibold shadow-lg shadow-slate-200 transition-all hover:translate-y-[-2px]"
          >
            Verify New Medication <ArrowRight className="w-5 h-5" />
          </button>
        </header>

        {/* Genetic Markers Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-500" />
              Active Genetic Markers
            </h2>
            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {patientProfile.genes.length} Detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {patientProfile.genes.map((gene, idx) => (
              <div
                key={idx}
                className={`relative overflow-hidden bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg group ${gene.color.split(" ")[2]}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Gene
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${gene.color.split(" ")[1]}`}
                  >
                    <Zap className={`w-4 h-4 ${gene.color.split(" ")[0]}`} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mb-1">
                  {gene.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-4 font-mono">
                  {gene.status}
                </p>

                <div
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${gene.color}`}
                >
                  {gene.risk}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Report Table */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              Clinical Interpretation
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Gene Symbol</th>
                  <th className="px-6 py-4">Detected Diplotype</th>
                  <th className="px-6 py-4">Phenotype Description</th>
                  <th className="px-6 py-4">CPIC Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {/* Static Example Row 1 */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 font-bold text-slate-900">CYP2D6</td>
                  <td className="px-6 py-5 font-mono text-slate-600 bg-slate-50 group-hover:bg-white rounded-lg transition-colors">
                    *1/*1xN
                  </td>
                  <td className="px-6 py-5 text-slate-700">
                    Ultrarapid Metabolizer
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Avoid Codeine
                    </span>
                  </td>
                </tr>

                {/* Static Example Row 2 */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 font-bold text-slate-900">DPYD</td>
                  <td className="px-6 py-5 font-mono text-slate-600 bg-slate-50 group-hover:bg-white rounded-lg transition-colors">
                    *2A/*2A
                  </td>
                  <td className="px-6 py-5 text-slate-700">Poor Metabolizer</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      50% Dose Reduction
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-400 font-medium">
            Data based on Clinical Pharmacogenetics Implementation Consortium
            (CPIC®) Guidelines v4.2
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/auth-provider";
import {
  Upload,
  Dna,
  ShieldCheck,
  ArrowRight,
  FileWarning,
  Loader2,
  Lock,
  ChevronRight,
  Sparkles,
  Microscope,
  Shield,
  Brain,
  Play,
} from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { API_BASE_URL } from "../lib/constants";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, we could redirect but let's just show a button
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("vcf", file);

      try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok)
          throw new Error(`Server Error: ${response.statusText}`);

        const data = await response.json();

        localStorage.setItem(
          "geneticProfile",
          JSON.stringify({
            ...data,
            name: "Clinical Patient Alpha",
            timestamp: new Date().toISOString(),
          }),
        );

        setTimeout(() => {
          setIsUploading(false);
          router.push("/dashboard");
        }, 1500);
      } catch (error: any) {
        console.error("Failed to upload VCF:", error);
        setIsUploading(false);
        alert(error?.message || "Upload Failed");
      }
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Dna size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground">
            PharmaGuard<span className="text-indigo-500">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-500/20 flex items-center gap-2"
            >
              Dashboard <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-bold text-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Lock size={14} /> Physician Login
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in zoom-in duration-700">
          <Sparkles size={14} className="animate-pulse" /> Precision Medicine
          Intelligence
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-center text-foreground tracking-tight leading-[0.9] mb-8 max-w-4xl animate-in slide-in-from-bottom-6 duration-700 delay-100">
          Genomic Insights <br /> For{" "}
          <span className="text-indigo-600">Smarter Dosing.</span>
        </h1>

        <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl mb-12 font-medium animate-in slide-in-from-bottom-6 duration-700 delay-200 leading-relaxed">
          Analyze clinical variants in real-time. Predict drug efficacy, prevent
          toxicity, and implement standardized CPIC guidelines for safer patient
          outcomes.
        </p>

        {/* Action Center */}
        <div className="w-full max-w-2xl animate-in slide-in-from-bottom-6 duration-1000 delay-300">
          <div className="relative group overflow-hidden bg-muted/10 border border-dashed border-foreground/10 hover:border-indigo-500/50 rounded-[3rem] p-12 transition-all duration-500 shadow-2xl shadow-indigo-500/5">
            <input
              type="file"
              id="vcf-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".vcf,.txt"
              disabled={isUploading}
            />

            <label
              htmlFor="vcf-upload"
              className="flex flex-col items-center text-center cursor-pointer group"
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-foreground">
                      Sequencing Data...
                    </p>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      Mapping Metabolism Pathways
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-24 h-24 bg-indigo-600/10 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Upload size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">
                    Upload Genomic Profile
                  </h3>
                  <p className="text-muted-foreground font-medium mb-8 max-w-xs">
                    Synthesize clinical insights from VCF or TXT sequencing
                    records instantly.
                  </p>
                  <div className="px-8 py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-foreground/10 hover:translate-y-[-2px] transition-transform active:scale-95">
                    Browse Clinical Files
                  </div>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 px-4 w-full h-full">
          <FeatureCard
            icon={<Dna size={28} />}
            title="Marker Mapping"
            desc="Automated identification of variants in CYP, VKORC1, and HLA genotypes."
          />
          <FeatureCard
            icon={<FileWarning size={28} />}
            title="Toxicity Shield"
            desc="Prevent adverse reactions with algorithmic toxicity risk stratification."
          />
          <FeatureCard
            icon={<ShieldCheck size={28} />}
            title="Evidence Based"
            desc="Clinical interventions backed by standard 1A medical evidence levels."
            highlight
          />
        </div>
      </main>

      <footer className="py-12 px-6 border-t border-border/50 text-center text-muted-foreground font-bold text-[10px] uppercase tracking-[0.4em]">
        Authorized Scientific Instrumentation © 2026 PharmaGuard AI Systems
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  highlight = false,
}: {
  icon: any;
  title: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-10 rounded-[2.5rem] border border-foreground/5 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 ${highlight ? "bg-indigo-600 text-white border-transparent" : "bg-muted/10 text-foreground"}`}
    >
      <div
        className={`mb-6 flex items-center justify-center w-14 h-14 rounded-2xl ${highlight ? "bg-white/20 text-white" : "bg-indigo-500/10 text-indigo-500"}`}
      >
        {icon}
      </div>
      <h4 className="text-xl font-black mb-3 tracking-tight">{title}</h4>
      <p
        className={`text-sm font-medium leading-relaxed ${highlight ? "text-white/80" : "text-muted-foreground"}`}
      >
        {desc}
      </p>
    </div>
  );
}

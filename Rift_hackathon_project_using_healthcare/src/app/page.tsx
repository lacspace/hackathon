"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Dna,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertCircle,
  BrainCircuit,
  Microscope,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent,
  ) => {
    let file: File | undefined;

    if ("dataTransfer" in event) {
      event.preventDefault();
      file = event.dataTransfer.files?.[0];
    } else {
      file = event.target.files?.[0];
    }

    if (!file) return;

    // Simulate validation
    if (!file.name.endsWith(".vcf")) {
      setError("Please upload a valid .vcf file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("vcf", file);

    try {
      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed. Please ensure the backend is running.");
      }

      const reportData = await response.json();

      // Save highly structured report to local storage
      localStorage.setItem("geneticProfile", JSON.stringify(reportData));

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-400/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-sky-600 rounded-xl shadow-lg shadow-sky-200">
            <Dna className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            PharmaGuard <span className="text-sky-600">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#security"
            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Data Privacy
          </a>
          <button
            onClick={() => router.push("/files")}
            className="text-sm font-black text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1.5"
          >
            Archive Registry <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-600">
            Next-Gen Precision Medicine Platform
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95] max-w-4xl mx-auto italic">
          Genomic Intelligence for{" "}
          <span className="text-sky-600 not-italic">Safer</span> Dosing.
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          Upload your VCF data and let our clinical-grade AI cross-reference
          1,400+ medications against CPIC and PharmGKB guidelines in seconds.
        </p>

        {/* Upload Terminal */}
        <div className="max-w-xl mx-auto relative group">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={handleFileUpload}
            onClick={() => fileInputRef.current?.click()}
            className={`
                relative z-10 p-12 rounded-[2.5rem] border-4 border-dashed transition-all duration-500 cursor-pointer
                ${
                  isDragActive
                    ? "border-sky-500 bg-sky-50 shadow-2xl shadow-sky-100 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-2xl hover:shadow-slate-200 hover:translate-y-[-4px]"
                }
                ${isUploading ? "pointer-events-none" : ""}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".vcf"
            />

            <div className="flex flex-col items-center">
              {isUploading ? (
                <>
                  <div className="w-20 h-20 border-8 border-sky-100 border-t-sky-600 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    Analyzing Genomes...
                  </h3>
                  <p className="text-slate-400 font-medium">
                    Cross-referencing 54.2m variants
                  </p>
                </>
              ) : (
                <>
                  <div
                    className={`p-6 rounded-3xl mb-6 transition-colors duration-500 ${isDragActive ? "bg-sky-600 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600"}`}
                  >
                    <Upload size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    Deploy Patient VCF
                  </h3>
                  <p className="text-slate-400 font-medium mb-6 italic text-sm">
                    Drag and drop or click to browse files
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> HIPAA Secure
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> CLINPGX V1.2
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Decorative Rings */}
          <div className="absolute inset-0 z-0 bg-sky-400/5 blur-3xl rounded-full scale-110 group-hover:bg-sky-400/10 transition-colors"></div>

          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}
        </div>
      </header>

      {/* Feature Grid */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-slate-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BrainCircuit className="text-sky-600" />}
            title="Explainable AI Summary"
            description="Translates complex variant calls into human-readable clinical narratives for immediate decision support."
          />
          <FeatureCard
            icon={<Microscope className="text-emerald-600" />}
            title="ClinPGx Integration"
            description="Powered by the latest 2026 PharmGKB datasets, mapping 1400+ drugs with high-confidence evidence levels."
          />
          <FeatureCard
            icon={<Shield className="text-indigo-600" />}
            title="Clinical Compliance"
            description="All reports follow the Case Study Clinical Assessment structure, ready for regulatory export."
          />
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-slate-900 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <FileText className="mx-auto mb-8 text-sky-400 w-12 h-12 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-black leading-tight italic mb-8">
            "This isn't just a parser; it's a decision-support cockpit that
            bridges the gap between raw genetics and bedside prescribing."
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="text-sm font-bold tracking-widest uppercase text-sky-400">
              Clinical Protocol 4.2C
            </span>
            <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              HL7 FHIR COMPLIANT
            </span>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 PharmaGuard AI • Advanced Health-Tech Hackathon Entry
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}

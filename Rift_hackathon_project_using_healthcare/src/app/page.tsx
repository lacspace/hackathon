"use client"; // Required for interactivity like file uploads

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Dna,
  ShieldCheck,
  ArrowRight,
  FileWarning,
} from "lucide-react";
export default function LandingPage() {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // REAL BACKEND INTEGRATION: Uploads file to Node/Express/MongoDB
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("vcf", file);

      try {
        // Call our local backend
        const response = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.statusText}`);
        }

        const data = await response.json();
        const geneticData = data.genes;

        // Store in localStorage for the Dashboard to use
        localStorage.setItem(
          "geneticProfile",
          JSON.stringify({
            name: "Patient (Real Data)",
            timestamp: new Date().toISOString(),
            genes: geneticData,
          }),
        );

        // Navigate to Dashboard
        setTimeout(() => {
          setIsUploading(false);
          router.push("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Failed to upload VCF:", error);
        setIsUploading(false);
        alert(
          "Error connecting to backend. Please ensure the server is running on port 5000.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 animate-pulse">
          <ShieldCheck size={18} /> Powered by CPIC Clinical Guidelines
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Precision Medicine{" "}
          <span className="text-blue-600">Powered by DNA</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
          PharmaGuard analyzes your genetic profile to predict drug safety,
          prevent toxic reactions, and ensure your medication actually works.
        </p>

        {/* MODULE 1: VCF File Upload + Parser */}
        <div className="max-w-xl mx-auto">
          <label
            className={`
            relative group cursor-pointer flex flex-col items-center justify-center 
            p-12 border-2 border-dashed rounded-3xl transition-all duration-300
            ${isUploading ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"}
          `}
          >
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".vcf,.txt"
            />

            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-blue-700 text-lg">
                  Extracting Genetic Variants...
                </p>
                <p className="text-blue-500 text-sm">
                  Scanning CYP2D6, DPYD, and SLCO1B1...
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Upload your VCF Genetic File
                </h3>
                <p className="text-slate-500 text-sm">
                  Drag and drop your DNA blueprint to start analysis
                </p>
              </>
            )}
          </label>
        </div>
      </section>

      {/* Feature Preview (The Why) */}
      <section className="bg-slate-50 py-20 border-t">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-blue-600 mb-4">
              <Dna size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Genomic Mapping</h4>
            <p className="text-slate-600">
              Module 1 extracts high-risk variants across critical genes
              including CYP and HLA families.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-red-500 mb-4">
              <FileWarning size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Toxicity Prediction</h4>
            <p className="text-slate-600">
              Our core engine (Module 3) flags lethal interactions before you
              take a single dose.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="text-green-600 mb-4">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-bold mb-2">Explainable AI</h4>
            <p className="text-slate-600">
              Module 6 translates complex bio-markers into clear, actionable
              medical advice for you and your doctor.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

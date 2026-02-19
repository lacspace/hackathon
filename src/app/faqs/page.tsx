"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Beaker,
  FileText,
  Dna,
  ShieldCheck,
  BrainCircuit,
  Terminal,
  FlaskConical,
  HelpCircle,
  Search,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";
import { TopHeader } from "../../components/header";
import { Sidebar } from "../../components/sidebar";
import { faqs } from "./data";
import { useAuth } from "../../components/auth-provider";

export default function FAQsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "General",
    "Genetics",
    "Clinical",
    "Security",
    "Technical",
    "AI",
    "Roadmap",
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === "All" || faq.category === selectedCategory) &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-indigo-100 transition-colors duration-500">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto w-full">
        <TopHeader title="Platform Support" />
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                Verified Knowledge Base
              </span>
            </div>
            <h2 className="text-6xl font-black text-foreground tracking-tighter leading-none italic uppercase">
              Clinical <br />{" "}
              <span className="text-zinc-400 not-italic">Registry</span>
            </h2>
            <p className="text-muted-foreground text-xl mt-1 font-medium leading-relaxed max-w-lg">
              Explore our clinical protocols or use the
              <span className="text-indigo-500 font-extrabold ml-1">
                AI Assistant
              </span>{" "}
              below for specialized queries.
            </p>
          </div>
        </header>

        {/* Global Search & Category Tabs */}
        <div className="mb-16 space-y-8 max-w-5xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-indigo-500 transition-colors">
              <Search size={32} />
            </div>
            <input
              type="text"
              placeholder="Search across 100+ clinical protocols..."
              className="w-full p-10 pl-20 rounded-[3rem] bg-muted/20 border border-foreground/5 shadow-2xl shadow-foreground/5 focus:border-indigo-500/30 focus:ring-8 focus:ring-indigo-500/5 outline-none transition-all text-2xl font-black placeholder:text-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all border ${
                  selectedCategory === cat
                    ? "bg-foreground text-background border-foreground shadow-xl scale-105"
                    : "bg-muted/10 text-muted-foreground border-foreground/5 hover:bg-muted/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="max-w-5xl space-y-4 pb-40">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.3em]">
              Showing {filteredFaqs.length} Findings
            </h3>
            <div className="h-px flex-1 bg-foreground/5 mx-6"></div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-24 rounded-[3rem] border border-dashed border-foreground/5 bg-muted/5">
              <HelpCircle
                className="mx-auto mb-4 text-muted-foreground/20"
                size={64}
              />
              <p className="text-muted-foreground font-black uppercase tracking-widest">
                No matching protocols found
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-indigo-500 font-bold text-xs underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="group box-premium rounded-[2.5rem] transition-all duration-500 hover:translate-x-2"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-6 mb-4">
                      <h4 className="text-xl font-black text-foreground tracking-tight leading-tight">
                        {faq.question}
                      </h4>
                      <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex-shrink-0">
                        {faq.category}
                      </span>
                    </div>
                    <div className="text-muted-foreground font-medium leading-relaxed max-w-3xl">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

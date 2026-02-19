"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  Loader2,
  ChevronRight,
  Maximize2,
  MinusCircle,
  Volume2,
  BrainCircuit,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { API_BASE_URL } from "../lib/constants";

interface Message {
  id: string;
  type: "user" | "ai";
  text: string;
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      text: "Hello, I am the PharmaGuard Clinical Assistant. I am connected to the Gemini 2.0 evidence cluster. How can I assist with your patient analysis today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Audio system - using a higher quality professional notification sound
  const playChime = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3",
    );
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  const quickQuestions = [
    "Verify CYP2D6 Guidelines",
    "Security & Privacy Protocol",
    "Evidence Level 1A Explained",
    "System Roadmap",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text:
          data.answer ||
          "I apologize, I'm experiencing a connectivity issue with the evidence engine.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      playChime(); // Professional ring on every response
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          text: "System Error: Unable to reach clinical AI cluster. Please verify backend state.",
          timestamp: new Date(),
        },
      ]);
      playChime();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Surprise: Floating Medical Particle Effect near the toggle */}
      {!isOpen && (
        <div className="fixed bottom-12 right-12 w-24 h-24 pointer-events-none z-[99]">
          <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-medical-pulse"></div>
          <div className="absolute inset-4 bg-sky-500/10 rounded-full animate-medical-pulse [animation-delay:1s]"></div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] hover:scale-110 active:scale-95 transition-all z-[100] group ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
      >
        <Sparkles
          size={28}
          className="text-indigo-400 group-hover:rotate-12 transition-transform"
        />
      </button>

      {/* Large AI Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-8 right-8 w-[500px] h-[750px] max-w-[calc(100vw-64px)] max-h-[calc(100vh-64px)] bg-card border border-foreground/10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] flex flex-col z-[100] overflow-hidden animate-in zoom-in-95 fade-in slide-in-from-bottom-20 duration-500 ease-out ${isMinimized ? "h-20" : ""}`}
        >
          {/* Animated Background layer (Gemini Style) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(79,70,229,1)_0%,transparent_70%)] animate-float-gentle"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(14,165,233,1)_0%,transparent_70%)] animate-float-gentle [animation-delay:3s]"></div>
          </div>

          {/* Header */}
          <div className="relative p-8 bg-card border-b border-foreground/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-indigo-500/20 shadow-lg relative z-10">
                  <BrainCircuit size={24} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-indigo-500 rounded-2xl animate-ping opacity-20 z-0"></div>
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tighter leading-none mb-1 uppercase italic">
                  PharmaGuard <span className="text-indigo-500">AI</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500/30 rounded-full"></span>
                  </span>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    Neural Evidence Node
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-3 hover:bg-foreground/5 rounded-2xl transition-colors text-muted-foreground"
              >
                <MinusCircle size={20} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-rose-500/5 text-rose-500 rounded-2xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/5 relative"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                  >
                    <div
                      className={`relative max-w-[90%] p-5 rounded-[2rem] text-sm font-semibold leading-relaxed ${
                        msg.type === "user"
                          ? "bg-foreground text-background rounded-tr-none shadow-xl"
                          : "bg-card border border-foreground/5 text-foreground rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground/30 mt-2 uppercase tracking-widest px-2">
                      {msg.type === "user" ? "Physician Query" : "AI Synthesis"}{" "}
                      •{" "}
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3 animate-pulse">
                    <div className="bg-card border border-foreground/5 p-6 rounded-[2rem] rounded-tl-none shadow-sm">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions - Only show if conversation hasn't moved past the welcome message */}
              {messages.length === 1 && (
                <div className="px-8 py-4 flex gap-3 overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="flex-shrink-0 px-5 py-2.5 bg-card hover:bg-foreground hover:text-background text-foreground font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-foreground/10 shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-8 bg-card relative">
                <div className="relative group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                    placeholder="Describe clinical symptoms or query biomarkers..."
                    className="w-full bg-muted/20 border border-foreground/5 rounded-[1.5rem] py-5 pl-8 pr-16 text-sm font-bold placeholder:text-muted-foreground/30 outline-none focus:bg-muted/30 transition-all focus:border-indigo-500/30 text-foreground"
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-3 top-3 bottom-3 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-30 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-between opacity-30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      End-to-End Encrypted
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Gemini 2.0 Integrated
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

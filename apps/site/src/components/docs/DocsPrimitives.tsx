"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Sparkles, ShieldAlert, Cpu } from "lucide-react";

// --- 1. Code Block with Copy Capability ---
export function CodeBlock({ content, language }: { content: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded overflow-hidden border border-white/5 bg-brand-surface-dark/40 shadow-inner group my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-brand-surface-dark border-b border-white/5">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="text-white/40 hover:text-white transition-colors duration-200"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs text-white/80 leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}

// --- 2. Interactive Terminal Console simulation ---
export function CommandBlock({ title, content, expectedOutput }: { title?: string; content: string; expectedOutput?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded overflow-hidden border border-white/10 bg-[#0A0D12] shadow-2xl my-6">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0F141C] border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-brand-ember" />
          <span className="font-mono text-[10px] tracking-wider text-white/60 font-semibold">{title || "Terminal Console"}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[9px] font-mono text-white/40 hover:text-brand-ember transition-colors duration-200"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col gap-3 font-mono text-xs leading-relaxed select-all">
        <div className="flex items-center gap-2 text-white/95">
          <span className="text-brand-ember select-none font-bold">$</span>
          <span>{content}</span>
        </div>
        {expectedOutput && (
          <div className="text-white/40 border-t border-white/5 pt-2.5 mt-1 whitespace-pre-wrap select-none font-light">
            {expectedOutput}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 3. Architecture Callout Panel ---
export function ArchitectureCallout({ title, content, accent = "ember" }: { title: string; content: string; accent?: "ember" | "graphite" }) {
  return (
    <div
      className={`border-l-3 p-5 my-6 rounded-r bg-brand-surface-dark/30 flex gap-4 ${
        accent === "ember" ? "border-brand-ember" : "border-white/20"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        <Cpu className={`w-5 h-5 ${accent === "ember" ? "text-brand-ember" : "text-white/40"}`} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-sans font-bold text-sm text-white">{title}</span>
        <span className="text-xs text-white/60 leading-relaxed font-sans">{content}</span>
      </div>
    </div>
  );
}

// --- 4. System Warning / Critical constraint Panel ---
export function WarningPanel({ title, content, accent = "critical" }: { title: string; content: string; accent?: "critical" | "graphite" }) {
  return (
    <div
      className={`border-l-3 p-5 my-6 rounded-r bg-red-500/5 flex gap-4 ${
        accent === "critical" ? "border-red-500/60" : "border-white/20"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        <ShieldAlert className={`w-5 h-5 ${accent === "critical" ? "text-red-500" : "text-white/40"}`} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-sans font-bold text-sm text-white">{title}</span>
        <span className="text-xs text-white/60 leading-relaxed font-sans">{content}</span>
      </div>
    </div>
  );
}

// --- 5. Structured YAML Schema Card Grid ---
export function SchemaCard({ title, fields }: { title: string; fields?: { name: string; type: string; required: boolean; desc: string }[] }) {
  return (
    <div className="rounded border border-white/5 bg-brand-surface-dark/20 p-5 my-6">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4">
        <Sparkles className="w-4 h-4 text-brand-ember" />
        <span className="font-sans font-bold text-sm text-white">{title}</span>
      </div>
      {fields && (
        <div className="flex flex-col gap-3">
          {fields.map((f, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
              <div className="font-mono font-bold text-brand-ember select-all">{f.name}</div>
              <div className="font-mono text-white/40 uppercase">{f.type}</div>
              <div className="font-sans text-white/50">{f.required ? "Required" : "Optional"}</div>
              <div className="sm:col-span-1 text-white/70 font-sans leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

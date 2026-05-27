"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function CommandCTA() {
  const [copied, setCopied] = useState(false);
  const command = "npx @architecture-as-memory/aam init";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore errors
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-lg glass-surface p-1 border border-white/10 shadow-2xl relative group overflow-hidden">
      {/* Glow focus animation background */}
      <div className="absolute inset-0 bg-brand-ember/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center gap-3 px-4 py-3 bg-brand-surface-dark/40 rounded-md border border-white/5 relative z-10">
        <Terminal className="w-4 h-4 text-brand-ember shrink-0 animate-pulse" />
        
        <span className="font-mono text-xs sm:text-sm text-white/95 tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none flex-grow">
          <span className="text-white/40 select-none mr-2">$</span>
          {command}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors duration-200 shrink-0"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Decorative architectural layout detail line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-brand-ember/50 shadow-[0_0_8px_rgba(255,138,61,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 glass-surface border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Branding Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/AAMLogo.png"
            alt="Architecture-As-Memory Logo"
            className="w-20 h-20 shrink-0 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <span className="font-sans font-bold text-base tracking-wide text-white group-hover:text-brand-ember transition-colors duration-200">
            ARCHITECTURE-AS-MEMORY
          </span>
        </Link>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link href="/docs" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans">
            Documentation
          </Link>
          
          {/* Features Dropdown Menu */}
          <div className="relative group py-5 cursor-pointer">
            <span className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans flex items-center gap-1">
              Features
            </span>
            <div className="absolute top-[48px] left-1/2 -translate-x-1/2 hidden group-hover:block w-72 glass-surface border border-white/10 rounded-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-ember font-bold block mb-2">[ Product Capabilities ]</span>
              <div className="flex flex-col gap-2 text-left">
                <Link href="/docs/cognitive-drift" className="flex flex-col p-1.5 rounded hover:bg-white/5 transition-colors duration-150">
                  <span className="text-xs text-white font-semibold font-sans">Cognitive Drift Engine</span>
                  <span className="text-[9px] text-white/40 font-sans">Anchors code generation under mutations</span>
                </Link>
                <Link href="/docs/viewer" className="flex flex-col p-1.5 rounded hover:bg-white/5 transition-colors duration-150">
                  <span className="text-xs text-white font-semibold font-sans">Interactive Live Graph</span>
                  <span className="text-[9px] text-white/40 font-sans">Visual state preservation & telemetry</span>
                </Link>
                <Link href="/docs/governance" className="flex flex-col p-1.5 rounded hover:bg-white/5 transition-colors duration-150">
                  <span className="text-xs text-white font-semibold font-sans">YAML Governance</span>
                  <span className="text-[9px] text-white/40 font-sans">Immutable capability node bounds</span>
                </Link>
                <Link href="/docs/cli" className="flex flex-col p-1.5 rounded hover:bg-white/5 transition-colors duration-150">
                  <span className="text-xs text-white font-semibold font-sans">Doctor & Validation Engine</span>
                  <span className="text-[9px] text-white/40 font-sans">Self-diagnoses missing dependencies</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Ecosystem Dropdown Menu */}
          <div className="relative group py-5 cursor-pointer">
            <span className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans flex items-center gap-1">
              Ecosystems
            </span>
            <div className="absolute top-[48px] left-1/2 -translate-x-1/2 hidden group-hover:block w-72 glass-surface border border-white/10 rounded-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-ember font-bold block mb-2">[ Platform Compatibility ]</span>
              <div className="flex flex-col gap-2 text-left">
                <Link href="/docs/ai-integrations" className="flex flex-col p-1.5 rounded hover:bg-white/5 transition-colors duration-150">
                  <span className="text-xs text-white font-semibold font-sans">AI Assistants</span>
                  <span className="text-[9px] text-white/40 font-sans">Claude Code, Cursor, Gemini, Codex</span>
                </Link>
                <Link href="/docs/installation" className="flex flex-col p-1.5 rounded hover:bg-white/5 transition-colors duration-150">
                  <span className="text-xs text-white font-semibold font-sans">Distribution Wrappers</span>
                  <span className="text-[9px] text-white/40 font-sans">npm, PyPI, Crates.io, Docker</span>
                </Link>
              </div>
            </div>
          </div>

          <Link href="https://github.com/Phoenixarjun/architecture-as-memory" target="_blank" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans">
            Repository
          </Link>
        </nav>

        {/* Version Status Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-surface-dark border border-white/5 font-mono text-[10px] text-brand-ember uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ember animate-ping shrink-0" />
            <span>v1.0.1</span>
          </div>
        </div>
      </div>
    </header>
  );
}

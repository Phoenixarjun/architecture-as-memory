"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [mobileEcosystemsOpen, setMobileEcosystemsOpen] = useState(false);

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
          <span className="font-sans font-bold text-sm sm:text-base tracking-wide text-white group-hover:text-brand-ember transition-colors duration-200">
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

        {/* Version Status Badge & Mobile Hamburger Menu Trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-surface-dark border border-white/5 font-mono text-[10px] text-brand-ember uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ember animate-ping shrink-0" />
            <span>v1.0.4</span>
          </div>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded bg-brand-surface-dark border border-white/5 text-white/80 hover:text-white transition-all duration-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[64px] bg-brand-bg/98 backdrop-blur-lg border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-40 max-h-[calc(100vh-64px)] overflow-y-auto px-6 py-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4">
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-sans font-bold text-white/80 hover:text-white py-2 border-b border-white/5"
            >
              Documentation
            </Link>

            {/* Mobile Features Section */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
                className="flex items-center justify-between text-sm font-sans font-bold text-white/80 hover:text-white py-2 border-b border-white/5"
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileFeaturesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileFeaturesOpen && (
                <div className="flex flex-col gap-3 pl-4 pt-3 pb-2 text-left bg-brand-surface-dark/40 rounded mt-1 border border-white/5">
                  <Link
                    href="/docs/cognitive-drift"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col"
                  >
                    <span className="text-xs text-white font-semibold font-sans">Cognitive Drift Engine</span>
                    <span className="text-[9px] text-white/40 font-sans">Anchors code generation under mutations</span>
                  </Link>
                  <Link
                    href="/docs/viewer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col"
                  >
                    <span className="text-xs text-white font-semibold font-sans">Interactive Live Graph</span>
                    <span className="text-[9px] text-white/40 font-sans">Visual state preservation & telemetry</span>
                  </Link>
                  <Link
                    href="/docs/governance"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col"
                  >
                    <span className="text-xs text-white font-semibold font-sans">YAML Governance</span>
                    <span className="text-[9px] text-white/40 font-sans">Immutable capability node bounds</span>
                  </Link>
                  <Link
                    href="/docs/cli"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col"
                  >
                    <span className="text-xs text-white font-semibold font-sans">Doctor & Validation Engine</span>
                    <span className="text-[9px] text-white/40 font-sans">Self-diagnoses missing dependencies</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Ecosystems Section */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileEcosystemsOpen(!mobileEcosystemsOpen)}
                className="flex items-center justify-between text-sm font-sans font-bold text-white/80 hover:text-white py-2 border-b border-white/5"
              >
                <span>Ecosystems</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileEcosystemsOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileEcosystemsOpen && (
                <div className="flex flex-col gap-3 pl-4 pt-3 pb-2 text-left bg-brand-surface-dark/40 rounded mt-1 border border-white/5">
                  <Link
                    href="/docs/ai-integrations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col"
                  >
                    <span className="text-xs text-white font-semibold font-sans">AI Assistants</span>
                    <span className="text-[9px] text-white/40 font-sans">Claude Code, Cursor, Gemini, Codex</span>
                  </Link>
                  <Link
                    href="/docs/installation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col"
                  >
                    <span className="text-xs text-white font-semibold font-sans">Distribution Wrappers</span>
                    <span className="text-[9px] text-white/40 font-sans">npm, PyPI, Crates.io, Docker</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="https://github.com/Phoenixarjun/architecture-as-memory"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-sans font-bold text-white/80 hover:text-white py-2 border-b border-white/5"
            >
              Repository
            </Link>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded bg-brand-surface-dark border border-white/5 font-mono text-xs text-brand-ember uppercase self-start">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ember animate-ping shrink-0" />
            <span>v1.0.4 Latest</span>
          </div>
        </div>
      )}
    </header>
  );
}

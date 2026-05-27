"use client";

import React from "react";
import Link from "next/link";
import { HardHat } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 left-0 w-full z-50 glass-surface border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Branding Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-brand-ember/10 border border-brand-ember/30 flex items-center justify-center group-hover:border-brand-ember/60 transition-colors duration-300">
            <div className="w-2.5 h-2.5 bg-brand-ember rounded-sm group-hover:scale-110 transition-transform duration-300 shadow-[0_0_8px_rgba(255,138,61,0.6)]" />
          </div>
          <span className="font-sans font-bold text-base tracking-wide text-white group-hover:text-brand-ember transition-colors duration-200">
            ARCHITECTURE-AS-MEMORY
          </span>
        </Link>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans">
            Features
          </Link>
          <Link href="#ecosystems" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans">
            Ecosystems
          </Link>
          <Link href="https://github.com/Phoenixarjun/architecture-as-memory" target="_blank" className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-sans">
            Repository
          </Link>
        </nav>

        {/* Version Status Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-surface-dark border border-white/5 font-mono text-[10px] text-brand-ember uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ember animate-ping shrink-0" />
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}

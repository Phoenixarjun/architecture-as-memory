"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-bg border-t border-white/5 py-12 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <img
              src="/AAMLogo.png"
              alt="Architecture-As-Memory Logo"
              className="w-20 h-20 shrink-0 object-contain"
            />
            <span className="font-sans font-bold text-sm tracking-wide text-white">
              AAM COGNITION
            </span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed font-sans">
            A single, immutable architectural cognition runtime distributed through ecosystem-native wrappers to prevent memory drift under continuous AI mutations.
          </p>
        </div>

        {/* Ecosystem distribution wrappers links */}
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Wrappers</span>
            <div className="flex gap-4 text-xs font-sans">
              <Link href="https://www.npmjs.com/package/@architecture-as-memory/aam" target="_blank" className="text-white/50 hover:text-white transition-colors duration-200">
                npm
              </Link>
              <Link href="https://pypi.org/project/architecture-as-memory" target="_blank" className="text-white/50 hover:text-white transition-colors duration-200">
                PyPI
              </Link>
              <Link href="https://crates.io/crates/aam-cli" target="_blank" className="text-white/50 hover:text-white transition-colors duration-200">
                Crates.io
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Community</span>
            <div className="flex gap-4 text-xs font-sans">
              <Link href="https://github.com/Phoenixarjun/architecture-as-memory" target="_blank" className="text-white/50 hover:text-white transition-colors duration-200">
                GitHub
              </Link>
              <Link href="https://github.com/Phoenixarjun/architecture-as-memory/blob/main/LICENSE" target="_blank" className="text-white/50 hover:text-white transition-colors duration-200">
                License
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-8 pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] font-mono text-white/30">
          Released under the MIT License.
        </span>
        <span className="text-[10px] font-mono text-brand-ember/60">
          ARCHITECTURE INTENT PRESERVING MECHANISM
        </span>
      </div>
    </footer>
  );
}

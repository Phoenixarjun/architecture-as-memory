"use client";

import React, { useState, useEffect } from "react";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  // Close mobile sidebar on navigation transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Reading progress indicator hook (Throttled with requestAnimationFrame for 60fps performance)
  useEffect(() => {
    let frameId: number;
    const handleScroll = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(() => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScroll > 0) {
          setScrollProgress((window.scrollY / totalScroll) * 100);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-brand-bg relative flex flex-col pt-4">
      {/* 1. Linear Reading Progress Indicator Bar */}
      <div 
        className="fixed top-[64px] left-0 h-[2px] bg-brand-ember z-50 transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Mobile Top Navigation Subheader */}
      <div className="md:hidden sticky top-[64px] left-0 w-full z-40 bg-brand-bg/95 border-b border-white/5 backdrop-blur px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-mono tracking-wider text-white/60 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>DOCS MENU</span>
        </button>
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand-ember bg-brand-surface-dark px-2 py-0.5 rounded border border-white/5">
          v1.0.4
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 py-8 relative">
        {/* 2. Desktop Left Sidebar Navigation */}
        <div className="hidden md:block col-span-1 border-r border-white/5 h-[calc(100vh-140px)] sticky top-[100px] overflow-y-auto pr-2 scrollbar-none">
          <DocsSidebar />
        </div>

        {/* 3. Mobile Navigation Overlay Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[110px] bg-brand-bg/98 z-50 p-6 overflow-y-auto">
            <DocsSidebar onLinkClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* 4. Center Primary Documentation Pane */}
        <main className="col-span-1 md:col-span-3 lg:col-span-3 flex flex-col w-full min-w-0">
          <div className="w-full flex-1">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

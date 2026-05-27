import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit' 
});

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter' 
});

export default function Home() {
  return (
    <div className={`${outfit.variable} ${inter.variable} min-h-screen bg-[#0F1115] text-[#F5F7FA] font-sans selection:bg-[#FF8A3D] selection:text-white`}>
      {/* 1. Header Navigation */}
      <header className="border-b border-[#2A313D] bg-[#0F1115]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8A3D] to-[#D96B2B] flex items-center justify-center shadow-[0_0_15px_rgba(255,138,61,0.25)]">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight">Architecture As Memory</span>
              <span className="text-[10px] text-[#7C8796] block -mt-1 font-mono uppercase tracking-widest">AAM layer</span>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a href="https://github.com/Phoenixarjun/architecture-as-memory" target="_blank" rel="noreferrer" className="text-sm text-[#B8C0CC] hover:text-[#FF8A3D] transition-colors">
              GitHub
            </a>
            <a href="#install" className="px-4 py-2 rounded-lg bg-[#171A21] border border-[#2A313D] text-sm text-[#F5F7FA] hover:border-[#FF8A3D] transition-all duration-300">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A21] border border-[#2A313D] text-xs text-[#FFB067]">
            <span className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-pulse"></span>
            <span>Version 1.0.0 released</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight bg-gradient-to-r from-white via-[#F5F7FA] to-[#FFB067] bg-clip-text text-transparent">
            Persistent Architecture Cognition for AI-Native Coding
          </h1>
          <p className="text-lg text-[#B8C0CC] leading-relaxed max-w-xl">
            A persistent operational memory layer designed to prevent developers from losing architectural orientation as AI coding agents mutate systems at machine speed.
          </p>
          
          {/* CLI Install Copy Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
            <div id="install" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#171A21] border border-[#2A313D] font-mono text-sm w-full sm:w-auto">
              <span className="text-[#FF8A3D]">$</span>
              <span>npx architecture-as-memory init</span>
            </div>
            <a href="#terminal" className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF8A3D] to-[#D96B2B] font-bold text-sm text-white text-center shadow-[0_4px_20px_rgba(255,138,61,0.2)] hover:shadow-[0_4px_25px_rgba(255,138,61,0.35)] transition-all duration-300 transform hover:-translate-y-0.5">
              Watch Simulator
            </a>
          </div>
        </div>

        {/* Simulated CLI Terminal Panel */}
        <div id="terminal" className="flex-1 w-full max-w-lg">
          <div className="rounded-xl overflow-hidden border border-[#2A313D] bg-[#171A21] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0F1115] px-4 py-3 border-b border-[#2A313D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56]"></span>
                <span className="w-3 h-3 rounded-full bg-[#F4B740]"></span>
                <span className="w-3 h-3 rounded-full bg-[#D98C3F]"></span>
              </div>
              <span className="text-xs text-[#7C8796] font-mono">AAM terminal emulator</span>
            </div>
            <div className="p-5 font-mono text-xs text-[#B8C0CC] space-y-4 leading-relaxed overflow-x-auto min-h-[300px]">
              <div>
                <span className="text-[#FF8A3D]">$</span> npx architecture-as-memory init
              </div>
              <div className="text-[#7C8796] pl-4">
                Scanning for active instruction manifests...
              </div>
              <div className="text-emerald-500 pl-4 font-semibold">
                ✓ Appended bootstrap hooks to CLAUDE.md
              </div>
              <div className="text-emerald-500 pl-4 font-semibold">
                ✓ Appended bootstrap hooks to .cursorrules
              </div>
              <div className="text-emerald-500 pl-4 font-semibold">
                ✓ Created /architecture folder structures
              </div>
              <div className="text-emerald-500 pl-4 font-semibold">
                ✓ Copied core YAML templates & AI_INSTRUCTIONS.md
              </div>
              <div className="text-[#FFB067] font-bold">
                🎉 Architecture-As-Memory successfully initialized!
              </div>
              
              <div className="pt-4">
                <span className="text-[#FF8A3D]">$</span> npx architecture-as-memory dev
              </div>
              <div className="text-cyan-400 pl-4">
                Starting Chokidar file watcher...
              </div>
              <div className="text-emerald-500 pl-4 font-bold">
                🚀 Watcher running at http://localhost:4200
              </div>
              <div className="text-[#7C8796] pl-4">
                Watching /architecture YAML nodes... Live reload active.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Philosophy Split Grid */}
      <section className="bg-[#171A21] border-y border-[#2A313D] py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs text-[#FF8A3D] font-mono uppercase tracking-wider font-semibold">The Philosophical Pivot</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F5F7FA]">
              Architecture is not Code Structure
            </h2>
            <p className="text-[#B8C0CC] leading-relaxed">
              Traditional visualization tools fail because they scan file systems, import paths, and AST trees. This produces massive, unreadable spaghetti graphs.
            </p>
            <p className="text-[#B8C0CC] leading-relaxed">
              <strong>AAM models architectural cognition instead.</strong> Humans think in major operational boundaries (Domains) and business capabilities (Features). AAM maps these high-level relationships, providing immediate clarity when entering a new codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-[#0F1115] border border-[#2A313D] space-y-3">
              <span className="text-[#FF8A3D] font-bold text-lg">01</span>
              <h3 className="font-display font-semibold text-[#F5F7FA]">Cognition-First</h3>
              <p className="text-xs text-[#7C8796] leading-relaxed">Models business logic and operational capabilities rather than raw AST trees.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#0F1115] border border-[#2A313D] space-y-3">
              <span className="text-[#FF8A3D] font-bold text-lg">02</span>
              <h3 className="font-display font-semibold text-[#F5F7FA]">Progressive Hydration</h3>
              <p className="text-xs text-[#7C8796] leading-relaxed">Maintains cognitive stability by expanding nodes dynamically on click.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#0F1115] border border-[#2A313D] space-y-3">
              <span className="text-[#FF8A3D] font-bold text-lg">03</span>
              <h3 className="font-display font-semibold text-[#F5F7FA]">Multi-Dimensional</h3>
              <p className="text-xs text-[#7C8796] leading-relaxed">Visualizes risk, maturity, reliability, observability, and churn matrices.</p>
            </div>
            <div className="p-6 rounded-lg bg-[#0F1115] border border-[#2A313D] space-y-3">
              <span className="text-[#FF8A3D] font-bold text-lg">04</span>
              <h3 className="font-display font-semibold text-[#F5F7FA]">AI Maintainer</h3>
              <p className="text-xs text-[#7C8796] leading-relaxed">Maintained automatically by your AI coding assistants via patch mutations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs text-[#FF8A3D] font-mono uppercase tracking-wider font-semibold">Engineered Capabilities</span>
          <h2 className="font-display font-bold text-3xl text-[#F5F7FA]">Built for Scale & Rapid Orientation</h2>
          <p className="text-[#B8C0CC] text-sm leading-relaxed">Everything you need to maintain spatial alignment inside an expanding AI codebase.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="p-8 rounded-xl bg-[#171A21] border border-[#2A313D] hover:border-[#FF8A3D] transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#1E232D] flex items-center justify-center text-[#FF8A3D]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3 className="font-display font-semibold text-lg text-[#F5F7FA]">Bounded Topology Map</h3>
            <p className="text-sm text-[#B8C0CC] leading-relaxed">
              Visualizes relationships contextually. It draws live dependency lines only when parent branches are expanded, preventing information overload.
            </p>
          </div>

          {/* Item 2 */}
          <div className="p-8 rounded-xl bg-[#171A21] border border-[#2A313D] hover:border-[#FF8A3D] transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#1E232D] flex items-center justify-center text-[#FF8A3D]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 className="font-display font-semibold text-lg text-[#F5F7FA]">Command Palette Quick Focus</h3>
            <p className="text-sm text-[#B8C0CC] leading-relaxed">
              Press Ctrl+K from anywhere to look up capabilities, owners, or microservices instantly. Selecting a result automatically centers the graph.
            </p>
          </div>

          {/* Item 3 */}
          <div className="p-8 rounded-xl bg-[#171A21] border border-[#2A313D] hover:border-[#FF8A3D] transition-all duration-300 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#1E232D] flex items-center justify-center text-[#FF8A3D]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 className="font-display font-semibold text-lg text-[#F5F7FA]">Offline-First Syncing</h3>
            <p className="text-sm text-[#B8C0CC] leading-relaxed">
              AAM reads and parses standard local YAML files. No external databases, SaaS trackers, or web integrations required. Fully functional in flight mode.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-[#2A313D] bg-[#0F1115] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-[#7C8796]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-[#FF8A3D] flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-white rotate-45"></div>
            </div>
            <span>Architecture As Memory © 2026. MIT Licensed.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Phoenixarjun/architecture-as-memory" target="_blank" rel="noreferrer" className="hover:text-[#FF8A3D] transition-colors">
              GitHub repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

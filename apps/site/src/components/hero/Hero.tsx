"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { CommandCTA } from "@/components/ui/CommandCTA";
import { fadeIn, staggerContainer } from "@/lib/motion/presets";
import { Play } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
      
      {/* 1. Subtle Animated Telemetry Indicators (Background floating text) */}
      <div className="absolute top-12 left-8 hidden xl:flex flex-col gap-1 font-mono text-[10px] text-white/20 select-none pointer-events-none">
        <span>[ SYSTEM TELEMETRY ]</span>
        <span>DRIFT COEFFICIENT // 0.00%</span>
        <span>BOUNDS VERIFIED // YES</span>
      </div>
      <div className="absolute bottom-12 right-8 hidden xl:flex flex-col gap-1 font-mono text-[10px] text-white/20 select-none pointer-events-none text-right">
        <span>[ HYDRA ENGINE // HYDRATED ]</span>
        <span>TARGET CONTEXT // LOCAL WORKSPACE</span>
        <span>PORT ENGINE // HTTP://LOCALHOST:4200</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center text-center gap-8">
        
        {/* Cinematic Heading Block */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Main Hook Headline */}
          <Heading
            level={1}
            prefix="[ ARCHITECTURAL COGNITIVE ANCHOR ]"
            gradientText="AAM gives YOU memory."
            className="justify-center tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold max-w-4xl"
          >
            LLM Wiki gives your AI agent memory.
          </Heading>

          {/* Core Subheadline */}
          <motion.p
            variants={fadeIn("up", 0.1)}
            className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed max-w-3xl font-sans"
          >
            AI agents mutate code at machine speed. Without persistent memory boundaries, systems slip into **cognitive drift**—leaving engineers strangers in their own codebases. AAM anchors your mental models in real-time.
          </motion.p>
        </motion.div>

        {/* Command Line & CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-xl flex flex-col gap-6 items-center"
        >
          {/* Copyable CLI Command CTA */}
          <CommandCTA />

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#showcase"
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-brand-ember hover:bg-brand-ember-light text-brand-bg font-sans font-bold text-xs uppercase tracking-wider transition-colors duration-200 shadow-[0_4px_15px_rgba(255,138,61,0.25)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              See Architecture Showcase
            </a>
            
            <a
              href="https://github.com/Phoenixarjun/architecture-as-memory"
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-brand-surface-dark border border-white/5 hover:border-brand-ember/30 text-white/80 hover:text-white font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              GitHub Repository
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

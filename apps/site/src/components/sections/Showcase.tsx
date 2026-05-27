"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { fadeIn } from "@/lib/motion/presets";
import { Sparkles, Eye, ShieldCheck } from "lucide-react";

export function Showcase() {
  return (
    <Section id="showcase" className="border-t border-white/5 py-24 relative overflow-hidden">
      
      {/* Background Ember Blur spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-ember/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="flex flex-col gap-12">
        
        {/* Title Heading */}
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <Heading level={2} prefix="[ 02 // ARCHITECTURE SHOWCASE // OPERATIONAL VIEW ]" className="justify-center">
            Interactive Cognitive Topology Canvas
          </Heading>
          <p className="text-sm text-white/50 leading-relaxed font-sans">
            This is the real-time operational interface of AAM. An intelligent, human-scale ReactFlow diagram displaying microservices, features, and risk overlays contextually.
          </p>
        </div>

        {/* Cinematic Screenshot Wrap */}
        <motion.div
          variants={fadeIn("up")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="relative max-w-5xl mx-auto rounded-xl overflow-hidden glass-surface border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.7)] group"
        >
          {/* Header Panel Bar inside showcase */}
          <div className="bg-brand-surface-dark/95 border-b border-white/5 px-6 py-3 flex items-center justify-between z-20 relative">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping shrink-0" />
              <span className="font-mono text-[10px] tracking-wider text-green-400 uppercase font-semibold">LIVE RECONNECTING WATCHER // http://localhost:4200</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
              <span>NODES: 36</span>
              <span>CHANNELS: STABLE</span>
            </div>
          </div>

          {/* Screenshot image */}
          <div className="relative aspect-[16/10] overflow-hidden w-full bg-brand-bg">
            <Image
              src="/graph_screenshot.png"
              alt="Architecture-As-Memory interactive ReactFlow topological graph"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
            {/* Absolute visual overlay glassmorphism cards on graph */}
            <div className="absolute bottom-6 left-6 max-w-xs glass-surface p-4 border border-white/10 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="flex items-center gap-2 text-brand-ember font-bold text-xs font-sans pb-1.5 border-b border-white/5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PROGRESSIVE HYDRATION</span>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed font-sans mt-1.5">
                Layout connectors render only when parent domain modules are clicked, avoidingAST graph spaghetti.
              </p>
            </div>
          </div>

          {/* Telemetry frame details */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-bg via-transparent to-transparent h-16 pointer-events-none" />
        </motion.div>

        {/* Showcase Bottom Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-6 w-full">
          <div className="flex gap-3 items-start p-4 rounded bg-brand-surface-dark/20 border border-white/5">
            <Eye className="w-4 h-4 text-brand-ember shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-sans font-bold text-xs text-white">Contextual Isolation</span>
              <span className="text-[10px] text-white/40 leading-relaxed font-sans">Focus only on your current operational feature branch without seeing neighboring complexity.</span>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 rounded bg-brand-surface-dark/20 border border-white/5">
            <ShieldCheck className="w-4 h-4 text-brand-ember shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-sans font-bold text-xs text-white">YAML Stability Scan</span>
              <span className="text-[10px] text-white/40 leading-relaxed font-sans">A single unescaped unquoted colon or malformed node will be isolated and handled without crashing.</span>
            </div>
          </div>
          <div className="flex gap-3 items-start p-4 rounded bg-brand-surface-dark/20 border border-white/5">
            <Sparkles className="w-4 h-4 text-brand-ember shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-sans font-bold text-xs text-white">Intelligent Doctor Heuristics</span>
              <span className="text-[10px] text-white/40 leading-relaxed font-sans">Self-diagnosing validation checks pinpoint cognitive leaks, missing scopes, and broken link shapes.</span>
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
}

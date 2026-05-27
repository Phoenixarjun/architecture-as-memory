"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { GlowCard } from "@/components/ui/GlowCard";
import { CommandCTA } from "@/components/ui/CommandCTA";
import { fadeIn, staggerContainer } from "@/lib/motion/presets";
import { Terminal, Cpu, ShieldAlert, CpuIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full relative py-12 sm:py-20 flex flex-col gap-16 sm:gap-24 overflow-hidden">
      
      {/* 1. HERO ARCHITECTURAL HEADLINE SECTION */}
      <Section className="pt-8 sm:pt-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6"
        >
          {/* Version / Status Tag */}
          <motion.div
            variants={fadeIn("up")}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface-dark/60 border border-white/5 text-xs text-brand-ember-light uppercase font-mono tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-ember animate-pulse shrink-0" />
            <span>State: HARDENED ONTOLOGY READY</span>
          </motion.div>

          {/* Primary Landing Heading */}
          <Heading
            level={1}
            prefix="[ SYSTEM COGNITION LAYER ]"
            gradientText="Persistent Architecture Memory"
            className="justify-center text-center font-extrabold tracking-tight"
          >
            AI-Native Software Deserves
          </Heading>

          {/* Description */}
          <motion.p
            variants={fadeIn("up")}
            className="text-base sm:text-lg text-white/60 leading-relaxed max-w-2xl font-sans"
          >
            A lightweight, local architectural memory layer that protects systems against spatial orientation loss and cognitive drift as autonomous coding agents mutate codebases at machine speed.
          </motion.p>

          {/* Core Interactive Command CTA Prompt */}
          <motion.div variants={fadeIn("up")} className="w-full pt-4">
            <CommandCTA />
          </motion.div>
        </motion.div>
      </Section>

      {/* 2. THE THREE COGNITIVE WRAPPER ECOSYSTEMS */}
      <Section id="ecosystems" className="border-t border-white/5 py-12 bg-brand-surface-dark/10">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center flex flex-col gap-2">
            <Heading level={2} prefix="[ 01 // CROSS-ECOSYSTEM DISTRIBUTION ]" className="justify-center">
              Single Core Runtime.
            </Heading>
            <p className="text-sm text-white/40 leading-relaxed font-sans">
              Distributed natively through thin client launchers. Zero duplicate ontology logic, zero validator fragmentation, absolute architectural consistency.
            </p>
          </div>

          {/* Cards Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Python Card */}
            <GlowCard className="space-y-4">
              <div className="w-9 h-9 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white">Python (PyPI) Wrapper</h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                A thin, non-intrusive executable launcher wrapper. Safely parses OS paths, runs standard local verification, and propagates exit codes cleanly in <code className="font-mono text-[10px] text-brand-ember bg-white/5 px-1 py-0.5 rounded">venv</code>.
              </p>
              <div className="pt-2 font-mono text-[10px] text-white/40">
                $ pip install architecture-as-memory
              </div>
            </GlowCard>

            {/* PowerShell Card */}
            <GlowCard className="space-y-4">
              <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white">PowerShell Gallery</h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Native cmdlet mappings conforming strictly to PowerShell standards. Integrates perfectly inside Windows shells and CI environments with zero setup.
              </p>
              <div className="pt-2 font-mono text-[10px] text-white/40">
                &gt; Install-Module -Name AAM
              </div>
            </GlowCard>

            {/* Rust Card */}
            <GlowCard className="space-y-4">
              <div className="w-9 h-9 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <CpuIcon className="w-4 h-4" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white">Rust Wrapper Crate</h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                An ultra-lightweight, zero-dependency compiled binary launcher wrapping cargo scripts. Protects system memory and executes directly from the console.
              </p>
              <div className="pt-2 font-mono text-[10px] text-white/40">
                $ cargo install aam-cli
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </Section>

      {/* 3. CORE PRINCIPLE METRICS INFO */}
      <Section id="features" className="border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <Heading level={2} prefix="[ 02 // INTENT PRESERVATION ]">
              Preventing Cognitive Drift.
            </Heading>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              Traditional modeling tools parse raw directories producing unreadable spaghetti AST trees. 
              <strong> AAM maps developer cognition directly.</strong>
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-sans">
              By structuring system bounds into Domains, Features, and Components, AAM ensures both human engineers and AI coding models share a single, living, synchronized architectural contract.
            </p>
          </div>

          <div className="p-6 rounded-lg glass-surface border border-white/5 space-y-4 font-mono text-xs text-white/70">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-brand-ember font-bold">
              <span>🩺 COGNITION TELEMETRY</span>
              <span className="text-[10px] bg-brand-ember/10 border border-brand-ember/20 px-2 py-0.5 rounded text-brand-ember-light">STABLE</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/40">ONTOLOGY CONSISTENCY:</span>
                <span className="text-green-400">100% SECURE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">SCHEMA DEVIATION:</span>
                <span className="text-green-400">0.00% DRIFT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">HYDRA Telemetry parse:</span>
                <span className="text-brand-ember-light">36ms (Fast)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Validation Hook status:</span>
                <span className="text-green-400">POST-COMMIT ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

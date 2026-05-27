"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { GlowCard } from "@/components/ui/GlowCard";
import { fadeIn, staggerContainer } from "@/lib/motion/presets";
import { PlayCircle, Shield, HeartPulse, RefreshCw } from "lucide-react";

interface WorkflowStep {
  cmd: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  output: string[];
}

export function CliWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: WorkflowStep[] = [
    {
      cmd: "aam init",
      name: "1. Initialization",
      desc: "Scaffolds local architecture directory, config schemas, and agent commits.",
      icon: <PlayCircle className="w-4 h-4" />,
      output: [
        "$ aam init",
        "✓ Appended bootstrap hooks to CLAUDE.md",
        "✓ Appended bootstrap hooks to .cursorrules",
        "✓ Created local /architecture directory templates",
        "🎉 AAM successfully initialized inside your local workspace."
      ]
    },
    {
      cmd: "aam dev",
      name: "2. Live Watcher",
      desc: "Launches the high-performance Chokidar file watcher and local Express visualizer.",
      icon: <RefreshCw className="w-4 h-4" />,
      output: [
        "$ aam dev",
        "📡 Starting AAM file watcher...",
        "✓ Watching /architecture for YAML mutations...",
        "🚀 Visualizer server actively running at http://localhost:4200",
        "Live reload channel established."
      ]
    },
    {
      cmd: "aam validate",
      name: "3. Schema Verification",
      desc: "Validates all domains and feature boundaries against strict JSON contracts.",
      icon: <Shield className="w-4 h-4" />,
      output: [
        "$ aam validate",
        "🔍 Scanning 5 domains, 12 features, and 24 components...",
        "✓ All FNV-1a identifiers validated successfully.",
        "✓ No cyclic dependencies or broken channels detected.",
        "🎉 SCHEMA INTEGRITY SECURE."
      ]
    },
    {
      cmd: "aam doctor",
      name: "4. System Diagnostics",
      desc: "Checks overall cognitive health, missing description tags, and model drifts.",
      icon: <HeartPulse className="w-4 h-4" />,
      output: [
        "$ aam doctor",
        "🩺 Diagnosing cognitive architecture health...",
        "✓ Zero critical structural errors found.",
        "✓ 100% of capabilities documented with required summary fields.",
        "✨ System cognitive score: 10/10."
      ]
    }
  ];

  return (
    <Section id="workflow" className="border-t border-white/5 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Command Selectors */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Heading level={2} prefix="[ 04 // THE CLI LIFE CYCLE ]">
            Engineered CLI Lifecycle
          </Heading>
          <p className="text-sm text-white/50 leading-relaxed font-sans">
            Maintain your mental boundaries throughout the software lifecycle. Select a step to view output telemetry.
          </p>

          <div className="flex flex-col gap-3">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded border text-left transition-all duration-300 font-sans ${
                  activeStep === idx
                    ? "bg-brand-ember/10 border-brand-ember text-white"
                    : "bg-transparent border-white/5 text-white/55 hover:bg-white/[0.02]"
                }`}
              >
                <div className={`${activeStep === idx ? "text-brand-ember" : "text-white/40"}`}>
                  {step.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold">{step.name}</span>
                  <span className="font-mono text-[9px] opacity-60">{step.cmd}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Terminal Emulator */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-white/10 bg-brand-surface-dark shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Header Panel */}
            <div className="bg-brand-bg px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="text-[10px] text-white/30 font-mono">telemetry console</span>
            </div>

            {/* Output lines */}
            <div className="p-6 font-mono text-[11px] text-white/75 min-h-[220px] flex flex-col gap-2.5 bg-brand-surface-dark/40 overflow-x-auto">
              {steps[activeStep].output.map((line, lIdx) => (
                <div
                  key={lIdx}
                  className={`${
                    line.startsWith("✓") || line.startsWith("🎉") || line.startsWith("✨")
                      ? "text-green-400 font-semibold"
                      : line.startsWith("$")
                      ? "text-brand-ember font-bold"
                      : "text-white/60"
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Section>
  );
}

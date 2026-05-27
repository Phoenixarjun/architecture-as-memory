"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { GlowCard } from "@/components/ui/GlowCard";
import { fadeIn, staggerContainer } from "@/lib/motion/presets";
import { AlertOctagon, HeartHandshake, EyeOff, Lightbulb } from "lucide-react";

export function CognitiveDrift() {
  return (
    <Section id="drift" className="border-t border-white/5 bg-brand-surface-dark/5">
      <div className="flex flex-col gap-16">
        
        {/* Header Title */}
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <Heading level={2} prefix="[ 01 // THE PROBLEM // COGNITIVE DRIFT ]" className="justify-center">
            The Speed of AI Code Mutation Outpaces Human Comprehension
          </Heading>
          <p className="text-sm sm:text-base text-white/50 leading-relaxed font-sans">
            AI coding agents can generate 10,000 lines of highly complex, structural modifications in minutes. But who maintains the mental map of where the boundaries lie?
          </p>
        </div>

        {/* Side-by-Side Storytelling Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Card A: The Old Chaos */}
          <GlowCard className="space-y-6 border-red-500/10 hover:border-red-500/20" glowColor="rgba(239, 68, 68, 0.04)">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">Traditional Mental Decay</h3>
                <span className="font-mono text-[9px] text-red-400 uppercase tracking-widest">spaghetti ast orientation</span>
              </div>
            </div>

            <ul className="space-y-4 text-xs font-sans text-white/60">
              <li className="flex gap-2.5 items-start">
                <EyeOff className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>**AST Overwhelm**: Visualizers scan every import statement, rendering unreadable spaghetti lines of 2,000 code nodes.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <EyeOff className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>**Immediate Obsolescence**: Written Markdown documentations fall out-of-sync the minute your AI agent executes a single patch command.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <EyeOff className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>**Lost Rationale**: The team spends hours inside terminal logs or Git diff histories asking *“Why did the agent architecture build this?”*</span>
              </li>
            </ul>
          </GlowCard>

          {/* Card B: The AAM Anchoring */}
          <GlowCard className="space-y-6 border-brand-ember/15" glowColor="rgba(255, 138, 61, 0.08)">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">Persistent Cognitive Anchor</h3>
                <span className="font-mono text-[9px] text-brand-ember uppercase tracking-widest">architecture-as-memory active</span>
              </div>
            </div>

            <ul className="space-y-4 text-xs font-sans text-white/60">
              <li className="flex gap-2.5 items-start">
                <Lightbulb className="w-4 h-4 text-brand-ember shrink-0 mt-0.5" />
                <span>**Capability-First Domain Mapping**: High-level boundaries are modeled contextually, drawing connections only when branches expand.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Lightbulb className="w-4 h-4 text-brand-ember shrink-0 mt-0.5" />
                <span>**Enforced Local Sync**: Simple, immutable YAML files serve as the active schema contract, validated after every single task.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <Lightbulb className="w-4 h-4 text-brand-ember shrink-0 mt-0.5" />
                <span>**Calm Spatial Orientation**: Maintain a perfect spatial roadmap of microservices and dependencies without cognitive fatigue.</span>
              </li>
            </ul>
          </GlowCard>
        </motion.div>

      </div>
    </Section>
  );
}

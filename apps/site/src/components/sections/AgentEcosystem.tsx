"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { GlowCard } from "@/components/ui/GlowCard";
import { fadeIn, staggerContainer } from "@/lib/motion/presets";
import { Bot, Terminal, Files, GitCommit } from "lucide-react";

export function AgentEcosystem() {
  return (
    <Section id="agents" className="border-t border-white/5 bg-brand-surface-dark/5 py-24">
      <div className="flex flex-col gap-16">
        
        {/* Title Header */}
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <Heading level={2} prefix="[ 05 // AI AGENT ORCHESTRATION ]" className="justify-center">
            Securing AI Coding Agents via Governance Mappings
          </Heading>
          <p className="text-sm text-white/50 leading-relaxed font-sans">
            AAM embeds architecture guidelines directly into your agent instructions. Your agents read the rules offline and validate their mutations automatically.
          </p>
        </div>

        {/* Mappings Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Item 1 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Claude Code</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Appends global structural system rules directly into <code className="font-mono text-[10px] text-brand-ember bg-white/5 px-1 rounded">CLAUDE.md</code>, ensuring strict post-task verification loops.
            </p>
          </GlowCard>

          {/* Item 2 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Cursor Rules</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Injects domain schemas directly into Cursor rules configuration file, guiding context selection and minimizing broken relationship changes.
            </p>
          </GlowCard>

          {/* Item 3 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <Files className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Gemini CLI Rules</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Configures system prompts and instructions on active workspace paths to maintain cognitive architecture bounds during chat iterations.
            </p>
          </GlowCard>

          {/* Item 4 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <GitCommit className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Git Hooks Protection</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Protects git main branch pushes from architectural drifts by running validation tests in post-commit triggers.
            </p>
          </GlowCard>
        </motion.div>

      </div>
    </Section>
  );
}

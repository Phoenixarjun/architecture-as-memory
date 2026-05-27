"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { GlowCard } from "@/components/ui/GlowCard";
import { fadeIn, staggerContainer } from "@/lib/motion/presets";
import { Box, Layers, HelpCircle, ShieldCheck } from "lucide-react";

export function Philosophy() {
  return (
    <Section id="philosophy" className="border-t border-white/5 bg-brand-surface-dark/10">
      <div className="flex flex-col gap-16">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <Heading level={2} prefix="[ 03 // THE COGNITION PHILOSOPHY ]" className="justify-center">
            Cognition-First: Architecture is Not Code Structure
          </Heading>
          <p className="text-sm text-white/50 leading-relaxed font-sans">
            Static structure tools display how directories are nested. AAM models how developers think, reason, and split system responsibilities.
          </p>
        </div>

        {/* Philosophy Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <Box className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Features Over Files</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Humans reason in terms of business capabilities (e.g. user authentication, invoice processing) rather than nested index files or import statements.
            </p>
          </GlowCard>

          {/* Card 2 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Cognition Over AST</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Raw AST scans generate spaghetti charts that overwhelm you. AAM keeps your graph clean and readable by grouping files inside functional components.
            </p>
          </GlowCard>

          {/* Card 3 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">YAML Stability</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Simple, local, human-readable YAML configurations serve as the sole source of architectural contracts. 100% resilient and offline-first.
            </p>
          </GlowCard>

          {/* Card 4 */}
          <GlowCard className="space-y-4">
            <div className="w-8 h-8 rounded bg-brand-ember/10 flex items-center justify-center text-brand-ember">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="font-sans font-bold text-sm text-white">Progressive Reveal</h3>
            <p className="text-[11px] text-white/50 leading-relaxed font-sans">
              Maintain calm and clarity. Expand system modules and details contextually as you navigate rather than seeing the entire complexity at once.
            </p>
          </GlowCard>
        </motion.div>

      </div>
    </Section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { CommandCTA } from "@/components/ui/CommandCTA";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function FinalCTA() {
  return (
    <Section className="border-t border-white/5 py-24 relative overflow-hidden bg-brand-surface-dark/10">
      
      {/* Background soft highlight */}
      <div className="absolute inset-0 bg-brand-ember/[0.02] pointer-events-none blur-2xl -z-10" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
        
        {/* Title */}
        <div className="flex flex-col gap-3 items-center">
          <Heading level={2} prefix="[ 06 // CLOSING SIGNAL ]" className="justify-center text-center">
            Anchor Your System Cognition Today
          </Heading>
          <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-xl font-sans">
            Protect your mental models and maintain complete architectural clarity throughout your codebase iterations.
          </p>
        </div>

        {/* Copy command CTAs */}
        <div className="w-full max-w-lg flex flex-col gap-6 items-center">
          <CommandCTA />
          
          <a
            href="https://github.com/Phoenixarjun/architecture-as-memory"
            target="_blank"
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-brand-surface-dark border border-white/5 hover:border-brand-ember/30 text-white/80 hover:text-white font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            Join the open repository
          </a>
        </div>

      </div>
    </Section>
  );
}

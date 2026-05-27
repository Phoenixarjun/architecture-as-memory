"use client";

import React from "react";
import { Hero } from "@/components/hero/Hero";
import { CognitiveDrift } from "@/components/sections/CognitiveDrift";
import { Showcase } from "@/components/sections/Showcase";
import { Philosophy } from "@/components/sections/Philosophy";
import { CliWorkflow } from "@/components/sections/CliWorkflow";
import { AgentEcosystem } from "@/components/sections/AgentEcosystem";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Cinematic Hero Intro */}
      <Hero />

      {/* 2. Side-by-side Cognitive Drift problems */}
      <CognitiveDrift />

      {/* 3. The Visual Interactive Graph Showcase */}
      <Showcase />

      {/* 4. The Cognition Philosophy cards */}
      <Philosophy />

      {/* 5. The CLI Lifecycle Terminal console */}
      <CliWorkflow />

      {/* 6. AI Agent Integration mappings */}
      <AgentEcosystem />

      {/* 7. Retrained final closing CTA */}
      <FinalCTA />
    </div>
  );
}

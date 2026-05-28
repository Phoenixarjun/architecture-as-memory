"use client";

import React from "react";

export function AmbientBackground() {
  return (
    <div className="absolute inset-0 -z-50 overflow-hidden bg-brand-bg select-none pointer-events-none">
      {/* 1. Subtle dotted grid layer */}
      <div className="absolute inset-0 dotted-grid opacity-70" />

      {/* 2. Larger architectural precision line grid */}
      <div className="absolute inset-0 precision-grid opacity-40" />

      {/* 3. Drifting Cinematic Ember Radial Glow - Ring A (GPU Accelerated) */}
      <div
        className="absolute top-1/4 left-1/4 w-[700px] h-[700px] radial-glow-ember blur-[120px] opacity-60 transform-gpu animate-drift-a"
      />

      {/* 4. Drifting Ember Radial Glow - Ring B (Offset, GPU Accelerated) */}
      <div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] radial-glow-ember blur-[100px] opacity-40 transform-gpu animate-drift-b"
      />

      {/* 5. Central focus highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-brand-ember/5 blur-[160px] rounded-full transform-gpu" />

      {/* 6. Cinematic SVG noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { scaleIn } from "@/lib/motion/presets";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  animate?: boolean;
}

export function GlowCard({
  children,
  className,
  glowColor = "rgba(255, 138, 61, 0.08)",
  animate = true,
  ...props
}: GlowCardProps) {
  const content = (
    <div
      className={cn(
        "relative rounded-lg glass-surface glass-surface-hover p-6 transition-all duration-300 group overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Subtle top horizontal highlight boundary */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-right from-transparent via-white/10 to-transparent opacity-80" />

      {/* Decorative corner architectural precision line markers */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 pointer-events-none group-hover:border-brand-ember/50 transition-colors duration-300" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-hover:border-brand-ember/50 transition-colors duration-300" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 pointer-events-none group-hover:border-brand-ember/50 transition-colors duration-300" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 pointer-events-none group-hover:border-brand-ember/50 transition-colors duration-300" />

      {/* Hover radial glowing backdrop spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-[40px] -z-10"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

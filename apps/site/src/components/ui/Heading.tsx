"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { blurReveal } from "@/lib/motion/presets";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  prefix?: string;
  gradientText?: string;
  animate?: boolean;
}

export function Heading({
  children,
  className,
  level = 2,
  prefix,
  gradientText,
  animate = true,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  const sizeClasses = {
    1: "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-sans leading-none",
    2: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-sans",
    3: "text-xl sm:text-2xl font-bold font-sans",
    4: "text-lg font-semibold font-sans",
  }[level];

  const content = (
    <div className="flex flex-col gap-2">
      {/* Blueprint Monospace Prefix */}
      {prefix && (
        <span className="font-mono text-xs font-semibold tracking-wider text-brand-ember uppercase opacity-80">
          {prefix}
        </span>
      )}
      
      <Tag
        className={cn(
          "text-white flex flex-wrap items-center gap-x-3 gap-y-1",
          sizeClasses,
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {gradientText && (
          <span className="bg-gradient-to-r from-brand-ember via-brand-ember-light to-brand-ember-dark bg-clip-text text-transparent">
            {gradientText}
          </span>
        )}
      </Tag>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        variants={blurReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

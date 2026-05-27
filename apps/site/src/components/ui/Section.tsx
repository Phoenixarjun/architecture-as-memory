"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  containerClassName?: string;
  hasBorder?: boolean;
}

export function Section({
  children,
  className,
  containerClassName,
  hasBorder = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "relative py-16 sm:py-24 overflow-hidden w-full",
        hasBorder && "border-b border-white/5",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

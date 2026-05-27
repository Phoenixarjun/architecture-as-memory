"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { allPages, DocPage } from "@/lib/docs/data";

interface PrevNextNavigationProps {
  currentPage: DocPage;
}

export function PrevNextNavigation({ currentPage }: PrevNextNavigationProps) {
  const currentIndex = allPages.findIndex((p) => p.slug === currentPage.slug);

  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-8 mt-12 w-full">
      {prevPage ? (
        <Link
          href={`/docs/${prevPage.slug}`}
          className="flex items-center gap-4 p-4 rounded border border-white/5 bg-brand-surface-dark/10 hover:bg-brand-surface-dark/30 hover:border-brand-ember/20 transition-all duration-300 text-left group"
        >
          <ArrowLeft className="w-4 h-4 text-white/40 group-hover:text-brand-ember transition-colors duration-200" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
              Previous Page
            </span>
            <span className="font-sans font-bold text-xs text-white group-hover:text-brand-ember transition-colors duration-200">
              {prevPage.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextPage ? (
        <Link
          href={`/docs/${nextPage.slug}`}
          className="flex items-center justify-between gap-4 p-4 rounded border border-white/5 bg-brand-surface-dark/10 hover:bg-brand-surface-dark/30 hover:border-brand-ember/20 transition-all duration-300 text-right group"
        >
          <div className="flex flex-col gap-1 ml-auto">
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
              Next Page
            </span>
            <span className="font-sans font-bold text-xs text-white group-hover:text-brand-ember transition-colors duration-200">
              {nextPage.title}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-brand-ember transition-colors duration-200" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

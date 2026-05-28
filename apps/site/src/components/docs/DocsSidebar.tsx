"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarNavigation } from "@/lib/docs/data";
import { DocsSearch } from "./DocsSearch";

interface DocsSidebarProps {
  onLinkClick?: () => void;
}

export function DocsSidebar({ onLinkClick }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full flex flex-col gap-8 pr-4">
      {/* 1. Fully-functional Command Palette Search */}
      <div className="relative w-full">
        <DocsSearch />
      </div>

      {/* 2. Structured Category Navigation List */}
      <nav className="flex flex-col gap-6">
        {sidebarNavigation.map((cat, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-wider text-white/30 uppercase font-semibold">
              {cat.title}
            </span>
            <ul className="flex flex-col gap-1.5 border-l border-white/5 ml-1 pl-3">
              {cat.links.map((link, lIdx) => {
                const href = `/docs/${link.slug}`;
                const isActive = pathname === href || (link.slug === "introduction" && pathname === "/docs");

                return (
                  <li key={lIdx}>
                    <Link
                      href={href}
                      onClick={onLinkClick}
                      className={`text-xs block py-1 transition-colors duration-200 font-sans ${
                        isActive
                          ? "text-brand-ember font-bold"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

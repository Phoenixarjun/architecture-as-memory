"use client";

import React, { useEffect, useState } from "react";
import { DocPage } from "@/lib/docs/data";

interface TableOfContentsProps {
  page: DocPage;
}

export function TableOfContents({ page }: TableOfContentsProps) {
  const h2Headers = page.blocks
    .filter((b) => b.type === "h2")
    .map((b) => b.content || "");

  const [activeHeader, setActiveHeader] = useState<string>("");

  useEffect(() => {
    if (h2Headers.length > 0) {
      setActiveHeader(h2Headers[0]);
    }
  }, [page]);

  if (h2Headers.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 font-sans">
      <span className="font-mono text-[9px] uppercase tracking-wider text-white/30 font-semibold">
        On This Page
      </span>
      <ul className="flex flex-col gap-2 border-l border-white/5 pl-3">
        {h2Headers.map((head, idx) => {
          const isActive = activeHeader === head;

          return (
            <li key={idx}>
              <button
                onClick={() => {
                  setActiveHeader(head);
                  // Scroll to heading smoothly
                  const elements = Array.from(document.querySelectorAll("h2"));
                  const match = elements.find((el) => el.textContent === head);
                  if (match) {
                    match.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className={`text-[11px] block text-left transition-colors duration-200 ${
                  isActive
                    ? "text-brand-ember font-semibold"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {head}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

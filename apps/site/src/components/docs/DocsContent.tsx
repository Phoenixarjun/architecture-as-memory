"use client";

import React from "react";
import { DocPage } from "@/lib/docs/data";
import {
  CodeBlock,
  CommandBlock,
  ArchitectureCallout,
  WarningPanel,
  SchemaCard
} from "./DocsPrimitives";

interface DocsContentProps {
  page: DocPage;
}

// Custom Markdown-like text formatter for bold and inline code elements
function formatInlineElements(text: string) {
  const segments = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return segments.map((segment, idx) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={idx} className="font-extrabold text-white">
          {segment.slice(2, -2)}
        </strong>
      );
    }
    if (segment.startsWith("`") && segment.endsWith("`")) {
      return (
        <code
          key={idx}
          className="font-mono text-brand-ember bg-brand-surface-dark border border-white/5 px-1.5 py-0.5 rounded text-[10.5px]"
        >
          {segment.slice(1, -1)}
        </code>
      );
    }
    return segment;
  });
}

export function DocsContent({ page }: DocsContentProps) {
  return (
    <article className="flex flex-col gap-6 text-white/70 font-sans leading-relaxed">
      {page.blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1
                key={idx}
                className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight border-b border-white/5 pb-3 mt-2"
              >
                {block.content}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={idx}
                className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight mt-8 mb-2"
              >
                {block.content}
              </h2>
            );
          case "p":
            return (
              <p key={idx} className="text-sm text-white/60 leading-relaxed font-sans my-1.5">
                {formatInlineElements(block.content || "")}
              </p>
            );
          case "code":
            return (
              <CodeBlock
                key={idx}
                content={block.content || ""}
                language={block.language}
              />
            );
          case "command":
            return (
              <CommandBlock
                key={idx}
                title={block.title}
                content={block.content || ""}
                expectedOutput={block.expectedOutput}
              />
            );
          case "callout":
            return (
              <ArchitectureCallout
                key={idx}
                title={block.title || "Note"}
                content={block.content || ""}
                accent={block.accent === "graphite" ? "graphite" : "ember"}
              />
            );
          case "warning":
            return (
              <WarningPanel
                key={idx}
                title={block.title || "Warning"}
                content={block.content || ""}
                accent={block.accent === "critical" ? "critical" : "graphite"}
              />
            );
          case "schema":
            return (
              <SchemaCard
                key={idx}
                title={block.title || "Schema Fields"}
                fields={block.fields}
              />
            );
          default:
            return null;
        }
      })}
    </article>
  );
}

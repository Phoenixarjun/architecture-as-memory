"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, Command, X } from "lucide-react";
import { allPages, sidebarNavigation } from "@/lib/docs/data";

interface SearchResult {
  title: string;
  slug: string;
  category: string;
  description: string;
  snippet?: string;
}

export function DocsSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Toggle Search Dialog with keyboard shortcuts: Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 2. Focus input automatically on mount
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 3. Search and snippet extraction indexing logic
  useEffect(() => {
    if (!query.trim()) {
      // Default initial states: show a subset of most popular getting started pages
      const defaultPages = allPages
        .slice(0, 5)
        .map((page) => {
          const cat = sidebarNavigation.find((c) => c.links.some((l) => l.slug === page.slug));
          return {
            title: page.title,
            slug: page.slug,
            category: cat?.title || "Guide",
            description: page.description,
          };
        });
      setResults(defaultPages);
      return;
    }

    const searchTerm = query.toLowerCase();
    const matches: SearchResult[] = [];

    allPages.forEach((page) => {
      const pageTitle = page.title.toLowerCase();
      const pageDesc = page.description.toLowerCase();
      const cat = sidebarNavigation.find((c) => c.links.some((l) => l.slug === page.slug));
      const categoryName = cat?.title || "Reference";

      let matched = false;
      let snippet = "";

      // Check title or description
      if (pageTitle.includes(searchTerm) || pageDesc.includes(searchTerm)) {
        matched = true;
      }

      // Check page blocks for deep snippet search
      if (page.blocks) {
        for (const block of page.blocks) {
          if (block.content && block.type === "p") {
            const blockContent = block.content.toLowerCase();
            const queryIdx = blockContent.indexOf(searchTerm);
            if (queryIdx !== -1) {
              matched = true;
              // Extract a clean 80-character snippet window surrounding the matched text
              const start = Math.max(0, queryIdx - 35);
              const end = Math.min(block.content.length, queryIdx + searchTerm.length + 45);
              snippet = `...${block.content.substring(start, end).trim()}...`;
              break;
            }
          }
        }
      }

      if (matched) {
        matches.push({
          title: page.title,
          slug: page.slug,
          category: categoryName,
          description: page.description,
          snippet: snippet || undefined,
        });
      }
    });

    setResults(matches);
    setSelectedIndex(0);
  }, [query]);

  // 4. Keyboard Navigation Controls inside dialog
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].slug);
      }
    }
  };

  // Scroll index active item into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const container = scrollContainerRef.current;
        const activeTop = activeEl.offsetTop;
        const activeHeight = activeEl.offsetHeight;
        const containerHeight = container.clientHeight;
        const containerScroll = container.scrollTop;

        if (activeTop < containerScroll) {
          container.scrollTop = activeTop;
        } else if (activeTop + activeHeight > containerScroll + containerHeight) {
          container.scrollTop = activeTop + activeHeight - containerHeight;
        }
      }
    }
  }, [selectedIndex]);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/docs/${slug}`);
  };

  return (
    <>
      {/* Sidebar search trigger input card */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-brand-surface-dark border border-white/5 hover:border-brand-ember/30 rounded px-3 py-1.5 flex items-center justify-between text-xs text-white/50 hover:text-white transition-all duration-200 font-sans cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      >
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-ember transition-colors duration-200" />
          <span>Search documentation...</span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-[9px] font-mono text-white/40">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </button>

      {/* Modern Backdrop and Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6 md:px-20 select-none pointer-events-auto">
          {/* Blur Background Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-brand-bg/85 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
          />

          {/* Search Box Panel */}
          <div
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-xl glass-surface border border-white/10 rounded-xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)] z-10 flex flex-col max-h-[500px] animate-in fade-in slide-in-from-top-6 duration-200"
          >
            {/* Header Input Area */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 relative bg-brand-surface-dark/40">
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation (keywords, commands, YAML keys)..."
                className="w-full bg-transparent text-sm text-white placeholder-white/35 focus:outline-none font-sans"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors duration-150 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Results List Section */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 max-h-[360px] scrollbar-thin scrollbar-thumb-brand-surface-medium"
            >
              {results.length > 0 ? (
                results.map((result, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <div
                      key={result.slug}
                      onClick={() => handleSelect(result.slug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex flex-col gap-1 px-4 py-3 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                        isActive
                          ? "bg-brand-ember/15 border-brand-ember/65 text-white shadow-[0_0_15px_rgba(255,138,61,0.08)]"
                          : "bg-transparent border-transparent text-white/70 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-sans font-bold text-xs ${isActive ? "text-brand-ember-light" : "text-white"}`}>
                          {result.title}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                          {result.category}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-white/45 leading-relaxed font-sans line-clamp-1">
                        {result.description}
                      </p>

                      {result.snippet && (
                        <div className={`text-[9px] font-mono p-1 rounded mt-1.5 border leading-relaxed break-all ${
                          isActive 
                            ? "bg-brand-bg/50 border-brand-ember/15 text-brand-ember-light/90" 
                            : "bg-brand-surface-dark/30 border-white/5 text-white/40"
                        }`}>
                          {result.snippet}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center flex flex-col gap-1.5 items-center justify-center">
                  <span className="text-sm font-sans font-semibold text-white/40">No matches found for "{query}"</span>
                  <span className="text-[10px] text-white/20 font-sans">Try searching for other commands like aam init, aam validate, or hooks</span>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Controls Guide */}
            <div className="bg-brand-bg px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] font-sans text-white/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/5 font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 font-mono flex items-center gap-0.5">
                    <CornerDownLeft className="w-2 h-2" /> Enter
                  </kbd> Select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/5 font-mono">Esc</kbd> Close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

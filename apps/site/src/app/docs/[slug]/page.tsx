import React from "react";
import { allPages, getPageBySlug } from "@/lib/docs/data";
import { DocsContent } from "@/components/docs/DocsContent";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { PrevNextNavigation } from "@/components/docs/PrevNextNavigation";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: `${page.title} - Architecture-As-Memory Docs`,
    description: page.description,
    openGraph: {
      title: `${page.title} - AAM Documentation`,
      description: page.description,
      type: "article",
    },
  };
}

export default async function DocSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Primary Content Column */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <DocsContent page={page} />
        <PrevNextNavigation currentPage={page} />
      </div>

      {/* Sticky Table of Contents Side Pane */}
      <div className="hidden lg:block lg:col-span-1 h-[calc(100vh-140px)] sticky top-[100px] overflow-y-auto pl-4 border-l border-white/5">
        <TableOfContents page={page} />
      </div>
    </div>
  );
}

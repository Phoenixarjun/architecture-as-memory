import React from "react";
import DocSlugPage from "./[slug]/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AAM Documentation - Overview & Introduction",
  description: "An offline, local-first cognition scaffolding system designed to capture, visualize, and sustain architectural boundaries in AI-native software repositories.",
};

export default async function DocsRootPage() {
  const paramsPromise = Promise.resolve({ slug: "introduction" });
  return <DocSlugPage params={paramsPromise} />;
}

"use client";

import { Suspense } from "react";

import SearchResponsive, { SearchPageFallback } from "@/components/responsive/Search";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchResponsive />
    </Suspense>
  );
}

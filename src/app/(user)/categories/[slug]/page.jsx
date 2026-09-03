"use client";

import { use } from "react";

import CategoryListingResponsive from "@/components/responsive/CategoryListing";

export default function CategoryListingPage({ params }) {
  const { slug } = use(params);
  return <CategoryListingResponsive slug={slug} />;
}

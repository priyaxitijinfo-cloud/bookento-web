"use client";

import { CategoryItem } from "@/components/home/category-item";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function CategoryTablet({ categories }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <div className="z-30 shrink-0 bg-white/95 backdrop-blur-md">
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Category"
        />
      </div>
      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "pt-2")}>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryItem key={category.slug} category={category} />
          ))}
        </div>
      </main>
      <HomeFooter className="mt-8 md:mt-10" />
    </div>
  );
}

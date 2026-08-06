"use client";

import { CategoryItem } from "@/components/home/category-item";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";

export function CategoryDesktop({ categories }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Category"
        />
      )}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} categories to explore
          </p>
        </div>
        <ResponsiveGrid mobile={3} tablet={4} desktop={5} gap="gap-4">
          {categories.map((category) => (
            <CategoryItem key={category.slug} category={category} />
          ))}
        </ResponsiveGrid>
      </div>
    </DesktopLayout>
  );
}

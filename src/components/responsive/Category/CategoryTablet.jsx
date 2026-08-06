"use client";

import { CategoryItem } from "@/components/home/category-item";
import { UserHeader } from "@/components/layout/user-nav";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function CategoryTablet({ categories }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <UserHeader title="Category" backHref={ROUTES.HOME} hideActions />
      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "pt-2")}>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <CategoryItem key={category.slug} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
}

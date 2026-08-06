"use client";

import { CategoryItem } from "@/components/home/category-item";
import { UserHeader } from "@/components/layout/user-nav";
import { UserBottomNav } from "@/components/layout/user-nav";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function CategoryMobile({ categories }) {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <UserHeader title="Category" backHref={ROUTES.HOME} hideActions />
      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb)}>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category) => (
            <div key={category.slug} className="aspect-square min-w-0">
              <CategoryItem category={category} fullPage />
            </div>
          ))}
        </div>
      </main>
      <UserBottomNav />
    </div>
  );
}

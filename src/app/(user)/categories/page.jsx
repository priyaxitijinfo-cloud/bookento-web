"use client";

import Link from "next/link";

import { CategoryItem } from "@/components/home/category-item";
import { MobileHeader } from "@/components/layout/mobile-header";
import { UserBottomNav } from "@/components/layout/user-nav";
import { HOME_CATEGORIES } from "@/constants/home-categories";
import { ROUTES } from "@/constants/routes.constants";
import { PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";

export default function CategoriesPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <MobileHeader title="Category" showBack backLabel="Go back" />

      <main className="mx-auto max-w-lg px-4 py-4 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] md:py-6 xl:px-[5.875rem]">
        <div className="grid grid-cols-3 gap-2.5 md:hidden">
          {HOME_CATEGORIES.map((category) => (
            <CategoryItem key={category.slug} category={category} fullPage />
          ))}
        </div>

        <div className="hidden md:block">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-xl font-bold">Category</h2>
            <Link
              href={ROUTES.HOME}
              className="text-primary text-sm font-medium hover:underline"
            >
              Back to Home
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 md:gap-4">
            {HOME_CATEGORIES.map((category) => (
              <CategoryItem key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </main>

      <UserBottomNav />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { CategoryItem } from "@/components/home/category-item";
import { UserBottomNav } from "@/components/layout/user-nav";
import { HOME_CATEGORIES } from "@/constants/home-categories";
import { ROUTES } from "@/constants/routes.constants";

function MobileCategoryHeader() {
  const router = useRouter();

  return (
    <header className="border-border bg-background safe-top sticky top-0 z-30 border-b md:hidden">
      <div className="mx-auto flex h-14 max-w-lg items-center gap-1 px-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-foreground hover:text-foreground/80 flex size-10 items-center justify-center rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="size-6" strokeWidth={2.25} />
        </button>
        <h1 className="text-foreground text-[1.0625rem] font-semibold">Category</h1>
      </div>
    </header>
  );
}

export default function CategoriesPage() {
  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <MobileCategoryHeader />

      <main className="mx-auto max-w-lg px-4 py-4 md:max-w-7xl md:px-4 md:py-6">
        <div className="grid grid-cols-3 gap-2.5 md:hidden">
          {HOME_CATEGORIES.map((category) => (
            <CategoryItem key={category.slug} category={category} fullPage />
          ))}
        </div>

        <div className="hidden md:block">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-foreground text-xl font-bold">Category</h2>
            <Link href={ROUTES.HOME} className="text-primary text-sm font-medium hover:underline">
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

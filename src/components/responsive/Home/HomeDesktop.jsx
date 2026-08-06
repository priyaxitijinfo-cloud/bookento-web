"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { BannerShowcase } from "@/components/home/banner-showcase";
import { CategoryGrid } from "@/components/home/category-grid";
import { PopularServicesShowcase } from "@/components/home/popular-services-showcase";
import { SectionHeader } from "@/components/home/section-header";
import { SpecialPackagesShowcase } from "@/components/home/special-packages-showcase";
import { TopRatedProviderCard } from "@/components/home/top-rated-provider-card";
import { UpcomingAppointmentCard } from "@/components/home/upcoming-appointment-card";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { SearchField } from "@/components/responsive/primitives/SearchField";
import { ROUTES } from "@/constants/routes.constants";

function DesktopHomeHeader() {
  return (
    <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center justify-between gap-6 px-6 lg:px-8">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dashboard</p>
        <h1 className="truncate text-xl font-semibold text-foreground">Discover services near you</h1>
      </div>
      <div className="flex max-w-xl flex-1 items-center gap-3">
        <Link href={ROUTES.SEARCH} className="block w-full">
          <SearchField readOnly placeholder="Search services, doctors, salons..." />
        </Link>
        <Link
          href={ROUTES.NOTIFICATIONS}
          className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </Link>
      </div>
    </div>
  );
}

export function HomeDesktop({ topRated }) {
  return (
    <DesktopLayout header={<DesktopHomeHeader />} maxWidth="wide">
      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="grid gap-4 lg:grid-cols-2">
            <ResponsiveCard className="overflow-hidden !p-0" hover>
              <div className="gradient-brand relative flex min-h-[180px] flex-col justify-between p-6 text-white">
                <div>
                  <span className="inline-flex rounded-full bg-background/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                    Quick book
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Book your next appointment in minutes
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-white/85">
                    Browse nearby professionals, compare packages, and confirm a slot instantly.
                  </p>
                </div>
                <Link
                  href={ROUTES.CATEGORIES}
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-background px-4 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-95"
                >
                  <Search className="size-4" />
                  Explore categories
                </Link>
              </div>
            </ResponsiveCard>
            <UpcomingAppointmentCard />
          </section>

          <section>
            <SectionHeader title="Category" />
            <CategoryGrid />
          </section>

          <section>
            <SectionHeader title="Offers & Promotions" />
            <BannerShowcase />
          </section>

          <section>
            <SectionHeader title="Top Rated Professionals" href={ROUTES.PROVIDERS} />
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {topRated.map((p) => (
                <TopRatedProviderCard key={p.id} provider={p} categorySlug={p.categorySlug} />
              ))}
            </div>
          </section>

          <PopularServicesShowcase />
          <SpecialPackagesShowcase />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <ResponsiveCard>
            <h3 className="text-base font-semibold text-foreground">Quick actions</h3>
            <div className="mt-4 grid gap-2">
              {[
                { href: ROUTES.APPOINTMENTS, label: "My bookings" },
                { href: ROUTES.WALLET, label: "My wallet" },
                { href: ROUTES.ADDRESSES, label: "Saved addresses" },
                { href: ROUTES.PROFILE, label: "Profile & settings" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-[#EAF3FF] hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </ResponsiveCard>

          <ResponsiveCard>
            <h3 className="text-base font-semibold text-foreground">Need help?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Chat with support or browse FAQs anytime from your profile.
            </p>
            <Link
              href={ROUTES.CHATS}
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Open chats
            </Link>
          </ResponsiveCard>
        </aside>
      </div>
    </DesktopLayout>
  );
}

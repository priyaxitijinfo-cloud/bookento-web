"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { TabPanelHeader } from "@/components/provider-booking/shared";
import { PACKAGE_THEMES } from "@/constants/doctor-booking.constants";
import { providerPackageRoute, appendCategoryFlowQuery } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

export function ProviderPackagesPanel({ providerId, provider, categorySlug, packages }) {
  const items = packages[0]?.features
    ? packages
    : packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        image: pkg.image,
        features: [`${pkg.serviceIds?.length || 3} included services`, "Priority booking", "Flexible validity"],
        originalPrice: pkg.originalPrice,
        price: pkg.price,
        discountPercent: pkg.discountPercent,
        theme: "blue",
      }));

  return (
    <div>
      <TabPanelHeader
        title="Available Packages"
        description="Choose a care plan tailored to your needs"
      />

      <div className="space-y-4">
        {items.map((pkg) => {
          const theme = PACKAGE_THEMES[pkg.theme] || PACKAGE_THEMES.blue;
          return (
            <article
              key={pkg.id}
              className={cn(
                "rounded-xl border p-4 transition-shadow hover:shadow-md md:p-5",
                theme.card,
              )}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
                <div className="flex items-center gap-4 lg:flex-1">
                  <div className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-background shadow-sm md:h-36 md:w-28">
                    <img src={pkg.image} alt={pkg.name} className="size-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold leading-snug text-foreground md:text-lg">
                      {pkg.name}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <span
                            className={cn(
                              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                              theme.checkBg,
                            )}
                          >
                            <Check className="size-2.5 text-white" strokeWidth={3} />
                          </span>
                          <span className="text-muted-foreground leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-white/70 pt-4 lg:w-[148px] lg:shrink-0 lg:flex-col lg:items-end lg:justify-between lg:border-0 lg:pt-0">
                  <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold", theme.badge)}>
                    Save {pkg.discountPercent}%
                  </span>

                  <div className="text-right lg:mt-auto">
                    <p className="text-muted-foreground text-xs line-through">
                      {formatCurrency(pkg.originalPrice)}
                    </p>
                    <p className={cn("text-xl font-bold leading-tight md:text-2xl", theme.price)}>
                      {formatCurrency(pkg.price)}
                    </p>
                  </div>

                  <Link
                    href={appendCategoryFlowQuery(providerPackageRoute(providerId, pkg.id), categorySlug, provider)}
                    className={cn(
                      "inline-flex h-10 min-w-[88px] items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors",
                      theme.button,
                    )}
                  >
                    Book
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

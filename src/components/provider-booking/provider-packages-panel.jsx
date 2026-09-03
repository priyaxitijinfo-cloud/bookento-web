"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { SectionHeading } from "@/components/provider-booking/shared";
import { PACKAGE_THEMES } from "@/constants/doctor-booking.constants";
import {
  providerPackageRoute,
  appendCategoryFlowQuery,
} from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";

const PACKAGE_CARD_THEMES = {
  rose: "border-[#FFEBF5] bg-gradient-to-r from-[#FFE2F3] to-[#FFF9FC]",
  blue: "border-[#E3EBFF] bg-gradient-to-r from-[#DDE7FE] to-[#F9FBFF]",
  amber: "border-[#FFEDDB] bg-gradient-to-r from-[#FFEFE2] to-[#FFFBF8]",
};

const PACKAGE_BUTTON_THEMES = {
  rose: "bg-gradient-to-r from-[#FD5189] to-[#CB4BF2] hover:opacity-90",
  blue: "bg-gradient-to-r from-[#80A3FF] to-[#0047FF] hover:opacity-90",
  amber: "bg-amber-500 hover:bg-amber-600",
};

const PACKAGE_ACCENT_THEMES = {
  rose: {
    badge: "bg-[#FEE7F1] text-[#FD4685]",
    checkBg: "bg-[#FD4685]",
    price: "text-[#FD4685]",
  },
  blue: {
    badge: "bg-[#E3EBFF] text-[#2D68FE]",
    checkBg: "bg-[#2D68FE]",
    price: "text-[#2D68FE]",
  },
  amber: {
    badge: "bg-[#FFEDDB] text-[#FE7F07]",
    checkBg: "bg-[#FE7F07]",
    price: "text-[#FE7F07]",
  },
};

function normalizePackages(packages) {
  if (packages[0]?.features) return packages;

  return packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    image: pkg.image,
    features: [
      `${pkg.serviceIds?.length || 3} included services`,
      "Priority booking",
      "Flexible validity",
    ],
    originalPrice: pkg.originalPrice,
    price: pkg.price,
    discountPercent: pkg.discountPercent,
    theme: "blue",
  }));
}

function PackagePricingColumn({
  pkg,
  theme,
  themeKey,
  providerId,
  provider,
  categorySlug,
  mobile = false,
}) {
  const packageButton = PACKAGE_BUTTON_THEMES[themeKey] || PACKAGE_BUTTON_THEMES.rose;
  const packageAccent = PACKAGE_ACCENT_THEMES[themeKey] || PACKAGE_ACCENT_THEMES.rose;

  return (
    <div
      className={cn(
        "flex flex-col",
        mobile
          ? "border-border/30 w-[5.75rem] shrink-0 items-center justify-between border-l pl-2.5"
          : "items-end gap-3 text-right",
      )}
    >
      <span
        className={cn(
          "rounded-md px-2 py-0.5 text-[10px] font-semibold md:text-xs",
          packageAccent.badge,
        )}
      >
        Save {pkg.discountPercent}%
      </span>

      <div
        className={cn(
          mobile ? "text-center" : "flex flex-col items-end gap-0.5 text-right",
        )}
      >
        <p className="text-muted-foreground text-[10px] line-through md:text-xs">
          {formatCurrency(pkg.originalPrice)}
        </p>
        <p
          className={cn(
            "text-base leading-tight font-bold md:text-2xl",
            packageAccent.price,
          )}
        >
          {formatCurrency(pkg.price)}
        </p>
      </div>

      <Link
        href={appendCategoryFlowQuery(
          providerPackageRoute(providerId, pkg.id),
          categorySlug,
          provider,
        )}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-xs font-semibold text-white transition-opacity md:text-sm",
          mobile ? "h-8 w-full" : "h-10 min-w-[88px] px-5",
          packageButton,
        )}
      >
        Book
      </Link>
    </div>
  );
}

function PackageFeatureList({ features, themeKey, compact = false }) {
  const packageAccent = PACKAGE_ACCENT_THEMES[themeKey] || PACKAGE_ACCENT_THEMES.rose;

  return (
    <ul className={cn(compact ? "mt-2 space-y-1" : "mt-3 space-y-2")}>
      {features.map((feature) => (
        <li
          key={feature}
          className={cn("flex items-start gap-2", compact ? "text-[11px]" : "text-sm")}
        >
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full",
              compact ? "mt-0.5 size-3.5" : "mt-0.5 size-4",
              packageAccent.checkBg,
            )}
          >
            <Check className="size-2 text-white" strokeWidth={5} />
          </span>
          <span
            className={cn(
              "leading-snug",
              compact ? "text-[#5B6B8C]" : "text-muted-foreground",
            )}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ProviderPackagesPanel({
  providerId,
  provider,
  categorySlug,
  packages,
}) {
  const items = normalizePackages(packages);

  return (
    <div>
      <div className="mb-4 md:hidden">
        <SectionHeading title="Available Packages" />
      </div>

      <div className="space-y-3 md:space-y-4">
        {items.map((pkg) => {
          const theme = PACKAGE_THEMES[pkg.theme] || PACKAGE_THEMES.blue;
          const packageCard =
            PACKAGE_CARD_THEMES[pkg.theme] || PACKAGE_CARD_THEMES.blue;

          return (
            <article
              key={pkg.id}
              className={cn(
                "rounded-2xl border p-3 transition-shadow hover:shadow-md md:rounded-xl md:p-5",
                packageCard,
              )}
            >
              <div className="flex gap-2.5 md:hidden">
                <div className="bg-background h-[7.25rem] w-[4.25rem] shrink-0 overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground text-sm leading-snug font-bold">
                      {pkg.name}
                    </h3>
                    <PackageFeatureList
                      features={pkg.features}
                      themeKey={pkg.theme}
                      compact
                    />
                  </div>

                  <PackagePricingColumn
                    pkg={pkg}
                    theme={theme}
                    themeKey={pkg.theme}
                    providerId={providerId}
                    provider={provider}
                    categorySlug={categorySlug}
                    mobile
                  />
                </div>
              </div>

              <div className="hidden flex-col gap-4 md:flex md:flex-row md:items-stretch md:gap-5">
                <div className="flex items-center gap-4 md:flex-1">
                  <div className="bg-background h-32 w-24 shrink-0 overflow-hidden rounded-xl shadow-sm md:h-36 md:w-28">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground text-base leading-snug font-semibold md:text-lg md:font-bold">
                      {pkg.name}
                    </h3>
                    <PackageFeatureList features={pkg.features} themeKey={pkg.theme} />
                  </div>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-white/70 pt-4 md:w-[148px] md:shrink-0 md:flex-col md:items-end md:justify-end md:border-0 md:pt-0">
                  <PackagePricingColumn
                    pkg={pkg}
                    theme={theme}
                    themeKey={pkg.theme}
                    providerId={providerId}
                    provider={provider}
                    categorySlug={categorySlug}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

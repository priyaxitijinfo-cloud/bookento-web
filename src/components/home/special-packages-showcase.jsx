"use client";

import Link from "next/link";

import { SectionHeader, DesktopSectionHeading } from "@/components/home/section-header";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { providerPackageRoute, ROUTES } from "@/constants/routes.constants";
import { getFeaturedPackages } from "@/mock/packages";
import { formatCurrency } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

const FEATURED_PACKAGES = getFeaturedPackages(3);

const PACKAGE_DISPLAY = [
  {
    name: "Salon Care Combo",
    servicesText: "Hair Spa + Facial + Manicure",
    price: 1499,
    originalPrice: 1875,
    discountLabel: "SAVE 20%",
    badgeClass: "bg-[#EF4444] text-white",
    subtitleClass: "text-muted-foreground",
    priceClass: "text-[#EF4444]",
    image: "/images/special-package-salon-combo.png",
    imageClass: "object-cover object-right",
    overlayClass: null,
  },
  {
    name: "Home Cleaning Packages",
    servicesText: "4 Visits / Month",
    price: 999,
    originalPrice: 1249,
    discountLabel: "SAVE 20%",
    badgeClass: "bg-[#2563EB] text-white",
    subtitleClass: "text-muted-foreground",
    priceClass: "text-[#2563EB]",
    image: "/images/special-package-home-cleaning.png",
    imageClass: "object-cover object-right",
    overlayClass: null,
  },
  {
    name: "Pet Care Package",
    servicesText: "Grooming + Bath + Nail Trim",
    price: 799,
    originalPrice: 999,
    discountLabel: "SAVE 20%",
    badgeClass: "bg-[#7C3AED] text-white",
    subtitleClass: "text-muted-foreground",
    priceClass: "text-[#7C3AED]",
    image: "/images/special-package-pet-care.png",
    imageClass: "object-cover object-right",
    overlayClass: null,
  },
];

const PACKAGES = PACKAGE_DISPLAY.map((display, index) => {
  const featured = FEATURED_PACKAGES[index];
  return {
    ...display,
    id: featured?.id ?? `special-${index}`,
    href: featured
      ? providerPackageRoute(featured.providerId, featured.id)
      : ROUTES.PROVIDERS,
  };
});

function SpecialPackageCard({ pkg }) {
  return (
    <Link
      href={pkg.href}
      className={cn(
        "group relative flex h-[10.5rem] overflow-hidden rounded-2xl p-4",
        "shadow-card hover:shadow-card-hover transition-shadow",
        "focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
    >
      <img
        src={pkg.image}
        alt={pkg.name}
        className={cn(
          "absolute inset-0 size-full transition-transform duration-500 ease-out group-hover:scale-[1.03]",
          pkg.imageClass,
        )}
        loading="lazy"
      />
      {pkg.overlayClass && (
        <div className={cn("absolute inset-0 bg-gradient-to-r", pkg.overlayClass)} />
      )}

      <div className="relative z-10 flex max-w-[68%] min-w-0 flex-1 flex-col">
        <span
          className={cn(
            "w-fit rounded-md px-2.5 py-1 text-[10px] font-bold",
            pkg.badgeClass,
          )}
        >
          {pkg.discountLabel}
        </span>
        <h3 className="text-foreground mt-2 line-clamp-1 text-base leading-tight font-bold">
          {pkg.name}
        </h3>
        <p
          className={cn(
            "mt-1 line-clamp-2 text-xs leading-relaxed font-medium",
            pkg.subtitleClass,
          )}
        >
          {pkg.servicesText}
        </p>
        <div className="mt-auto pt-3">
          <div className="bg-background inline-flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm">
            <span className={cn("text-sm font-bold", pkg.priceClass)}>
              {formatCurrency(pkg.price)}
            </span>
            <span className="text-muted-foreground text-xs line-through">
              {formatCurrency(pkg.originalPrice)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function SpecialPackagesShowcase({ className }) {
  return (
    <section className={className}>
      <SectionHeader title="Special Packages" className="md:hidden" />
      <DesktopSectionHeading
        badge="Packages"
        title="Special Packages"
        highlight="For You"
      />

      <MobileScrollRow className="md:hidden">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="w-[calc(100vw-4.25rem)] shrink-0 snap-start">
            <SpecialPackageCard pkg={pkg} />
          </div>
        ))}
      </MobileScrollRow>

      <div className="hidden gap-3 md:grid md:grid-cols-3 md:gap-4">
        {PACKAGES.map((pkg) => (
          <SpecialPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}

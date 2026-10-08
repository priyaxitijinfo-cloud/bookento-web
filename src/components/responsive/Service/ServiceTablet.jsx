"use client";

import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { ServiceCard } from "@/components/home/service-card";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function ServiceTablet({ services }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <div className="z-30 shrink-0 bg-white/95 backdrop-blur-md">
        <HomeHeader embedded />
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Popular Services"
        />
      </div>
      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "pt-2")}>
        <p className="text-muted-foreground mb-5 text-sm">
          {services.length} services available near you
        </p>
        <div className="grid grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <ServiceCard key={svc.id} service={svc} index={i % 4} />
          ))}
        </div>
      </main>
      <HomeFooter className="mt-8 md:mt-10" />
    </div>
  );
}

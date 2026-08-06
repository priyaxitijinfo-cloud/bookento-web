"use client";

import { ServiceCard } from "@/components/home/service-card";
import { UserHeader } from "@/components/layout/user-nav";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

export function ServiceTablet({ services }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "pb-8")}>
      <UserHeader title="Popular Services" backHref={ROUTES.HOME} hideActions />
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
    </div>
  );
}

"use client";

import { ServiceCard } from "@/components/home/service-card";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveGrid } from "@/components/responsive/layout/ResponsiveGrid";
import { ROUTES } from "@/constants/routes.constants";

export function ServiceDesktop({ services }) {
  return (
    <DesktopLayout
      maxWidth="wide"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Popular Services"
        />
      )}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Popular Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {services.length} services available near you
          </p>
        </div>
        <ResponsiveGrid mobile={2} tablet={3} desktop={4} gap="gap-4">
          {services.map((svc, i) => (
            <ServiceCard key={svc.id} service={svc} index={i % 4} />
          ))}
        </ResponsiveGrid>
      </div>
    </DesktopLayout>
  );
}

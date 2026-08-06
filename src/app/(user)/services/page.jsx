"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ServiceCard } from "@/components/home/service-card";
import { toServiceCardModel } from "@/constants/popular-services";
import { ROUTES } from "@/constants/routes.constants";
import { services } from "@/mock/services";

const SERVICE_LIST = services.filter((s) => s.isActive).map(toServiceCardModel);

export default function ServicesPage() {
  return (
    <UserPageShell
      title="Popular Services"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      containerVariant="browseWithBreadcrumb"
      mainClassName="md:pt-6"
    >
      <p className="text-muted-foreground mb-5 text-sm">
        {SERVICE_LIST.length} services available near you
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {SERVICE_LIST.map((svc, i) => (
          <ServiceCard key={svc.id} service={svc} index={i % 4} />
        ))}
      </div>
    </UserPageShell>
  );
}

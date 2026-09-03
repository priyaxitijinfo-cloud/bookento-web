"use client";

import { SectionHeader } from "@/components/home/section-header";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { ServiceCard } from "@/components/home/service-card";
import {
  HOME_POPULAR_SERVICES,
  WEB_HOME_POPULAR_SERVICES,
} from "@/constants/popular-services";
import { ROUTES } from "@/constants/routes.constants";

export function PopularServicesShowcase() {
  return (
    <section>
      <SectionHeader title="Popular Services" href={ROUTES.SERVICES} />

      <MobileScrollRow className="md:hidden">
        {HOME_POPULAR_SERVICES.map((svc, i) => (
          <div key={svc.id} className="w-[calc((100vw-4.25rem)/2)] shrink-0 snap-start">
            <ServiceCard service={svc} index={i} />
          </div>
        ))}
      </MobileScrollRow>

      <div className="hidden gap-3 md:grid md:grid-cols-4 md:gap-4">
        {WEB_HOME_POPULAR_SERVICES.map((svc, i) => (
          <ServiceCard key={svc.id} service={svc} index={i} />
        ))}
      </div>
    </section>
  );
}

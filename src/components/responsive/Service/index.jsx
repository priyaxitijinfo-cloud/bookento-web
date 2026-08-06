"use client";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { toServiceCardModel } from "@/constants/popular-services";
import { services } from "@/mock/services";

import { ServiceDesktop } from "./ServiceDesktop";
import { ServiceMobile } from "./ServiceMobile";
import { ServiceTablet } from "./ServiceTablet";

const SERVICE_LIST = services.filter((s) => s.isActive).map(toServiceCardModel);

export function ServiceResponsive() {
  return (
    <ResponsiveView
      mobile={<ServiceMobile services={SERVICE_LIST} />}
      tablet={<ServiceTablet services={SERVICE_LIST} />}
      desktop={<ServiceDesktop services={SERVICE_LIST} />}
    />
  );
}

export default ServiceResponsive;

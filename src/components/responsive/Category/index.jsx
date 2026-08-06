"use client";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { HOME_CATEGORIES } from "@/constants/home-categories";

import { CategoryDesktop } from "./CategoryDesktop";
import { CategoryMobile } from "./CategoryMobile";
import { CategoryTablet } from "./CategoryTablet";

export function CategoryResponsive() {
  return (
    <ResponsiveView
      mobile={<CategoryMobile categories={HOME_CATEGORIES} />}
      tablet={<CategoryTablet categories={HOME_CATEGORIES} />}
      desktop={<CategoryDesktop categories={HOME_CATEGORIES} />}
    />
  );
}

export default CategoryResponsive;

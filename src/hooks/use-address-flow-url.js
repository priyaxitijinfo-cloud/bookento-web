"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  ADDRESS_FLOW_STEPS,
  clearAddressFlowDraft,
  writeAddressFlowDraft,
} from "@/constants/address-flow.constants";

export function useAddressFlowUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const step = searchParams.get("step") || ADDRESS_FLOW_STEPS.LIST;
  const searchQuery = searchParams.get("q") || "";
  const editId = searchParams.get("edit") || null;

  const navigateToStep = useCallback(
    (nextStep, { q, edit, draft } = {}) => {
      const params = new URLSearchParams();

      if (nextStep !== ADDRESS_FLOW_STEPS.LIST) {
        params.set("step", nextStep);
      }

      if (q) {
        params.set("q", q);
      }

      if (edit) {
        params.set("edit", edit);
      }

      if (draft && (nextStep === ADDRESS_FLOW_STEPS.MAP || nextStep === ADDRESS_FLOW_STEPS.FORM)) {
        writeAddressFlowDraft(draft);
      }

      if (nextStep === ADDRESS_FLOW_STEPS.LIST) {
        clearAddressFlowDraft();
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  return {
    step,
    searchQuery,
    editId,
    navigateToStep,
  };
}

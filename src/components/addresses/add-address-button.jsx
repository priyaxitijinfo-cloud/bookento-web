"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AddAddressButton({ onClick, compact = false }) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex size-9 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-colors hover:bg-[#1D4ED8]"
        aria-label="Add address"
      >
        <Plus className="size-5" strokeWidth={2.4} />
      </button>
    );
  }

  return (
    <Button size="sm" onClick={onClick}>
      <Plus className="size-4" />
      Add Address
    </Button>
  );
}

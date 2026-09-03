"use client";

import { AddAddressPlusIcon } from "@/components/icons/address-action-icons";
import { Button } from "@/components/ui/button";

export function AddAddressButton({ onClick, compact = false }) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="gradient-brand flex size-10 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-95"
        aria-label="Add address"
      >
        <AddAddressPlusIcon className="size-4 text-white" />
      </button>
    );
  }

  return (
    <Button size="sm" onClick={onClick}>
      <AddAddressPlusIcon className="size-4" />
      Add Address
    </Button>
  );
}

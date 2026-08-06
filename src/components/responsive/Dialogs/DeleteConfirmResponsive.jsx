"use client";

import { DeleteAddressModal } from "@/components/addresses/delete-address-modal";

/** Responsive wrapper around the existing delete confirmation modal. */
export function DeleteConfirmResponsive(props) {
  return <DeleteAddressModal {...props} onClose={props.onClose ?? props.onOpenChange?.bind(null, false)} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import {
  AddressEditIcon,
  AddressDeleteIcon,
} from "@/components/icons/address-action-icons";
import { AddressMenuDotIcon } from "@/components/icons/address-menu-dot-icon";
import { AddressListPinIcon, LocationIcon } from "@/components/icons/location-icon";
import { EmptyState } from "@/components/shared/empty-state";
import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { formatAddressPreview } from "@/constants/address-flow.constants";
import { cn } from "@/lib/utils";

function AddressEmptyStateMobile() {
  return (
    <IllustrationEmptyState
      src="/icons/addresses-empty.png"
      title="No Addresses Added Yet"
      description={
        <>
          <span className="block whitespace-nowrap">
            You haven&apos;t added any addresses yet.
          </span>
          <span className="block whitespace-nowrap">
            Add an address to for faster checkout.
          </span>
        </>
      }
      className="md:hidden"
    />
  );
}

function AddressPinIcon({ selected = false }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center",
        "max-md:mt-0.5 max-md:size-6 max-md:text-[#4D5972]",
        "md:size-10 md:rounded-full",
        selected
          ? "md:bg-[#EFF6FF] md:text-[#1865EA]"
          : "md:bg-[#EFF6FF] md:text-[#2563EB]",
      )}
    >
      <AddressListPinIcon className="size-6 md:hidden" />
      <LocationIcon
        className="hidden size-[22px] md:block"
        strokeWidth={selected ? 2.2 : 2}
      />
    </span>
  );
}

function AddressMenu({ address, onEdit, onDelete, open, onToggle, selected = false }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle(null);
      }
    }

    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [open, onToggle]);

  return (
    <div ref={menuRef} className="relative shrink-0 md:hidden">
      <button
        type="button"
        onClick={() => onToggle(open ? null : address.id)}
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border border-[#CEE1FC] bg-[#F2F6FC] text-[#036BFB] transition-colors",
        )}
        aria-label={`Actions for ${address.label}`}
        aria-expanded={open}
      >
        <AddressMenuDotIcon className="size-[18px]" />
      </button>

      {open ? (
        <div className="absolute top-10 right-0 z-20 flex min-w-[9.5rem] flex-col overflow-hidden rounded-xl border border-[#F2F2F2] bg-white py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={() => {
              onToggle(null);
              onEdit(address);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-[#4D5972]"
          >
            <AddressEditIcon className="size-5" />
            Edit
          </button>
          <div className="mx-4 border-t border-[#EEF2F7]" />
          <button
            type="button"
            onClick={() => {
              onToggle(null);
              onDelete(address);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-[#4D5972]"
          >
            <AddressDeleteIcon className="size-5" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AddressListView({ addresses, onEdit, onDelete }) {
  const [menuId, setMenuId] = useState(null);

  if (!addresses?.length) {
    return (
      <>
        <AddressEmptyStateMobile />
        <div className="hidden md:block">
          <EmptyState
            icon={MapPin}
            title="No Addresses Yet"
            description="Add a location to book services at your preferred place."
          />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-3 md:space-y-5">
      <div className="space-y-3">
        {addresses.map((address) => {
          const selected = Boolean(address.isDefault);

          return (
            <article
              key={address.id}
              className={cn(
                "flex items-start gap-3",
                "max-md:rounded-2xl max-md:border max-md:border-[#EEF2F7] max-md:bg-white max-md:px-4 max-md:py-3.5",
                "md:bg-background md:shadow-card md:rounded-2xl md:border md:border-[#EEF2F7] md:px-6 md:py-5",
              )}
            >
              <AddressPinIcon selected={selected} />
              <div className="min-w-0 flex-1">
                <p className="md:text-foreground text-[15px] font-semibold text-[#111827] md:text-sm md:font-semibold">
                  {address.label}
                </p>
                <p className="md:text-muted-foreground mt-1 text-sm leading-relaxed text-[#64748B]">
                  {formatAddressPreview(address)}
                </p>
              </div>

              <AddressMenu
                address={address}
                onEdit={onEdit}
                onDelete={onDelete}
                open={menuId === address.id}
                onToggle={setMenuId}
                selected={selected}
              />

              <div className="hidden shrink-0 items-center gap-3 md:flex">
                <button
                  type="button"
                  onClick={() => onEdit(address)}
                  className="flex size-9 items-center justify-center text-[#64748B] transition-colors hover:text-[#1865EA]"
                  aria-label={`Edit ${address.label}`}
                >
                  <AddressEditIcon className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(address)}
                  className="flex size-9 items-center justify-center text-[#64748B] transition-colors hover:text-[#F13339]"
                  aria-label={`Delete ${address.label}`}
                >
                  <AddressDeleteIcon className="size-5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

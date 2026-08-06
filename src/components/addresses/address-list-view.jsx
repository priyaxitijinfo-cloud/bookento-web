"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Search, Trash2 } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { formatAddressPreview } from "@/constants/address-flow.constants";
import { cn } from "@/lib/utils";

function AddressIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
      <LocationIcon className="size-[1.125rem]" strokeWidth={2.2} />
    </span>
  );
}

function CurrentLocationIcon() {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center text-[#2563EB]" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" className="size-6" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  );
}

function AddressMenu({ address, onEdit, onDelete, open, onToggle }) {
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
        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
        aria-label={`Actions for ${address.label}`}
        aria-expanded={open}
      >
        <MoreVertical className="size-5" />
      </button>

      {open ? (
        <div className="absolute top-9 right-0 z-20 min-w-[8.5rem] overflow-hidden rounded-xl border border-[#EEF2F7] bg-background py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            onClick={() => {
              onToggle(null);
              onEdit(address);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#374151] transition-colors hover:bg-[#F8FAFC]"
          >
            <Pencil className="size-4 text-muted-foreground" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              onToggle(null);
              onDelete(address);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function AddressListView({
  addresses,
  onEdit,
  onDelete,
  onSearchFocus,
  onUseCurrentLocation,
  currentLocationPreview,
}) {
  const [menuId, setMenuId] = useState(null);

  return (
    <div className="space-y-5">
      {/* Mobile: Select Location chrome from design */}
      <div className="space-y-4 md:hidden">
        <button
          type="button"
          onClick={onSearchFocus}
          className="border-border/70 flex h-11 w-full items-center gap-3 rounded-full border bg-background px-4 text-left shadow-card"
        >
          <Search className="text-muted-foreground size-4 shrink-0" />
          <span className="text-muted-foreground truncate text-sm">Search an area or address</span>
        </button>

        <button
          type="button"
          onClick={onUseCurrentLocation}
          className="flex w-full items-start gap-3 rounded-2xl py-1 text-left"
        >
          <CurrentLocationIcon />
          <span className="min-w-0 pt-0.5">
            <span className="text-foreground block text-sm font-bold">Use Current Location</span>
            {currentLocationPreview ? (
              <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                {currentLocationPreview}
              </span>
            ) : null}
          </span>
        </button>

        <h2 className="text-foreground text-base font-bold">Addresses</h2>
      </div>

      <div className="space-y-3">
        {addresses.map((address) => (
          <article
            key={address.id}
            className={cn(
              "flex items-start gap-3 bg-background",
              "rounded-2xl border border-[#EEF2F7] px-4 py-4 shadow-card md:px-6 md:py-5",
            )}
          >
            <AddressIcon />
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-bold">{address.label}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {formatAddressPreview(address)}
              </p>
            </div>

            <AddressMenu
              address={address}
              onEdit={onEdit}
              onDelete={onDelete}
              open={menuId === address.id}
              onToggle={setMenuId}
            />

            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => onEdit(address)}
                className="hover:text-primary flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors"
                aria-label={`Edit ${address.label}`}
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(address)}
                className="hover:text-destructive flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors"
                aria-label={`Delete ${address.label}`}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

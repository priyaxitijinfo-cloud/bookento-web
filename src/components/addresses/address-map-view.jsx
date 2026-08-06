"use client";

import { Search } from "lucide-react";

import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { LocationIcon } from "@/components/icons/location-icon";
import { formatAddressPreview } from "@/constants/address-flow.constants";

export function AddressMapFlow({
  location,
  saving = false,
  backLabel = "Back",
  saveLabel = "Save Location",
  onBack,
  onSave,
  onEditSearch,
}) {
  const latitude = location.latitude ?? 21.1959;
  const longitude = location.longitude ?? 72.7863;
  const delta = 0.012;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <AddressPageShell
      title="Select Location"
      backLabel={backLabel}
      onBack={onBack}
      showBottomNav={false}
      mainClassName="mx-auto max-w-lg px-4 py-4 md:max-w-7xl md:px-6 md:py-6"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#111827] md:min-h-[34rem]">
        <div className="relative aspect-[4/5] w-full md:aspect-[16/10]">
          <iframe
            title="Selected location map"
            src={mapEmbedUrl}
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0f172a]/10" />

          <div className="absolute inset-x-0 top-0 z-10 p-4">
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2" />
              <button
                type="button"
                onClick={onEditSearch}
                className="h-11 w-full rounded-xl border border-[#EEF2F7] bg-background pl-10 pr-4 text-left text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.12)] outline-none transition-colors hover:bg-[#F8FAFC]"
              >
                <span className="text-foreground block truncate">
                  {location.searchLine || "Search locality"}
                </span>
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[38%] z-10 flex -translate-y-1/2 justify-center">
            <span className="relative flex flex-col items-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_10px_24px_rgba(37,99,235,0.45)]">
                <LocationIcon className="size-6 text-white" strokeWidth={2} />
              </span>
              <span className="mt-1 size-3 rotate-45 bg-[#2563EB]" />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 p-4">
            <div className="rounded-[1.25rem] bg-background p-4 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB]">
                  <LocationIcon className="size-[1.125rem]" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-bold">{location.label}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {formatAddressPreview(location)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={onSave}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-xl bg-[#2563EB] text-sm font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-colors hover:bg-[#1D4ED8] disabled:opacity-70"
              >
                {saving ? "Saving..." : saveLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AddressPageShell>
  );
}

"use client";

import { ArrowLeft, X } from "lucide-react";

import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { AddressMapLocationIcon } from "@/components/icons/location-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { LocationIcon } from "@/components/icons/location-icon";
import {
  formatAddressPreview,
  formatMapCardAddress,
  getMapCardTitle,
} from "@/constants/address-flow.constants";

function MapRedPin() {
  return (
    <span className="pointer-events-none relative flex flex-col items-center">
      <span className="relative flex size-11 items-center justify-center">
        <span className="absolute inset-x-2 top-1.5 bottom-3 rounded-full bg-[#EA4335] shadow-[0_8px_18px_rgba(234,67,53,0.45)]" />
        <span className="relative z-10 size-3.5 rounded-full bg-white" />
        <span className="absolute bottom-0 left-1/2 z-10 size-3 -translate-x-1/2 rotate-45 bg-[#EA4335]" />
      </span>
      <span className="mt-0.5 size-2 rounded-full bg-[#EA4335] ring-2 ring-white" />
    </span>
  );
}

function AddressMapMobileView({
  location,
  saving,
  saveLabel,
  onBack,
  onSave,
  onEditSearch,
}) {
  const latitude = location.latitude ?? 21.1959;
  const longitude = location.longitude ?? 72.7863;
  const delta = 0.012;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const searchText =
    location.searchLine ||
    formatAddressPreview(location) ||
    "Search an area or address";

  return (
    <div className="fixed inset-0 z-40 bg-[#0B1D33] md:hidden">
      <iframe
        title="Selected location map"
        src={mapEmbedUrl}
        className="size-full border-0 brightness-[0.72] contrast-[1.08] saturate-[0.85]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0 bg-[#0B1D33]/35" />

      <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top,0px)+24px)] z-20 px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_4px_16px_rgba(15,23,42,0.14)]"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" strokeWidth={2.25} />
          </button>

          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              onClick={onEditSearch}
              className="flex h-11 w-full items-center rounded-full bg-white px-4 pr-10 text-left shadow-[0_4px_16px_rgba(15,23,42,0.14)]"
            >
              <span className="truncate text-sm font-medium text-[#475569]">
                {searchText}
              </span>
            </button>
            {onEditSearch ? (
              <button
                type="button"
                onClick={onEditSearch}
                className="absolute top-1/2 right-3 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-[#EEF2F7] text-[#64748B]"
                aria-label="Edit search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[42%] z-10 flex -translate-y-1/2 justify-center">
        <MapRedPin />
      </div>

      <div className="safe-bottom absolute inset-x-0 bottom-4 z-20 px-4">
        <div className="flex flex-col gap-4 rounded-[1.25rem] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FF] text-[#036BFB]">
                <AddressMapLocationIcon className="size-[1.875rem]" />
              </span>
              <p className="min-w-0 flex-1 text-base font-semibold text-[#111827]">
                {getMapCardTitle(location)}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[#64748B]">
              {formatMapCardAddress(location)}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddressMapDesktopView({
  location,
  saving,
  saveLabel,
  onBack,
  onSave,
  onEditSearch,
}) {
  const latitude = location.latitude ?? 21.1959;
  const longitude = location.longitude ?? 72.7863;
  const delta = 0.012;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
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
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <button
              type="button"
              onClick={onEditSearch}
              className="bg-background h-11 w-full rounded-xl border border-[#EEF2F7] pr-4 pl-10 text-left text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-colors outline-none hover:bg-[#F8FAFC]"
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
          <div className="bg-background rounded-[1.25rem] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.18)]">
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
  );
}

export function AddressMapFlow({
  location,
  saving = false,
  backLabel = "Back",
  saveLabel = "Save Location",
  onBack,
  onSave,
  onEditSearch,
}) {
  return (
    <>
      <AddressMapMobileView
        location={location}
        saving={saving}
        saveLabel={saveLabel}
        onBack={onBack}
        onSave={onSave}
        onEditSearch={onEditSearch}
      />

      <AddressPageShell
        title="Select Location"
        backLabel={backLabel}
        onBack={onBack}
        showBottomNav={false}
        mainClassName="mx-auto max-w-lg px-4 py-4 md:max-w-7xl md:px-6 md:pt-2 md:pb-6"
        className="hidden md:block"
      >
        <AddressMapDesktopView
          location={location}
          saving={saving}
          saveLabel={saveLabel}
          onBack={onBack}
          onSave={onSave}
          onEditSearch={onEditSearch}
        />
      </AddressPageShell>
    </>
  );
}

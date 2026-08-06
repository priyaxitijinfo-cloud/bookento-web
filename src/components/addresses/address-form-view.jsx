"use client";

import { useEffect, useState } from "react";
import { Briefcase, Home } from "lucide-react";

import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { LocationIcon } from "@/components/icons/location-icon";
import { GooglePlacesAutocomplete } from "@/components/places/google-places-autocomplete";
import { ADDRESS_LABEL_CHIPS } from "@/constants/address-flow.constants";
import { buildLocationFromGooglePlace } from "@/lib/google-maps/parse-place-details";
import { cn } from "@/lib/utils";

import "@/components/addresses/address-search-locality-pac.css";

const CHIP_ICONS = {
  house: Home,
  work: Briefcase,
  other: LocationIcon,
};

const fieldClassName =
  "h-12 w-full rounded-xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 text-sm outline-none placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20";

export function AddressFormFlow({
  location,
  initialName = "",
  initialPhone = "",
  initialAddress = "",
  initialLabelChip = "house",
  initialCustomLabel = "",
  isEditing = false,
  saving = false,
  backLabel = "Back to Addresses",
  onBack,
  onSave,
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [fullAddress, setFullAddress] = useState(initialAddress);
  const [labelChip, setLabelChip] = useState(initialLabelChip);
  const [customLabel, setCustomLabel] = useState(initialCustomLabel);
  const [searchLine, setSearchLine] = useState(location.searchLine || location.addressLine1 || "");
  const [placeDetails, setPlaceDetails] = useState({
    placeId: location.placeId ?? "",
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    country: location.country ?? "India",
    state: location.state ?? "",
    city: location.city ?? "",
    area: location.area ?? "",
    pincode: location.pincode ?? "",
    street: location.street ?? "",
    buildingName: location.buildingName ?? "",
  });

  const latitude = placeDetails.latitude ?? location.latitude ?? 21.1959;
  const longitude = placeDetails.longitude ?? location.longitude ?? 72.7863;
  const delta = 0.012;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - delta}%2C${latitude - delta}%2C${longitude + delta}%2C${latitude + delta}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  const applyPlaceSelection = (place) => {
    const mapped = buildLocationFromGooglePlace(place);
    const nextAddress =
      [mapped.addressLine1, mapped.addressLine2].filter(Boolean).join(", ") ||
      mapped.formattedAddress ||
      mapped.searchLine;

    setSearchLine(mapped.searchLine);
    setFullAddress(nextAddress);
    setPlaceDetails({
      placeId: mapped.placeId,
      latitude: mapped.latitude,
      longitude: mapped.longitude,
      country: mapped.country,
      state: mapped.state,
      city: mapped.city,
      area: mapped.area,
      pincode: mapped.pincode,
      street: mapped.street,
      buildingName: mapped.buildingName,
    });
  };

  const handleSubmit = () => {
    if (saving || !canSave) return;

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      fullAddress: fullAddress.trim(),
      labelChip,
      customLabel: customLabel.trim(),
      placeId: placeDetails.placeId,
      latitude: placeDetails.latitude,
      longitude: placeDetails.longitude,
      country: placeDetails.country,
      state: placeDetails.state,
      city: placeDetails.city,
      area: placeDetails.area,
      pincode: placeDetails.pincode,
      street: placeDetails.street,
      buildingName: placeDetails.buildingName,
      formattedAddress: fullAddress.trim(),
    });
  };

  const needsCustomLabel = labelChip === "other";
  const canSave =
    name.trim() &&
    phone.trim() &&
    fullAddress.trim() &&
    (!needsCustomLabel || customLabel.trim());

  useEffect(() => {
    document.body.classList.add("address-places-pac");
    return () => document.body.classList.remove("address-places-pac");
  }, []);

  return (
    <AddressPageShell
      title={isEditing ? "Edit Address" : "Add Address"}
      backLabel={backLabel}
      onBack={onBack}
      showBottomNav={false}
      mainClassName="mx-auto max-w-lg px-0 py-0 md:max-w-7xl md:px-6 md:py-6"
    >
      <div className="overflow-hidden bg-background md:rounded-2xl md:border md:border-[#EEF2F7] md:shadow-card">
        <div className="relative h-[15.5rem] overflow-hidden bg-[#111827] md:h-[17.5rem] md:rounded-t-2xl">
          <iframe
            title="Selected location map"
            src={mapEmbedUrl}
            className="size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-[#0f172a]/10" />

          <div className="absolute inset-x-0 top-0 z-10 p-4">
            <GooglePlacesAutocomplete
              value={searchLine}
              onChange={setSearchLine}
              onPlaceSelect={applyPlaceSelection}
              placeholder="Search address, area, shop, landmark..."
              regionCode="in"
              inputClassName="border-[#EEF2F7] bg-background pl-10 text-sm font-medium shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-[58%] z-10 flex -translate-y-1/2 justify-center">
            <span className="relative flex flex-col items-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_8px_20px_rgba(37,99,235,0.45)]">
                <LocationIcon className="size-5 text-white" strokeWidth={2} />
              </span>
              <span className="mt-1 size-2.5 rotate-45 bg-[#2563EB]" />
            </span>
          </div>
        </div>

        <div className="space-y-4 px-4 pb-8 pt-5 md:px-6 md:pb-8 md:pt-6">
          <label className="block">
            <span className="text-foreground mb-2 block text-sm font-semibold">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your Name"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="text-foreground mb-2 block text-sm font-semibold">Phone Number</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Your Phone Number"
              className={fieldClassName}
            />
          </label>

          <label className="block">
            <span className="text-foreground mb-2 block text-sm font-semibold">Address</span>
            <textarea
              value={fullAddress}
              onChange={(event) => setFullAddress(event.target.value)}
              placeholder="House / Flat No., Building, Street, Landmark"
              rows={3}
              className={cn(fieldClassName, "min-h-[5.5rem] resize-none py-3 leading-relaxed")}
            />
          </label>

          <div>
            <span className="text-foreground mb-3 block text-sm font-semibold">Save Address as</span>
            <div className="grid grid-cols-3 gap-3">
              {ADDRESS_LABEL_CHIPS.map((chip) => {
                const Icon = CHIP_ICONS[chip.id];
                const isSelected = labelChip === chip.id;

                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setLabelChip(chip.id)}
                    className={cn(
                      "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors",
                      isSelected
                        ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                        : "border-[#EEF2F7] bg-background text-[#64748B] hover:bg-[#F8FAFC]",
                    )}
                  >
                    <Icon className="size-4 shrink-0" strokeWidth={2} />
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {needsCustomLabel ? (
              <label className="mt-3 block">
                <span className="text-foreground mb-2 block text-sm font-semibold">
                  Save as name
                </span>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(event) => setCustomLabel(event.target.value)}
                  placeholder="e.g. Parents Home, Gym, Friend's place"
                  className={fieldClassName}
                />
              </label>
            ) : null}

            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="gradient-brand shadow-brand mt-7 flex h-14 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    </AddressPageShell>
  );
}

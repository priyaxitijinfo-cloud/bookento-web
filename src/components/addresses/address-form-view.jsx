"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { AddressPageShell } from "@/components/addresses/address-page-shell";
import {
  AddressHouseIcon,
  AddressOtherIcon,
  AddressWorkIcon,
} from "@/components/icons/address-label-icons";
import { LocationIcon } from "@/components/icons/location-icon";
import { GooglePlacesAutocomplete } from "@/components/places/google-places-autocomplete";
import { ADDRESS_LABEL_CHIPS } from "@/constants/address-flow.constants";
import { buildLocationFromGooglePlace } from "@/lib/google-maps/parse-place-details";
import { cn } from "@/lib/utils";

import "@/components/addresses/address-search-locality-pac.css";

const CHIP_ICONS = {
  house: AddressHouseIcon,
  work: AddressWorkIcon,
  other: AddressOtherIcon,
};

const MOBILE_FIELD_CLASS =
  "h-12 w-full rounded-xl border border-[#F2F2F2] bg-white px-4 text-sm font-normal text-[#111827] outline-none placeholder:font-normal placeholder:text-[#ADB3B7] focus-visible:ring-2 focus-visible:ring-[#2563EB]/15";

const DESKTOP_FIELD_CLASS =
  "h-12 w-full rounded-xl border border-[#EEF2F7] bg-[#FAFBFD] px-4 text-sm outline-none placeholder:text-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20";

const MOBILE_ADDRESS_FIELD_CLASS =
  "min-h-[5.5rem] w-full rounded-xl border border-[#F2F2F2] bg-white px-4 py-3 text-sm font-normal text-[#111827] outline-none placeholder:font-normal placeholder:text-[#ADB3B7] focus-visible:ring-2 focus-visible:ring-[#2563EB]/15 resize-none leading-relaxed";

const MOBILE_FIELD_PLACEHOLDERS = {
  name: "Your Name",
  phone: "Your Phone Number",
  address: "Enter Full Address",
  customLabel: "e.g. Parents Home, Gym, Friend's place",
};

const MOBILE_SEARCH_INPUT_CLASS =
  "h-11 rounded-full border-0 bg-white pl-4 pr-10 text-sm font-medium text-[#475569] shadow-[0_4px_16px_rgba(15,23,42,0.14)] focus-visible:ring-0";

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

function getCanSaveAddress({ name, phone, fullAddress, labelChip, customLabel }) {
  const needsCustomLabel = labelChip === "other";
  return Boolean(
    name.trim() &&
    phone.trim() &&
    fullAddress.trim() &&
    (!needsCustomLabel || customLabel.trim()),
  );
}

function SaveAddressButton({ saving, canSave, onSubmit, isMobile = false }) {
  return (
    <button
      type="button"
      disabled={saving || !canSave}
      onClick={onSubmit}
      className={cn(
        "gradient-brand flex w-full items-center justify-center text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 md:font-semibold",
        isMobile ? "h-12 rounded-xl" : "shadow-brand h-14 rounded-xl",
      )}
    >
      {saving ? "Saving..." : "Save Address"}
    </button>
  );
}

function AddressFormFields({
  name,
  phone,
  fullAddress,
  labelChip,
  customLabel,
  saving,
  isMobile = false,
  hideSubmitButton = false,
  fieldClassName,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onLabelChipChange,
  onCustomLabelChange,
  onSubmit,
}) {
  const needsCustomLabel = labelChip === "other";
  const canSave = getCanSaveAddress({
    name,
    phone,
    fullAddress,
    labelChip,
    customLabel,
  });

  return (
    <div className={cn("space-y-4", isMobile ? "px-4 pt-5 pb-4" : "space-y-4")}>
      <label className="block">
        <span
          className={cn(
            "mb-2 block text-sm",
            isMobile ? "font-medium text-[#111827]" : "text-foreground font-semibold",
          )}
        >
          Name
        </span>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={isMobile ? MOBILE_FIELD_PLACEHOLDERS.name : "Your Name"}
          className={fieldClassName}
        />
      </label>

      <label className="block">
        <span
          className={cn(
            "mb-2 block text-sm",
            isMobile ? "font-medium text-[#111827]" : "text-foreground font-semibold",
          )}
        >
          Phone Number
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder={isMobile ? MOBILE_FIELD_PLACEHOLDERS.phone : "Your Phone Number"}
          className={fieldClassName}
        />
      </label>

      <label className="block">
        <span
          className={cn(
            "mb-2 block text-sm",
            isMobile ? "font-medium text-[#111827]" : "text-foreground font-semibold",
          )}
        >
          Address
        </span>
        {isMobile ? (
          <textarea
            value={fullAddress}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder={MOBILE_FIELD_PLACEHOLDERS.address}
            rows={3}
            className={MOBILE_ADDRESS_FIELD_CLASS}
          />
        ) : (
          <textarea
            value={fullAddress}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder="House / Flat No., Building, Street, Landmark"
            rows={3}
            className={cn(
              fieldClassName,
              "min-h-[5.5rem] resize-none py-3 leading-relaxed",
            )}
          />
        )}
      </label>

      <div className={cn(isMobile && "-mt-[10px]")}>
        <span
          className={cn(
            "mb-3 block text-sm",
            isMobile ? "font-medium text-[#111827]" : "text-foreground font-semibold",
          )}
        >
          Save Address as
        </span>
        <div className="grid grid-cols-3 gap-3">
          {ADDRESS_LABEL_CHIPS.map((chip) => {
            const Icon = CHIP_ICONS[chip.id];
            const isSelected = labelChip === chip.id;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => onLabelChipChange(chip.id)}
                className={cn(
                  "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm transition-colors",
                  isMobile ? "font-medium" : "font-semibold",
                  isSelected
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                    : isMobile
                      ? "border-[#F2F2F2] bg-white text-[#64748B]"
                      : "bg-background border-[#EEF2F7] text-[#64748B] hover:bg-[#F8FAFC]",
                )}
              >
                <Icon className="size-5 shrink-0" />
                {chip.label}
              </button>
            );
          })}
        </div>

        {needsCustomLabel ? (
          <label className="mt-3 block">
            <span
              className={cn(
                "mb-2 block text-sm",
                isMobile
                  ? "font-medium text-[#111827]"
                  : "text-foreground font-semibold",
              )}
            >
              Save as name
            </span>
            <input
              type="text"
              value={customLabel}
              onChange={(event) => onCustomLabelChange(event.target.value)}
              placeholder={
                isMobile
                  ? MOBILE_FIELD_PLACEHOLDERS.customLabel
                  : "e.g. Parents Home, Gym, Friend's place"
              }
              className={fieldClassName}
            />
          </label>
        ) : null}

        {!hideSubmitButton ? (
          <SaveAddressButton
            saving={saving}
            canSave={canSave}
            onSubmit={onSubmit}
            isMobile={isMobile}
          />
        ) : null}
      </div>
    </div>
  );
}

function AddressFormMobileView({
  mapEmbedUrl,
  searchLine,
  name,
  phone,
  fullAddress,
  labelChip,
  customLabel,
  saving,
  onBack,
  onSearchChange,
  onPlaceSelect,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onLabelChipChange,
  onCustomLabelChange,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#0B1D33] md:hidden">
      <div className="relative min-h-0 shrink-0 basis-[calc(38%+10px)] overflow-hidden rounded-b-[1.75rem]">
        <iframe
          title="Selected location map"
          src={mapEmbedUrl}
          className="absolute inset-0 size-full border-0 brightness-[0.72] contrast-[1.08] saturate-[0.85]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#0B1D33]/35" />

        <div className="absolute inset-x-0 top-[calc(env(safe-area-inset-top,0px)+16px)] z-20 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_4px_16px_rgba(15,23,42,0.14)]"
              aria-label="Back"
            >
              <ArrowLeft className="size-5" strokeWidth={2.25} />
            </button>

            <div className="min-w-0 flex-1">
              <GooglePlacesAutocomplete
                value={searchLine}
                onChange={onSearchChange}
                onPlaceSelect={onPlaceSelect}
                placeholder="Search an area or address"
                regionCode="in"
                showSearchIcon={false}
                clearable
                inputClassName={MOBILE_SEARCH_INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center">
          <MapRedPin />
        </div>
      </div>

      <div className="relative z-10 -mt-5 flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#EEF5FF] via-[#F7FAFF] to-[#FFFFFF]">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <AddressFormFields
            isMobile
            hideSubmitButton
            fieldClassName={MOBILE_FIELD_CLASS}
            name={name}
            phone={phone}
            fullAddress={fullAddress}
            labelChip={labelChip}
            customLabel={customLabel}
            saving={saving}
            onNameChange={onNameChange}
            onPhoneChange={onPhoneChange}
            onAddressChange={onAddressChange}
            onLabelChipChange={onLabelChipChange}
            onCustomLabelChange={onCustomLabelChange}
            onSubmit={onSubmit}
          />
        </div>

        <div className="shrink-0 bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
          <SaveAddressButton
            isMobile
            saving={saving}
            canSave={getCanSaveAddress({
              name,
              phone,
              fullAddress,
              labelChip,
              customLabel,
            })}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

function AddressFormDesktopView({
  mapEmbedUrl,
  searchLine,
  name,
  phone,
  fullAddress,
  labelChip,
  customLabel,
  saving,
  onSearchChange,
  onPlaceSelect,
  onNameChange,
  onPhoneChange,
  onAddressChange,
  onLabelChipChange,
  onCustomLabelChange,
  onSubmit,
}) {
  return (
    <div className="bg-background md:shadow-card hidden overflow-hidden md:block md:rounded-2xl md:border md:border-[#EEF2F7]">
      <div className="relative h-[17.5rem] overflow-hidden bg-[#111827] md:rounded-t-2xl">
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
            onChange={onSearchChange}
            onPlaceSelect={onPlaceSelect}
            placeholder="Search address, area, shop, landmark..."
            regionCode="in"
            useDesignSearchIcon
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

      <div className="px-6 pt-6 pb-6">
        <AddressFormFields
          hideSubmitButton
          fieldClassName={DESKTOP_FIELD_CLASS}
          name={name}
          phone={phone}
          fullAddress={fullAddress}
          labelChip={labelChip}
          customLabel={customLabel}
          saving={saving}
          onNameChange={onNameChange}
          onPhoneChange={onPhoneChange}
          onAddressChange={onAddressChange}
          onLabelChipChange={onLabelChipChange}
          onCustomLabelChange={onCustomLabelChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

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
  const [name, setName] = useState(isEditing ? initialName : "");
  const [phone, setPhone] = useState(isEditing ? initialPhone : "");
  const [fullAddress, setFullAddress] = useState(isEditing ? initialAddress : "");
  const [labelChip, setLabelChip] = useState(initialLabelChip);
  const [customLabel, setCustomLabel] = useState(initialCustomLabel);
  const [searchLine, setSearchLine] = useState(
    location.searchLine || location.addressLine1 || "",
  );
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
    const needsCustomLabel = labelChip === "other";
    const canSave =
      name.trim() &&
      phone.trim() &&
      fullAddress.trim() &&
      (!needsCustomLabel || customLabel.trim());

    if (saving || !canSave) return;

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      fullAddress: fullAddress.trim(),
      labelChip,
      customLabel: customLabel.trim(),
      searchLine: searchLine.trim(),
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

  useEffect(() => {
    if (isEditing) {
      setName(initialName);
      setPhone(initialPhone);
      setFullAddress(initialAddress);
      return;
    }

    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobileViewport) {
      setName(initialName);
      setPhone(initialPhone);
      setFullAddress(initialAddress);
    }
  }, [isEditing, initialName, initialPhone, initialAddress]);

  useEffect(() => {
    document.body.classList.add("address-places-pac", "address-search-mobile");
    return () => {
      document.body.classList.remove("address-places-pac", "address-search-mobile");
    };
  }, []);

  const sharedProps = {
    mapEmbedUrl,
    searchLine,
    name,
    phone,
    fullAddress,
    labelChip,
    customLabel,
    saving,
    onSearchChange: setSearchLine,
    onPlaceSelect: applyPlaceSelection,
    onNameChange: setName,
    onPhoneChange: setPhone,
    onAddressChange: setFullAddress,
    onLabelChipChange: setLabelChip,
    onCustomLabelChange: setCustomLabel,
    onSubmit: handleSubmit,
  };

  return (
    <>
      <AddressFormMobileView {...sharedProps} onBack={onBack} />

      <AddressPageShell
        title={isEditing ? "Edit Address" : "Add Address"}
        backLabel={backLabel}
        onBack={onBack}
        showBottomNav={false}
        shellClassName="hidden md:block"
        mainClassName="mx-auto max-w-7xl px-6 pt-2 pb-28"
        footer={
          <div className="safe-bottom fixed inset-x-0 bottom-0 z-50 hidden border-t border-[#E6EAF2] bg-white px-6 py-4 md:block">
            <div className="mx-auto w-full max-w-7xl">
              <SaveAddressButton
                saving={saving}
                canSave={getCanSaveAddress({
                  name,
                  phone,
                  fullAddress,
                  labelChip,
                  customLabel,
                })}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        }
      >
        <AddressFormDesktopView {...sharedProps} />
      </AddressPageShell>
    </>
  );
}

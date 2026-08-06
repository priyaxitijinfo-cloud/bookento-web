"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AddAddressButton } from "@/components/addresses/add-address-button";
import { AddressFormFlow } from "@/components/addresses/address-form-view";
import { AddressListView } from "@/components/addresses/address-list-view";
import { AddressMapFlow } from "@/components/addresses/address-map-view";
import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { AddressSearchFlow } from "@/components/addresses/address-search-view";
import { DeleteAddressModal } from "@/components/addresses/delete-address-modal";
import {
  buildLocationFromSuggestion,
  DEFAULT_MAP_LOCATION,
  formatAddressPreview,
  getLabelChipId,
  resolveStoreLabel,
} from "@/constants/address-flow.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useProfileStore } from "@/store";

function getNextLabel(addresses) {
  const labels = ["Home", "Office", "Parents Home", "Other"];
  const used = new Set(addresses.map((address) => address.label));
  return labels.find((label) => !used.has(label)) ?? "Other";
}

function buildDraftFromAddress(address) {
  return {
    label: address.area || address.label,
    searchLine: address.addressLine1,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || "",
    area: address.area || address.city,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    latitude: address.latitude,
    longitude: address.longitude,
  };
}

export default function AddressesPage() {
  const router = useRouter();
  const { addresses: storedAddresses, profile, addAddress, updateAddress, deleteAddress } =
    useProfileStore();
  const addresses = storedAddresses ?? [];

  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [draftLocation, setDraftLocation] = useState(DEFAULT_MAP_LOCATION);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const sortedAddresses = useMemo(
    () => [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses],
  );

  const resetFlow = () => {
    setView("list");
    setSearchQuery("");
    setDraftLocation(DEFAULT_MAP_LOCATION);
    setEditingAddress(null);
  };

  const startAddFlow = () => {
    setEditingAddress(null);
    setSearchQuery("");
    setDraftLocation(DEFAULT_MAP_LOCATION);
    setView("search");
  };

  const startEditFlow = (address) => {
    setEditingAddress(address);
    setDraftLocation(buildDraftFromAddress(address));
    setView("form");
  };

  const handleContinueFromSearch = (suggestion) => {
    setDraftLocation(buildLocationFromSuggestion(suggestion));
    setView("map");
  };

  const handleContinueToForm = () => {
    setView("form");
  };

  const handleSaveForm = async ({ name, phone, fullAddress, labelChip, searchLine }) => {
    if (!profile) return;

    setSaving(true);

    const label = editingAddress
      ? resolveStoreLabel(labelChip, editingAddress.label)
      : resolveStoreLabel(labelChip) || getNextLabel(addresses);

    const payload = {
      label,
      name,
      phone,
      addressLine1: searchLine || fullAddress.split(",")[0]?.trim() || fullAddress,
      addressLine2: draftLocation.addressLine2 || "",
      area: draftLocation.area,
      city: draftLocation.city,
      state: draftLocation.state,
      country: "India",
      pincode: draftLocation.pincode,
      latitude: draftLocation.latitude,
      longitude: draftLocation.longitude,
      isDefault: editingAddress?.isDefault ?? addresses.length === 0,
    };

    if (editingAddress) {
      await updateAddress(editingAddress.id, {
        ...payload,
        addressLine2: fullAddress.includes(",")
          ? fullAddress.split(",").slice(1).join(",").trim()
          : payload.addressLine2,
      });
      toast.success("Address updated successfully");
    } else {
      await addAddress(payload);
      toast.success("Address added successfully");
    }

    setSaving(false);
    resetFlow();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    await deleteAddress(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    toast.success("Address deleted successfully");
  };

  const handleBackFromSearch = () => {
    if (editingAddress || addresses.length > 0) {
      resetFlow();
      return;
    }

    router.push(ROUTES.PROFILE);
  };

  const handleBackFromForm = () => {
    if (editingAddress) {
      resetFlow();
      return;
    }

    setView("map");
  };

  if (view === "search") {
    return (
      <AddressSearchFlow
        initialQuery={searchQuery}
        backLabel={addresses.length > 0 || editingAddress ? "Back to Addresses" : "Back to Profile"}
        onBack={handleBackFromSearch}
        onContinue={handleContinueFromSearch}
      />
    );
  }

  if (view === "map") {
    return (
      <AddressMapFlow
        location={draftLocation}
        saving={false}
        backLabel="Back to Search"
        onBack={() => setView("search")}
        onSave={handleContinueToForm}
        saveLabel="Continue"
      />
    );
  }

  if (view === "form") {
    return (
      <AddressFormFlow
        location={draftLocation}
        initialName={editingAddress?.name ?? profile?.name ?? ""}
        initialPhone={editingAddress?.phone ?? profile?.phone ?? ""}
        initialAddress={
          editingAddress ? formatAddressPreview(editingAddress) : formatAddressPreview(draftLocation)
        }
        initialLabelChip={getLabelChipId(editingAddress?.label ?? getNextLabel(addresses))}
        isEditing={Boolean(editingAddress)}
        saving={saving}
        backLabel={editingAddress ? "Back to Addresses" : "Back to Map"}
        onBack={handleBackFromForm}
        onSave={handleSaveForm}
      />
    );
  }

  return (
    <>
      <AddressPageShell
        title="My Addresses"
        backHref={ROUTES.PROFILE}
        rightAction={(
          <>
            <span className="md:hidden">
              <AddAddressButton compact onClick={startAddFlow} />
            </span>
            <span className="hidden md:inline-flex">
              <AddAddressButton onClick={startAddFlow} />
            </span>
          </>
        )}
      >
        <AddressListView
          addresses={sortedAddresses}
          onEdit={startEditFlow}
          onDelete={setDeleteTarget}
        />
      </AddressPageShell>

      <DeleteAddressModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
}

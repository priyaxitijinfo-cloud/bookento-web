"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ADDRESS_FLOW_STEPS,
  DEFAULT_MAP_LOCATION,
  formatAddressPreview,
  getLabelChipId,
  readAddressFlowDraft,
  resolveStoreLabel,
} from "@/constants/address-flow.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useAddressFlowUrl } from "@/hooks/use-address-flow-url";
import { useProfileStore } from "@/store";

function getNextLabel(addresses) {
  const labels = ["Home", "Office", "Parents Home", "Other"];
  const used = new Set(addresses.map((address) => address.label));
  return labels.find((label) => !used.has(label)) ?? "Other";
}

function buildDraftFromAddress(address) {
  return {
    label: address.area || address.label,
    searchLine: address.formattedAddress || address.addressLine1,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || "",
    area: address.area || address.city,
    city: address.city,
    state: address.state,
    country: address.country,
    pincode: address.pincode,
    latitude: address.latitude,
    longitude: address.longitude,
    placeId: address.placeId,
    street: address.street,
    buildingName: address.buildingName,
    formattedAddress: address.formattedAddress,
  };
}

export function useAddressFlowController() {
  const router = useRouter();
  const { step, searchQuery, editId, navigateToStep } = useAddressFlowUrl();
  const {
    addresses: storedAddresses,
    profile,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useProfileStore();
  const addresses = storedAddresses ?? [];

  const [draftLocation, setDraftLocation] = useState(DEFAULT_MAP_LOCATION);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const editingAddress = useMemo(
    () =>
      editId ? (addresses.find((address) => address.id === editId) ?? null) : null,
    [addresses, editId],
  );

  const sortedAddresses = useMemo(
    () => [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses],
  );

  const defaultAddress =
    sortedAddresses.find((address) => address.isDefault) ?? sortedAddresses[0];

  const currentLocationPreview = formatAddressPreview(
    defaultAddress ?? {
      addressLine1: DEFAULT_MAP_LOCATION.addressLine1,
      addressLine2: DEFAULT_MAP_LOCATION.addressLine2,
      area: DEFAULT_MAP_LOCATION.area,
      city: DEFAULT_MAP_LOCATION.city,
      state: DEFAULT_MAP_LOCATION.state,
      pincode: DEFAULT_MAP_LOCATION.pincode,
      country: DEFAULT_MAP_LOCATION.country,
    },
  );

  useEffect(() => {
    if (step === ADDRESS_FLOW_STEPS.FORM && editId && !editingAddress) {
      navigateToStep(ADDRESS_FLOW_STEPS.LIST);
      return;
    }

    if (
      step === ADDRESS_FLOW_STEPS.SEARCH ||
      step === ADDRESS_FLOW_STEPS.MAP ||
      step === ADDRESS_FLOW_STEPS.FORM
    ) {
      const storedDraft = readAddressFlowDraft();

      if (storedDraft) {
        setDraftLocation(storedDraft);
        return;
      }

      if (step === ADDRESS_FLOW_STEPS.FORM && editingAddress) {
        setDraftLocation(buildDraftFromAddress(editingAddress));
        return;
      }

      if (step === ADDRESS_FLOW_STEPS.MAP || step === ADDRESS_FLOW_STEPS.FORM) {
        navigateToStep(ADDRESS_FLOW_STEPS.SEARCH);
      }

      return;
    }

    if (step === ADDRESS_FLOW_STEPS.LIST) {
      setDraftLocation(DEFAULT_MAP_LOCATION);
    }
  }, [editId, editingAddress, navigateToStep, step]);

  const resetFlow = () => {
    navigateToStep(ADDRESS_FLOW_STEPS.LIST);
  };

  const startAddFlow = () => {
    setDraftLocation(DEFAULT_MAP_LOCATION);
    navigateToStep(ADDRESS_FLOW_STEPS.SEARCH);
  };

  const startEditFlow = (address) => {
    const draft = buildDraftFromAddress(address);
    setDraftLocation(draft);
    navigateToStep(ADDRESS_FLOW_STEPS.FORM, { edit: address.id, draft });
  };

  const handleContinueFromSearch = (location) => {
    setDraftLocation(location);
    navigateToStep(ADDRESS_FLOW_STEPS.MAP, { q: location.searchLine, draft: location });
  };

  const openSearchFromMap = () => {
    navigateToStep(ADDRESS_FLOW_STEPS.SEARCH, {
      q: draftLocation.searchLine || draftLocation.label || "",
      draft: draftLocation,
    });
  };

  const handleContinueToForm = () => {
    navigateToStep(ADDRESS_FLOW_STEPS.FORM, { draft: draftLocation });
  };

  const handleSaveForm = async ({
    name,
    phone,
    fullAddress,
    labelChip,
    customLabel,
    searchLine,
    placeId,
    latitude,
    longitude,
    country,
    state,
    city,
    area,
    pincode,
    street,
    buildingName,
    formattedAddress,
  }) => {
    if (!profile) return;

    setSaving(true);

    const label =
      labelChip === "other"
        ? customLabel || "Other"
        : resolveStoreLabel(labelChip, editingAddress?.label) ||
          getNextLabel(addresses);

    const payload = {
      label,
      name,
      phone,
      addressLine1: searchLine || fullAddress.split(",")[0]?.trim() || fullAddress,
      addressLine2: street || draftLocation.addressLine2 || "",
      area: area || draftLocation.area,
      city: city || draftLocation.city,
      state: state || draftLocation.state,
      country: country || draftLocation.country || "India",
      pincode: pincode || draftLocation.pincode,
      latitude: latitude ?? draftLocation.latitude,
      longitude: longitude ?? draftLocation.longitude,
      placeId: placeId || draftLocation.placeId || "",
      street: street || draftLocation.street || "",
      buildingName: buildingName || draftLocation.buildingName || "",
      formattedAddress: formattedAddress || fullAddress,
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

    navigateToStep(ADDRESS_FLOW_STEPS.MAP, { draft: draftLocation });
  };

  const handleUseCurrentLocation = () => {
    const applyLocation = (latitude, longitude) => {
      const location = {
        ...DEFAULT_MAP_LOCATION,
        label: "Current Location",
        searchLine: "Current Location",
        latitude,
        longitude,
      };
      setDraftLocation(location);
      navigateToStep(ADDRESS_FLOW_STEPS.MAP, { draft: location });
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      applyLocation(DEFAULT_MAP_LOCATION.latitude, DEFAULT_MAP_LOCATION.longitude);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        applyLocation(DEFAULT_MAP_LOCATION.latitude, DEFAULT_MAP_LOCATION.longitude);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const formInitialAddress = editingAddress
    ? [editingAddress.addressLine1, editingAddress.addressLine2]
        .filter(Boolean)
        .join(", ")
    : [draftLocation.addressLine1, draftLocation.addressLine2]
        .filter(Boolean)
        .join(", ") || formatAddressPreview(draftLocation);

  return {
    step,
    searchQuery,
    editingAddress,
    draftLocation,
    sortedAddresses,
    currentLocationPreview,
    deleteTarget,
    saving,
    deleting,
    formInitialAddress,
    profile,
    setDeleteTarget,
    resetFlow,
    startAddFlow,
    startEditFlow,
    handleContinueFromSearch,
    openSearchFromMap,
    handleContinueToForm,
    handleSaveForm,
    handleConfirmDelete,
    handleBackFromSearch,
    handleBackFromForm,
    handleUseCurrentLocation,
    navigateToStep,
    getLabelChipId,
    getNextLabel,
  };
}

"use client";

import { Suspense } from "react";

import { AddAddressButton } from "@/components/addresses/add-address-button";
import { AddressFormFlow } from "@/components/addresses/address-form-view";
import { AddressMapFlow } from "@/components/addresses/address-map-view";
import { AddressSearchFlow } from "@/components/addresses/address-search-view";
import { DeleteAddressModal } from "@/components/addresses/delete-address-modal";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import {
  ADDRESS_FLOW_STEPS,
  DEFAULT_MAP_LOCATION,
} from "@/constants/address-flow.constants";
import { useAddressFlowController } from "@/hooks/use-address-flow-controller";

import { LocationDesktop } from "./LocationDesktop";
import { LocationMobile, LocationTablet } from "./LocationMobile";

function LocationListContent() {
  const {
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
  } = useAddressFlowController();

  if (step === ADDRESS_FLOW_STEPS.SEARCH) {
    return (
      <AddressSearchFlow
        initialQuery={searchQuery}
        backLabel={
          sortedAddresses.length > 0 || editingAddress
            ? "Back to Addresses"
            : "Back to Profile"
        }
        onBack={handleBackFromSearch}
        onContinue={handleContinueFromSearch}
        onUseCurrentLocation={handleUseCurrentLocation}
        currentLocationPreview={currentLocationPreview}
        rightAction={<AddAddressButton compact onClick={startAddFlow} />}
      />
    );
  }

  if (step === ADDRESS_FLOW_STEPS.MAP) {
    return (
      <AddressMapFlow
        location={draftLocation}
        saving={false}
        backLabel="Back to Search"
        onBack={() =>
          navigateToStep(ADDRESS_FLOW_STEPS.SEARCH, {
            q: draftLocation.searchLine || draftLocation.label || "",
            draft: draftLocation,
          })
        }
        onEditSearch={openSearchFromMap}
        onSave={handleContinueToForm}
        saveLabel="Save Location"
      />
    );
  }

  if (step === ADDRESS_FLOW_STEPS.FORM) {
    return (
      <AddressFormFlow
        location={draftLocation}
        initialName={editingAddress?.name ?? profile?.name ?? ""}
        initialPhone={editingAddress?.phone ?? profile?.phone ?? ""}
        initialAddress={formInitialAddress}
        initialLabelChip={getLabelChipId(
          editingAddress?.label ?? getNextLabel(sortedAddresses),
        )}
        initialCustomLabel={
          editingAddress && !["Home", "Office"].includes(editingAddress.label)
            ? editingAddress.label
            : ""
        }
        isEditing={Boolean(editingAddress)}
        saving={saving}
        backLabel={editingAddress ? "Back to Addresses" : "Back to Map"}
        onBack={handleBackFromForm}
        onSave={handleSaveForm}
      />
    );
  }

  const defaultAddress =
    sortedAddresses.find((address) => address.isDefault) ?? sortedAddresses[0];

  const listProps = {
    sortedAddresses,
    onEdit: startEditFlow,
    onDelete: setDeleteTarget,
    onSearchFocus: startAddFlow,
    onUseCurrentLocation: handleUseCurrentLocation,
    currentLocationPreview,
    onAddFlow: startAddFlow,
    mapLatitude: defaultAddress?.latitude ?? DEFAULT_MAP_LOCATION.latitude,
    mapLongitude: defaultAddress?.longitude ?? DEFAULT_MAP_LOCATION.longitude,
    mapLabel: defaultAddress?.label ?? "Default location",
  };

  return (
    <>
      <ResponsiveView
        mobile={<LocationMobile {...listProps} />}
        tablet={<LocationTablet {...listProps} />}
        desktop={<LocationDesktop {...listProps} />}
      />
      <DeleteAddressModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </>
  );
}

export function LocationResponsive() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-dvh items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading addresses...</p>
        </div>
      }
    >
      <LocationListContent />
    </Suspense>
  );
}

export default LocationResponsive;

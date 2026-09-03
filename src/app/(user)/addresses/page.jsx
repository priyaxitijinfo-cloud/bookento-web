"use client";

import { Suspense } from "react";

import { AddAddressButton } from "@/components/addresses/add-address-button";
import { AddressFormFlow } from "@/components/addresses/address-form-view";
import { AddressListView } from "@/components/addresses/address-list-view";
import { AddressMapFlow } from "@/components/addresses/address-map-view";
import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { AddressSearchFlow } from "@/components/addresses/address-search-view";
import { DeleteAddressModal } from "@/components/addresses/delete-address-modal";
import { ADDRESS_FLOW_STEPS } from "@/constants/address-flow.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useAddressFlowController } from "@/hooks/use-address-flow-controller";

function AddressesPageContent() {
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
        rightAction={
          <span className="md:hidden">
            <AddAddressButton compact onClick={startAddFlow} />
          </span>
        }
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

  return (
    <>
      <AddressPageShell
        title="My Addresses"
        breadcrumbCurrentLabel="My Addresses"
        backHref={ROUTES.PROFILE}
        rightAction={
          <>
            <span className="md:hidden">
              <AddAddressButton compact onClick={startAddFlow} />
            </span>
            <span className="hidden md:inline-flex">
              <AddAddressButton onClick={startAddFlow} />
            </span>
          </>
        }
      >
        <AddressListView
          addresses={sortedAddresses}
          onEdit={startEditFlow}
          onDelete={setDeleteTarget}
          onSearchFocus={startAddFlow}
          onUseCurrentLocation={handleUseCurrentLocation}
          currentLocationPreview={currentLocationPreview}
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

export default function AddressesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-page flex min-h-dvh items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading addresses...</p>
        </div>
      }
    >
      <AddressesPageContent />
    </Suspense>
  );
}

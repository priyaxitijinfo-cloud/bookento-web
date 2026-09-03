"use client";

import { AddAddressButton } from "@/components/addresses/add-address-button";
import { AddressListView } from "@/components/addresses/address-list-view";
import { AddressPageShell } from "@/components/addresses/address-page-shell";
import { ROUTES } from "@/constants/routes.constants";

export function LocationMobile({
  sortedAddresses,
  onEdit,
  onDelete,
  onSearchFocus,
  onUseCurrentLocation,
  currentLocationPreview,
  onAddFlow,
}) {
  return (
    <AddressPageShell
      title="My Addresses"
      breadcrumbCurrentLabel="My Addresses"
      backHref={ROUTES.PROFILE}
      rightAction={<AddAddressButton compact onClick={onAddFlow} />}
    >
      <AddressListView
        addresses={sortedAddresses}
        onEdit={onEdit}
        onDelete={onDelete}
        onSearchFocus={onSearchFocus}
        onUseCurrentLocation={onUseCurrentLocation}
        currentLocationPreview={currentLocationPreview}
      />
    </AddressPageShell>
  );
}

export function LocationTablet({
  sortedAddresses,
  onEdit,
  onDelete,
  onSearchFocus,
  onUseCurrentLocation,
  currentLocationPreview,
  onAddFlow,
}) {
  return (
    <AddressPageShell
      title="Select Location"
      breadcrumbCurrentLabel="My Addresses"
      backHref={ROUTES.PROFILE}
      rightAction={<AddAddressButton onClick={onAddFlow} />}
    >
      <AddressListView
        addresses={sortedAddresses}
        onEdit={onEdit}
        onDelete={onDelete}
        onSearchFocus={onSearchFocus}
        onUseCurrentLocation={onUseCurrentLocation}
        currentLocationPreview={currentLocationPreview}
      />
    </AddressPageShell>
  );
}

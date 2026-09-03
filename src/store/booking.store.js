import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const initialDraft = {
  providerId: "",
  visitType: null,
  serviceIds: [],
  packageId: null,
  branchId: null,
  addressId: null,
  scheduledDate: null,
  scheduledTime: null,
  paymentMethod: null,
};

function createInitialDraft() {
  return {
    providerId: "",
    visitType: null,
    serviceIds: [],
    packageId: null,
    branchId: null,
    addressId: null,
    scheduledDate: null,
    scheduledTime: null,
    paymentMethod: null,
  };
}

function areServiceIdsEqual(current, next) {
  return (
    current.length === next.length && current.every((id, index) => id === next[index])
  );
}

export const useBookingStore = create(
  devtools(
    persist(
      (set) => ({
        draft: initialDraft,
        currentStep: 0,
        isComplete: false,

        setProviderId: (id) =>
          set((s) => {
            if (s.draft.providerId === id) return s;
            return { draft: { ...s.draft, providerId: id } };
          }),
        setVisitType: (type) =>
          set((s) => {
            if (s.draft.visitType === type) return s;
            return { draft: { ...s.draft, visitType: type } };
          }),
        toggleService: (serviceId) =>
          set((s) => {
            const ids = s.draft.serviceIds.includes(serviceId)
              ? s.draft.serviceIds.filter((id) => id !== serviceId)
              : [...s.draft.serviceIds, serviceId];
            if (
              areServiceIdsEqual(s.draft.serviceIds, ids) &&
              s.draft.packageId === null
            ) {
              return s;
            }
            return { draft: { ...s.draft, serviceIds: ids, packageId: null } };
          }),
        setServices: (serviceIds) =>
          set((s) => {
            if (
              areServiceIdsEqual(s.draft.serviceIds, serviceIds) &&
              s.draft.packageId === null
            ) {
              return s;
            }
            return { draft: { ...s.draft, serviceIds, packageId: null } };
          }),
        setPackageId: (packageId) =>
          set((s) => {
            const normalizedPackageId = packageId ?? null;
            if (
              s.draft.packageId === normalizedPackageId &&
              s.draft.serviceIds.length === 0
            ) {
              return s;
            }
            return {
              draft: { ...s.draft, packageId: normalizedPackageId, serviceIds: [] },
            };
          }),
        setBranchId: (branchId) =>
          set((s) => {
            if (s.draft.branchId === branchId) return s;
            return { draft: { ...s.draft, branchId } };
          }),
        setAddressId: (addressId) =>
          set((s) => {
            if (s.draft.addressId === addressId) return s;
            return { draft: { ...s.draft, addressId } };
          }),
        setScheduledDate: (date) =>
          set((s) => {
            if (s.draft.scheduledDate === date) return s;
            return { draft: { ...s.draft, scheduledDate: date } };
          }),
        setScheduledTime: (time) =>
          set((s) => {
            if (s.draft.scheduledTime === time) return s;
            return { draft: { ...s.draft, scheduledTime: time } };
          }),
        setPaymentMethod: (method) =>
          set((s) => {
            if (s.draft.paymentMethod === method) return s;
            return { draft: { ...s.draft, paymentMethod: method } };
          }),
        setStep: (step) =>
          set((s) => (s.currentStep === step ? s : { currentStep: step })),
        nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
        prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
        completeBooking: () => set((s) => (s.isComplete ? s : { isComplete: true })),
        clearComplete: () => set((s) => (s.isComplete ? { isComplete: false } : s)),
        reset: () =>
          set({ draft: createInitialDraft(), currentStep: 0, isComplete: false }),
      }),
      {
        name: "bookento-booking-flow",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          draft: state.draft,
          currentStep: state.currentStep,
          isComplete: state.isComplete,
        }),
      },
    ),
    { name: "BookingStore" },
  ),
);

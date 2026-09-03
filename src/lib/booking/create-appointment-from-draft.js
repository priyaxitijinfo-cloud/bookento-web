import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { appointments as mockAppointments } from "@/mock/appointments";
import { currentUser } from "@/mock/users";

const VISIT_TYPE_MAP = {
  in_clinic: "onsite",
  online: "online",
  home_visit: "home",
};

function resolveAddress(draft, provider, branch) {
  if (draft.visitType === "online") return null;
  if (draft.visitType === "home_visit") {
    return "Home visit address on file";
  }
  return branch
    ? `${branch.name}, ${branch.city}`
    : `${provider.businessName}, ${provider.city}`;
}

/** Build and register a user appointment from the active booking draft. */
export function createAppointmentFromDraft({
  draft,
  provider,
  billingServices,
  selectedPackage,
  amountToPay,
}) {
  const primaryService = billingServices[0];
  if (!primaryService || !draft.scheduledDate) return null;

  const visitType = VISIT_TYPE_MAP[draft.visitType] || "onsite";
  const now = new Date().toISOString();
  const bookingNumber = mockAppointments.length + 10234;

  const appointment = {
    id: `apt_${Date.now()}`,
    userId: currentUser.id,
    userName: currentUser.name,
    providerId: provider.id,
    providerName: provider.businessName,
    providerAvatar: provider.avatar,
    serviceId: primaryService.id,
    serviceName: selectedPackage?.name || primaryService.name,
    serviceIds: billingServices.map((service) => service.id),
    packageId: selectedPackage?.id ?? draft.packageId ?? null,
    visitType,
    status: APPOINTMENT_STATUS.CONFIRMED,
    scheduledDate: draft.scheduledDate,
    scheduledTime: draft.scheduledTime || "11:00 AM",
    duration: primaryService.duration || 60,
    amount: amountToPay,
    paymentMethod: draft.paymentMethod,
    paymentStatus: "paid",
    address: resolveAddress(draft, provider, null),
    notes: "",
    bookingCode: `#BK${String(bookingNumber).padStart(5, "0")}`,
    platformFee: selectedPackage ? 0 : 2000,
    locationName: visitType === "home" ? "Home visit" : provider.businessName,
    createdAt: now,
    updatedAt: now,
  };

  mockAppointments.unshift(appointment);
  return appointment;
}

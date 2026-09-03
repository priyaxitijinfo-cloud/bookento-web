import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import {
  avatarUrl,
  generateHalfHourSlots,
  generateId,
  isoDate,
  personName,
  timeSlot,
} from "./helpers";
import { packages } from "./packages";
import { mockProviders } from "./providers";
import { services } from "./services";
import { currentUser } from "./users";

const STATUSES = Object.values(APPOINTMENT_STATUS);

const BOOKING_ADDRESSES = [
  "4100 Piedmont, Oakland",
  "123 Home Street, Mumbai",
  "22 Baker Street, London",
  "56 Krishna Row House, Surat",
  "101 Shreeji Heights, Mota Varachha, Surat",
];

export const PLATFORM_FEE = 2000;

export function getPaymentStatusLabel(paymentMethod) {
  switch (paymentMethod) {
    case "card":
      return "Paid via Visa .... 4242";
    case "upi":
      return "Paid via UPI";
    case "wallet":
      return "Paid via Wallet";
    case "net_banking":
      return "Paid via Net Banking";
    default:
      return "Paid";
  }
}

function resolvePackageId(providerId, index) {
  if (index % 4 !== 0) return null;
  const providerPackage = packages.find((pkg) => pkg.providerId === providerId);
  return providerPackage?.id ?? null;
}

function resolveAddress(visitType, provider, index) {
  if (visitType === "online") return null;
  if (visitType === "home") return BOOKING_ADDRESSES[index % BOOKING_ADDRESSES.length];
  return `${provider.businessName}, ${["Mumbai", "Delhi", "Surat", "Oakland"][index % 4]}`;
}

export const appointments = Array.from({ length: 30 }, (_, i) => {
  const provider = mockProviders[i % mockProviders.length];
  const service = services[i % services.length];
  const status = STATUSES[i % STATUSES.length];
  const visitType = ["onsite", "home", "online"][i % 3];
  const date = new Date();
  date.setDate(date.getDate() + (i % 10) - 3);

  return {
    id: generateId("apt", i + 1),
    userId: currentUser.id,
    userName: currentUser.name,
    providerId: provider.id,
    providerName: provider.businessName,
    providerAvatar: provider.avatar,
    serviceId: service.id,
    serviceName: service.name,
    serviceIds: [service.id],
    packageId: resolvePackageId(provider.id, i),
    visitType,
    status,
    scheduledDate: date.toISOString().split("T")[0],
    scheduledTime: timeSlot(9 + (i % 10)),
    duration: service.duration,
    amount: service.price,
    paymentMethod: ["upi", "wallet", "card"][i % 3],
    paymentStatus: status === "cancelled" ? "refunded" : "paid",
    address: resolveAddress(visitType, provider, i),
    notes: i % 4 === 0 ? "Please call before arriving" : "",
    bookingCode: `#BK${String(10234 + i).padStart(5, "0")}`,
    platformFee: PLATFORM_FEE,
    locationName: visitType === "home" ? "Home visit" : provider.businessName,
    createdAt: isoDate(i * 2),
    updatedAt: isoDate(i),
  };
});

const todayIso = new Date().toISOString().split("T")[0];

appointments[0] = {
  ...appointments[0],
  providerName: "Quiet Garden Spa",
  scheduledDate: todayIso,
  scheduledTime: "01:50 PM",
  status: APPOINTMENT_STATUS.UPCOMING,
  serviceName: "Deep Tissue Massage",
  duration: 60,
  visitType: "onsite",
  amount: 17000,
  paymentMethod: "card",
  paymentStatus: "paid",
  bookingCode: "#BK10234",
  address: "4100 Piedmont, Oakland",
  locationName: "Quiet Garden Spa",
};

appointments[1] = {
  ...appointments[1],
  providerName: "Quiet Garden Spa",
  status: APPOINTMENT_STATUS.CONFIRMED,
  serviceName: "Deep Tissue Massage",
  duration: 60,
  scheduledTime: "01:50 PM",
  address: "4100 Piedmont, Oakland",
  locationName: "Quiet Garden Spa",
};

appointments[2] = {
  ...appointments[2],
  providerName: "Dr. Maya Okafor",
  status: APPOINTMENT_STATUS.UPCOMING,
  serviceName: "Annual Check-up",
  scheduledTime: "10:30 AM",
  scheduledDate: todayIso,
  locationName: "Royal Clinic",
  bookingCode: "#BK10236",
  address: "4100 Piedmont, Oakland",
};

appointments[3] = {
  ...appointments[3],
  status: APPOINTMENT_STATUS.CANCELLED,
  providerName: "Quiet Garden Spa",
  serviceName: "Deep Tissue Massage",
  duration: 60,
  address: "4100 Piedmont, Oakland",
};

appointments[4] = {
  ...appointments[4],
  status: APPOINTMENT_STATUS.COMPLETED,
  providerName: "Urban Salon",
  serviceName: "Haircut & Styling",
  duration: 60,
  address: "123 Home Street, Mumbai",
};

export const providerAppointments = Array.from({ length: 25 }, (_, i) => {
  const userName = personName(i);
  const service = services[i % services.length];
  const status = ["pending", "confirmed", "upcoming", "completed", "cancelled"][i % 5];
  const date = new Date();
  date.setDate(date.getDate() + (i % 7) - 2);

  return {
    id: generateId("papt", i + 1),
    userId: generateId("user", i + 1),
    userName,
    userAvatar: avatarUrl(`apt-user-${i}`),
    userPhone: `+91 9${String(800000000 + i).slice(0, 9)}`,
    providerId: mockProviders[0].id,
    serviceName: service.name,
    serviceIds: [service.id],
    visitType: ["onsite", "home", "online"][i % 3],
    status,
    scheduledDate: date.toISOString().split("T")[0],
    scheduledTime: timeSlot(8 + (i % 12)),
    duration: service.duration,
    amount: service.price,
    paymentStatus: "paid",
    createdAt: isoDate(i),
  };
});

providerAppointments[0] = {
  ...providerAppointments[0],
  userName: "Alex Sharma",
  serviceName: "Haircut & Styling",
  status: "upcoming",
  scheduledDate: todayIso,
  scheduledTime: "10:30 AM",
};

providerAppointments[1] = {
  ...providerAppointments[1],
  userName: "Sarah Johnson",
  serviceName: "Deep Tissue Massage",
  status: "confirmed",
  scheduledDate: todayIso,
  scheduledTime: "02:00 PM",
};

providerAppointments[2] = {
  ...providerAppointments[2],
  userName: "Emily Wilson",
  serviceName: "Physiotherapy Session",
  status: "pending",
  scheduledDate: todayIso,
  scheduledTime: "04:30 PM",
};

export const timeSlots = generateHalfHourSlots(9, 18).map((slot, i) => ({
  id: generateId("slot", i + 1),
  time: timeSlot(slot.hour, slot.minute),
  available: i % 5 !== 0,
}));

export function getAppointmentById(id) {
  return (
    appointments.find((a) => a.id === id) ||
    providerAppointments.find((a) => a.id === id)
  );
}

export function getUserAppointments(userId) {
  return appointments.filter((a) => a.userId === userId);
}

export function getProviderAppointments(providerId) {
  return providerAppointments.filter((a) => a.providerId === providerId);
}

export function getPendingAppointments() {
  return providerAppointments.filter((a) => a.status === "pending");
}

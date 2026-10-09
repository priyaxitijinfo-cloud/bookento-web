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

const CLINIC_NAMES = [
  "Rockridge Family Health",
  "Royal Clinic",
  "Quiet Garden Spa",
  "Urban Wellness Center",
  "Sunrise Care Clinic",
];

export const providerAppointments = Array.from({ length: 25 }, (_, i) => {
  const userName = personName(i);
  const service = services[i % services.length];
  const status = ["pending", "confirmed", "upcoming", "completed", "cancelled"][i % 5];
  const date = new Date();
  date.setDate(date.getDate() + (i % 7) - 2);
  const slug = userName.toLowerCase().replace(/\s+/g, ".");

  return {
    id: generateId("papt", i + 1),
    userId: generateId("user", i + 1),
    userName,
    userAvatar: avatarUrl(`apt-user-${i}`),
    userPhone: `+91 9${String(800000000 + i).slice(0, 9)}`,
    userEmail: `${slug}@gmail.com`,
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
    bookingCode: `#BK${String(10234 + i).padStart(5, "0")}`,
    locationName: CLINIC_NAMES[i % CLINIC_NAMES.length],
    showBookingId: i % 4 === 0,
    createdAt: isoDate(i),
  };
});

providerAppointments[0] = {
  ...providerAppointments[0],
  userName: "Priya Sharma",
  userPhone: "+91 12345 69874",
  userEmail: "priya.sharma@gmail.com",
  serviceName: "Headache",
  status: "pending",
  visitType: "onsite",
  amount: 899,
  scheduledDate: todayIso,
  scheduledTime: "10:00 AM",
  bookingCode: "#BK10234",
  locationName: "Rockridge Family Health",
};

providerAppointments[1] = {
  ...providerAppointments[1],
  userName: "Amit Kumar",
  userPhone: "+91 12345 69874",
  userEmail: "amit.kumar@gmail.com",
  serviceName: "Headache",
  status: "pending",
  visitType: "online",
  amount: 599,
  scheduledDate: todayIso,
  scheduledTime: "10:00 AM",
  bookingCode: "#BK10235",
};

providerAppointments[2] = {
  ...providerAppointments[2],
  userName: "Dr. Amara Reyes",
  userEmail: "amara.reyes@gmail.com",
  userPhone: "+91 12345 65478",
  serviceName: "Headache",
  status: "upcoming",
  visitType: "onsite",
  scheduledDate: todayIso,
  scheduledTime: "10:00 AM",
  bookingCode: "#BK10236",
  locationName: "Rockridge Family Health",
};

providerAppointments[3] = {
  ...providerAppointments[3],
  userName: "Dr. Amara Reyes",
  userEmail: "amara.reyes@gmail.com",
  serviceName: "Headache",
  status: "confirmed",
  visitType: "online",
  scheduledDate: todayIso,
  scheduledTime: "11:30 AM",
  bookingCode: "#BK10237",
};

providerAppointments[4] = {
  ...providerAppointments[4],
  userName: "Dr. Amara Reyes",
  userEmail: "amara.reyes@gmail.com",
  serviceName: "Headache",
  status: "upcoming",
  visitType: "home",
  scheduledDate: todayIso,
  scheduledTime: "01:00 PM",
  bookingCode: "#BK10238",
  showBookingId: true,
};

providerAppointments[5] = {
  ...providerAppointments[5],
  userName: "Dr. Amara Reyes",
  userEmail: "amara.reyes@gmail.com",
  serviceName: "Headache",
  status: "confirmed",
  visitType: "onsite",
  scheduledDate: todayIso,
  scheduledTime: "03:30 PM",
  bookingCode: "#BK10239",
  showBookingId: true,
};

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 1);
const nextWeekIso = nextWeek.toISOString().split("T")[0];
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoIso = twoDaysAgo.toISOString().split("T")[0];

providerAppointments[6] = {
  ...providerAppointments[6],
  userName: "Abhi Mehta",
  userAvatar: avatarUrl("abhi-mehta"),
  userPhone: "+91 12345 65478",
  userEmail: "abhi.mehta@gmail.com",
  serviceName: "Headache",
  status: "upcoming",
  visitType: "onsite",
  scheduledDate: todayIso,
  scheduledTime: "10:30 AM",
  amount: 899,
  bookingCode: "#BK10234",
  locationName: "Rockridge Family Health",
  showBookingId: true,
};

providerAppointments[7] = {
  ...providerAppointments[7],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "completed",
  visitType: "onsite",
  scheduledDate: todayIso,
  scheduledTime: "10:00 AM",
  bookingCode: "#BK10240",
};

providerAppointments[8] = {
  ...providerAppointments[8],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "completed",
  visitType: "online",
  scheduledDate: todayIso,
  scheduledTime: "04:00 AM",
  bookingCode: "#BK10234",
  showBookingId: true,
};

providerAppointments[9] = {
  ...providerAppointments[9],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "cancelled",
  visitType: "onsite",
  scheduledDate: todayIso,
  scheduledTime: "10:00 AM",
  bookingCode: "#BK10241",
  unavailableReason:
    "The selected healthcare provider is currently unavailable to provide the requested service. Please choose another provider or reschedule your appointment to a different available time.",
};

providerAppointments[10] = {
  ...providerAppointments[10],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "cancelled",
  visitType: "online",
  scheduledDate: nextWeekIso,
  scheduledTime: "11:30 AM",
  bookingCode: "#BK10242",
  unavailableReason:
    "The selected healthcare provider is currently unavailable to provide the requested service. Please choose another provider or reschedule your appointment to a different available time.",
};

providerAppointments[11] = {
  ...providerAppointments[11],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "completed",
  visitType: "home",
  scheduledDate: nextWeekIso,
  scheduledTime: "01:00 PM",
  bookingCode: "#BK10243",
};

providerAppointments[12] = {
  ...providerAppointments[12],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "upcoming",
  visitType: "online",
  scheduledDate: nextWeekIso,
  scheduledTime: "10:00 AM",
  bookingCode: "#BK10244",
};

providerAppointments[13] = {
  ...providerAppointments[13],
  userName: "Dr. Amara Reyes",
  serviceName: "Headache",
  status: "cancelled",
  visitType: "onsite",
  scheduledDate: twoDaysAgoIso,
  scheduledTime: "03:30 PM",
  bookingCode: "#BK10245",
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

import { generateId, isoDate } from "./helpers";
import { appointments } from "./appointments";
import { mockProviders } from "./providers";

const providerNames = mockProviders.slice(0, 6).map((provider) => provider.businessName);

function isoHoursAgo(hours = 0) {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

const DESIGN_NOTIFICATIONS = [
  {
    id: generateId("notif", 1),
    type: "booking",
    title: "Haircut with Saffron & Stone",
    message: "Tomorrow at 10:00 AM · Tap to add to your calendar...",
    actorName: "Kai North",
    actorInitials: "KN",
    isRead: false,
    actionUrl: `/appointments/${appointments[0]?.id ?? ""}`,
    createdAt: isoHoursAgo(2),
  },
  {
    id: generateId("notif", 2),
    type: "chat",
    title: "New message from Saffron & Stone",
    message: "Looking forward to seeing you tomorrow! Let us know if you need anything...",
    actorName: "Kai North",
    actorInitials: "KN",
    isRead: false,
    actionUrl: "/chats",
    createdAt: isoHoursAgo(5),
  },
  {
    id: generateId("notif", 3),
    type: "promo",
    title: "20% off your next visit",
    message: "Valid until Sunday. Show this offer at checkout to redeem...",
    actorName: "Kai North",
    actorInitials: "KN",
    isRead: false,
    actionUrl: "/providers",
    createdAt: isoHoursAgo(8),
  },
  {
    id: generateId("notif", 4),
    type: "booking",
    title: "Booking confirmed",
    message: "Your appointment has been confirmed. See you soon!",
    actorName: "Kai North",
    actorInitials: "KN",
    isRead: true,
    actionUrl: `/appointments/${appointments[1]?.id ?? ""}`,
    createdAt: isoHoursAgo(26),
  },
  {
    id: generateId("notif", 5),
    type: "chat",
    title: "Reply from Saffron & Stone",
    message: "Thanks for booking with us. Parking is available behind the salon.",
    actorName: "Kai North",
    actorInitials: "KN",
    isRead: true,
    actionUrl: "/chats",
    createdAt: isoHoursAgo(30),
  },
];

export const notifications = [
  ...DESIGN_NOTIFICATIONS,
  ...Array.from({ length: 20 }, (_, i) => {
    const linkedAppointment = appointments[i % appointments.length];
    const type = ["booking", "payment", "promo", "chat", "system", "review"][i % 6];
    const provider = providerNames[i % providerNames.length];
    const initials = provider
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      id: generateId("notif", i + 6),
      type,
      title: [
        `Appointment with ${provider}`,
        "Payment Received",
        `Special offer from ${provider}`,
        `New message from ${provider}`,
        "Account Update",
        "New Review",
      ][i % 6],
      message: [
        `Your appointment with ${linkedAppointment.providerName} is confirmed for ${linkedAppointment.scheduledTime}.`,
        `Payment of ₹${linkedAppointment.amount.toLocaleString("en-IN")} received successfully.`,
        `Get 20% off your next booking at ${provider}. Limited time offer!`,
        `You have a new message from ${linkedAppointment.providerName}.`,
        "Your profile has been updated successfully.",
        `Your review for ${linkedAppointment.providerName} is now live.`,
      ][i % 6],
      actorName: provider,
      actorInitials: initials,
      isRead: true,
      actionUrl: type === "booking"
        ? `/appointments/${linkedAppointment.id}`
        : ["/appointments", "/wallet", "/providers", "/chats", "/profile", "/reviews"][i % 6],
      createdAt: isoDate(i + 2),
    };
  }),
];

export const providerNotifications = Array.from({ length: 20 }, (_, i) => {
  const linkedAppointment = appointments[i % appointments.length];

  return {
    id: generateId("pnotif", i + 1),
    type: ["booking", "payment", "chat", "review", "system"][i % 5],
    title: [
      "New Booking Request",
      "Payout Processed",
      "Customer Message",
      "New 5-Star Review",
      "Profile Verified",
    ][i % 5],
    message: [
      `New booking request from ${linkedAppointment.userName} for ${linkedAppointment.serviceName}.`,
      "₹15,000 has been transferred to your bank account.",
      `${linkedAppointment.userName} sent you a message about ${linkedAppointment.serviceName}.`,
      "You received a glowing 5-star review from a recent customer!",
      "Your business profile is now verified.",
    ][i % 5],
    isRead: i > 4,
    actionUrl: ["/provider/appointments", "/provider/earnings", "/provider/chats", "/provider/ratings", "/provider/profile"][i % 5],
    createdAt: isoDate(i),
  };
});

import { appointments } from "@/mock/appointments";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";

const CALLABLE_STATUSES = [
  APPOINTMENT_STATUS.CONFIRMED,
  APPOINTMENT_STATUS.UPCOMING,
  APPOINTMENT_STATUS.PENDING,
];

/** Whether a voice/video call is allowed for the given appointment schedule. */
export function canStartCall(scheduledDate, scheduledTime) {
  const match = scheduledTime?.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match || !scheduledDate) return false;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const appointmentDate = new Date(`${scheduledDate}T00:00:00`);
  appointmentDate.setHours(hours, minutes, 0, 0);

  const diffMs = appointmentDate.getTime() - Date.now();
  return diffMs <= 10 * 60 * 1000 && diffMs >= -60 * 60 * 1000;
}

/** Find the most relevant appointment linked to a chat participant (provider). */
export function findLinkedAppointment(providerId) {
  if (!providerId) return null;

  const linked = appointments.filter(
    (apt) => apt.providerId === providerId && CALLABLE_STATUSES.includes(apt.status),
  );

  if (linked.length === 0) {
    return appointments.find((apt) => apt.providerId === providerId) ?? null;
  }

  return [...linked].sort(
    (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate),
  )[0];
}

export function formatCallDuration(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Minutes until appointment start, or null if schedule cannot be parsed. */
export function getMinutesUntilAppointment(scheduledDate, scheduledTime) {
  const match = scheduledTime?.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match || !scheduledDate) return null;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const appointmentDate = new Date(`${scheduledDate}T00:00:00`);
  appointmentDate.setHours(hours, minutes, 0, 0);

  return Math.max(0, Math.round((appointmentDate.getTime() - Date.now()) / 60_000));
}

export function filterConversations(conversations, { filter = "all", search = "" } = {}) {
  let list = [...conversations];

  if (filter === "unread") {
    list = list.filter((c) => c.unreadCount > 0);
  } else if (filter === "new") {
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    list = list.filter((c) => {
      const age = now - new Date(c.lastMessageAt).getTime();
      return age <= threeDaysMs || c.isPinned;
    });
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (c) =>
        c.participantName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }

  return list.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });
}

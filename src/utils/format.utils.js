import {
  format,
  formatDistanceToNow,
  isToday,
  isValid,
  isYesterday,
  parseISO,
  differenceInCalendarDays,
} from "date-fns";

export function formatCurrency(amount, currency = "INR", locale = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date, pattern = "dd MMM yyyy") {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";
  return format(parsed, pattern);
}

export function formatRelativeTime(date) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

/** Compact relative time for notification lists: 2h ago, 5h ago, 1d ago */
export function formatCompactRelativeTime(date) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - parsed.getTime()) / 1000));
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return format(parsed, "dd MMM");
}

/** Chat list timestamp: today → time, yesterday → Yesterday, else weekday / date */
export function formatChatListTime(date) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";

  if (isToday(parsed)) return format(parsed, "HH:mm");
  if (isYesterday(parsed)) return "Yesterday";
  if (differenceInCalendarDays(new Date(), parsed) < 7) return format(parsed, "EEE");
  return format(parsed, "dd MMM");
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getLocalDateKey(date = new Date()) {
  const value = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(value)) return "";
  return format(value, "yyyy-MM-dd");
}

export function isTodayDate(dateKey) {
  return dateKey === getLocalDateKey(new Date());
}

export function formatBookingDateLabel(dateKey) {
  if (!dateKey) return "";
  if (isTodayDate(dateKey)) return "Today";
  return formatDate(dateKey, "dd MMM");
}

export function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function calculateDiscountedPrice(basePrice, discountType, discountValue) {
  if (discountType === "percentage") {
    return Math.round(basePrice - (basePrice * discountValue) / 100);
  }
  return Math.max(0, basePrice - discountValue);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createMockToken(payload) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 86400,
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  return `${header}.${body}.mock`;
}

export function setAuthCookie(name, value, maxAge = 86400) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

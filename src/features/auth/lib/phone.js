export function nationalDigits(phone = "") {
  return String(phone).replace(/\D/g, "").slice(-10);
}

export function formatNationalPhone(digits = "") {
  const clean = String(digits).replace(/\D/g, "").slice(0, 10);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}

export function parseNationalPhone(phone = "", dialCode = "+91") {
  const escaped = dialCode.replace("+", "\\+");
  return phone
    .replace(new RegExp(`^${escaped}\\s*`, "i"), "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

export function formatFullPhone(dialCode, phone) {
  const national = nationalDigits(phone);
  if (!national) return dialCode;
  return `${dialCode} ${formatNationalPhone(national)}`;
}

export function formatOtpTimer(seconds) {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

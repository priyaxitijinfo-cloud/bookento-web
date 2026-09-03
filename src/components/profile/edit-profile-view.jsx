"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { Avatar } from "@/components/ui/avatar";
import { RadioIndicator } from "@/components/ui/radio-indicator";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { countries, indianStates } from "@/mock/languages";
import { useUserProfileStore } from "@/store";
import { getLocalDateKey } from "@/utils/format.utils";

const FIELD_CLASS =
  "h-14 w-full rounded-xl border border-[#F2F2F2] bg-white px-4 text-[15px] text-[#111827] shadow-[0_2px_12px_rgba(15,23,42,0.04)] outline-none placeholder:text-[#ADB3B7] focus-visible:ring-2 focus-visible:ring-primary/25";

function CountryFlag({ code, className }) {
  if (code === "IN") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id="edit-in-flag-clip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
        <g clipPath="url(#edit-in-flag-clip)">
          <rect width="24" height="8" fill="#FF9933" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#138808" />
          <circle cx="12" cy="12" r="2.4" fill="#000080" />
          <circle cx="12" cy="12" r="1.55" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="0.6" fill="#000080" />
        </g>
      </svg>
    );
  }

  const emoji = { US: "🇺🇸", GB: "🇬🇧", AE: "🇦🇪", SG: "🇸🇬" }[code] ?? "🏳️";

  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full bg-[#EEF2F7] text-[13px] leading-none",
        className,
      )}
      aria-hidden
    >
      {emoji}
    </span>
  );
}

function CalendarGlyph({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g clipPath="url(#edit-dob-cal-clip)">
        <path
          d="M21.3867 1.5376H2.61333C1.17003 1.5376 0 2.79213 0 4.33967V8.04223H24V4.33969C24 2.79213 22.83 1.5376 21.3867 1.5376Z"
          fill="url(#edit-dob-cal-g0)"
          fillOpacity="0.5"
        />
        <path
          d="M7.91565 4.62818C7.91565 5.51905 7.24211 6.24124 6.41126 6.24124C5.58041 6.24124 4.90686 5.51905 4.90686 4.62818C4.90686 3.73732 5.58041 3.01514 6.41126 3.01514C7.24211 3.01514 7.91565 3.73732 7.91565 4.62818ZM18.9667 4.62818C18.9667 5.51905 18.2931 6.24124 17.4623 6.24124C16.6313 6.24124 15.9579 5.51905 15.9579 4.62818C15.9579 3.73732 16.6313 3.01514 17.4623 3.01514C18.2931 3.01514 18.9667 3.73732 18.9667 4.62818Z"
          fill="white"
        />
        <path
          d="M2.61333 23.9999H21.3867C22.83 23.9999 24 22.7454 24 21.1978V8.04248H0V21.1978C0 22.7454 1.17003 23.9999 2.61333 23.9999Z"
          fill="#DDEBFF"
        />
        <path
          d="M5.30051 1.19094C5.30051 0.533212 5.7978 0 6.41123 0C7.02467 0 7.52196 0.533197 7.52196 1.19094V4.35675C7.52196 5.01449 7.02467 5.54769 6.41123 5.54769C5.7978 5.54769 5.30051 5.01449 5.30051 4.35675V1.19094Z"
          fill="#76ADFF"
        />
        <path
          d="M16.3515 1.19094C16.3515 0.533212 16.8488 0 17.4623 0C18.0756 0 18.5729 0.533197 18.5729 1.19094V4.35675C18.5729 5.01449 18.0756 5.54769 17.4623 5.54769C16.8488 5.54769 16.3515 5.01449 16.3515 4.35675V1.19094Z"
          fill="#76ADFF"
        />
        <path
          d="M7.77334 14.6586V11.0853C7.77334 10.8893 7.67435 10.7182 7.52724 10.6267V14.7248C7.52724 14.8709 7.41706 14.9894 7.28115 14.9894H3.57462C3.66482 15.1105 3.80343 15.188 3.95886 15.188H7.28115C7.55298 15.188 7.77334 14.9509 7.77334 14.6586Z"
          fill="#539AFD"
          fillOpacity="0.4"
        />
        <path
          d="M7.77334 20.5917V17.0184C7.77334 16.8224 7.67435 16.6513 7.52724 16.5598V20.6579C7.52724 20.804 7.41706 20.9225 7.28115 20.9225H3.57462C3.66482 21.0436 3.80343 21.1211 3.95886 21.1211H7.28115C7.55298 21.1211 7.77334 20.884 7.77334 20.5917Z"
          fill="#539AFD"
          fillOpacity="0.4"
        />
        <path
          d="M14.1333 14.6586V11.0853C14.1333 10.8893 14.0344 10.7182 13.8872 10.6267V14.7248C13.8872 14.8709 13.7771 14.9894 13.6412 14.9894H9.9346C10.0248 15.1105 10.1634 15.188 10.3188 15.188H13.6412C13.9129 15.188 14.1333 14.9509 14.1333 14.6586Z"
          fill="#539AFD"
          fillOpacity="0.4"
        />
        <path
          d="M14.1333 20.5917V17.0184C14.1333 16.8224 14.0344 16.6513 13.8872 16.5598V20.6579C13.8872 20.804 13.7771 20.9225 13.6412 20.9225H9.9346C10.0248 21.0436 10.1634 21.1211 10.3188 21.1211H13.6412C13.9129 21.1211 14.1333 20.884 14.1333 20.5917Z"
          fill="#539AFD"
          fillOpacity="0.4"
        />
        <path
          d="M20.52 14.6586V11.0853C20.52 10.8893 20.4211 10.7182 20.2739 10.6267V14.7248C20.2739 14.8709 20.1637 14.9894 20.0279 14.9894H16.3213C16.4115 15.1105 16.5501 15.188 16.7055 15.188H20.0279C20.2996 15.188 20.52 14.9509 20.52 14.6586Z"
          fill="#539AFD"
          fillOpacity="0.4"
        />
        <path
          d="M20.52 20.5917V17.0184C20.52 16.8224 20.4211 16.6513 20.2739 16.5598V20.6579C20.2739 20.804 20.1637 20.9225 20.0279 20.9225H16.3213C16.4115 21.0436 16.5501 21.1211 16.7055 21.1211H20.0279C20.2996 21.1211 20.52 20.884 20.52 20.5917Z"
          fill="#539AFD"
          fillOpacity="0.4"
        />
        <path
          d="M7.28115 10.5562H3.95886C3.68703 10.5562 3.46667 10.7932 3.46667 11.0855V14.6588C3.46667 14.7841 3.50707 14.899 3.57462 14.9896H7.28115C7.41706 14.9896 7.52725 14.8711 7.52725 14.725V10.627C7.45485 10.5819 7.37079 10.5562 7.28115 10.5562Z"
          fill="url(#edit-dob-cal-g1)"
        />
        <path
          d="M7.28115 16.489H3.95886C3.68703 16.489 3.46667 16.726 3.46667 17.0184V20.5916C3.46667 20.7169 3.50707 20.8318 3.57462 20.9225H7.28115C7.41706 20.9225 7.52725 20.8039 7.52725 20.6578V16.5598C7.45485 16.5147 7.37079 16.489 7.28115 16.489Z"
          fill="url(#edit-dob-cal-g2)"
        />
        <path
          d="M13.6412 10.5562H10.3188C10.047 10.5562 9.82666 10.7932 9.82666 11.0855V14.6588C9.82666 14.7841 9.86706 14.899 9.93461 14.9896H13.6412C13.7771 14.9896 13.8872 14.8711 13.8872 14.725V10.627C13.8148 10.5819 13.7308 10.5562 13.6412 10.5562Z"
          fill="url(#edit-dob-cal-g3)"
        />
        <path
          d="M13.6412 16.489H10.3188C10.047 16.489 9.82666 16.726 9.82666 17.0184V20.5916C9.82666 20.7169 9.86706 20.8318 9.93461 20.9225H13.6412C13.7771 20.9225 13.8872 20.8039 13.8872 20.6578V16.5598C13.8148 16.5147 13.7308 16.489 13.6412 16.489Z"
          fill="url(#edit-dob-cal-g4)"
        />
        <path
          d="M20.0279 10.5562H16.7055C16.4337 10.5562 16.2133 10.7932 16.2133 11.0855V14.6588C16.2133 14.7841 16.2537 14.899 16.3213 14.9896H20.0279C20.1637 14.9896 20.2739 14.8711 20.2739 14.725V10.627C20.2015 10.5819 20.1175 10.5562 20.0279 10.5562Z"
          fill="url(#edit-dob-cal-g5)"
        />
        <path
          d="M20.0279 16.489H16.7055C16.4337 16.489 16.2133 16.726 16.2133 17.0184V20.5916C16.2133 20.7169 16.2537 20.8318 16.3213 20.9225H20.0279C20.1637 20.9225 20.2739 20.8039 20.2739 20.6578V16.5598C20.2015 16.5147 20.1175 16.489 20.0279 16.489Z"
          fill="url(#edit-dob-cal-g7)"
        />
      </g>
      <defs>
        <linearGradient
          id="edit-dob-cal-g0"
          x1="0"
          y1="1.5376"
          x2="3.28458"
          y2="13.6567"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="edit-dob-cal-g1"
          x1="3.46667"
          y1="10.5562"
          x2="7.88311"
          y2="14.6011"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="edit-dob-cal-g2"
          x1="3.46667"
          y1="16.489"
          x2="7.88307"
          y2="20.534"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="edit-dob-cal-g3"
          x1="9.82666"
          y1="10.5562"
          x2="14.2431"
          y2="14.6011"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="edit-dob-cal-g4"
          x1="9.82666"
          y1="16.489"
          x2="14.243"
          y2="20.5339"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="edit-dob-cal-g5"
          x1="16.2133"
          y1="10.5562"
          x2="20.6297"
          y2="14.6011"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="edit-dob-cal-g7"
          x1="16.2133"
          y1="16.489"
          x2="20.6297"
          y2="20.5339"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <clipPath id="edit-dob-cal-clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DobCalendarSheet({ open, value, onSelect, onClose }) {
  const today = startOfDay(new Date());
  const selectedDate = value ? parseISO(`${value}T00:00:00`) : null;
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(
      selectedDate && !Number.isNaN(selectedDate.getTime())
        ? selectedDate
        : new Date(2000, 0, 1),
    ),
  );

  useEffect(() => {
    if (!open) return;
    setVisibleMonth(
      startOfMonth(
        selectedDate && !Number.isNaN(selectedDate.getTime())
          ? selectedDate
          : new Date(2000, 0, 1),
      ),
    );
  }, [open, value]);

  const years = useMemo(() => {
    const currentYear = today.getFullYear();
    return Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);
  }, [today]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [visibleMonth]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close calendar"
      />
      <div className="relative w-full max-w-[22.5rem] rounded-[1.5rem] bg-white px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[1.125rem] font-bold text-[#111827]">Date of Birth</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-[#F2F4F7] text-[#4D5972]"
            aria-label="Close"
          >
            <X className="size-[1.125rem]" strokeWidth={2.25} />
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={visibleMonth.getMonth()}
              onChange={(e) =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), Number(e.target.value), 1),
                )
              }
              className="rounded-lg bg-[#F4F8FF] px-2 py-1.5 text-sm font-semibold text-[#111827] outline-none"
            >
              {Array.from({ length: 12 }, (_, month) => (
                <option key={month} value={month}>
                  {format(new Date(2000, month, 1), "MMMM")}
                </option>
              ))}
            </select>
            <select
              value={visibleMonth.getFullYear()}
              onChange={(e) =>
                setVisibleMonth(
                  new Date(Number(e.target.value), visibleMonth.getMonth(), 1),
                )
              }
              className="rounded-lg bg-[#F4F8FF] px-2 py-1.5 text-sm font-semibold text-[#111827] outline-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => subMonths(month, 1))}
              className="flex size-8 items-center justify-center rounded-full text-[#4D5972]"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
              className="flex size-8 items-center justify-center rounded-full text-[#4D5972]"
              aria-label="Next month"
            >
              <ChevronRight className="size-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="mb-1 grid grid-cols-7">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-1 text-center text-xs font-semibold text-[#4D5972]"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const dateKey = getLocalDateKey(day);
            const isCurrentMonth = isSameMonth(day, visibleMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isFuture = isAfter(startOfDay(day), today);

            return (
              <button
                key={dateKey}
                type="button"
                disabled={isFuture}
                onClick={() => {
                  onSelect(dateKey);
                  onClose();
                }}
                className={cn(
                  "flex h-11 items-center justify-center text-sm",
                  !isCurrentMonth && "text-[#CBD5E1]",
                  isCurrentMonth && !isSelected && "text-[#1F2937]",
                  isFuture && "opacity-30",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full",
                    isSelected && "gradient-brand text-white",
                  )}
                >
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CountryPickerSheet({ open, value, onSelect, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close country picker"
      />
      <div className="relative w-full max-w-[22.5rem] overflow-hidden rounded-[1.5rem] bg-white px-2 pt-5 pb-3 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-3 flex items-center justify-between px-3">
          <h2 className="text-[1.125rem] font-bold text-[#111827]">Select country</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-[#F2F4F7] text-[#4D5972]"
            aria-label="Close"
          >
            <X className="size-[1.125rem]" strokeWidth={2.25} />
          </button>
        </div>
        <div className="max-h-[20rem] overflow-y-auto">
          {countries.map((country) => {
            const selected = country.code === value;

            return (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onSelect(country.code);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left",
                  selected && "bg-[#F4F8FF]",
                )}
              >
                <CountryFlag code={country.code} className="size-7 shrink-0" />
                <span className="min-w-0 flex-1 text-[15px] font-medium text-[#111827]">
                  {country.name}
                </span>
                <span className="text-[15px] font-semibold text-[#4D5972]">
                  {country.dialCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GenderCard({ value, label, selected, imageSrc, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className="flex flex-1 items-center gap-3 rounded-xl border border-[#F2F2F2] bg-white px-3.5 py-3 text-left shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
    >
      <img
        src={imageSrc}
        alt=""
        className="size-12 shrink-0 rounded-lg object-cover"
        draggable={false}
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-[15px] font-semibold text-[#111827]">
        {label}
      </span>
      <RadioIndicator selected={selected} />
    </button>
  );
}

function formatDobDisplay(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function parseNationalPhone(phone = "", dialCode = "+91") {
  const escaped = dialCode.replace("+", "\\+");
  return phone
    .replace(new RegExp(`^${escaped}\\s*`, "i"), "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

function formatNationalPhone(digits) {
  const clean = digits.replace(/\D/g, "").slice(0, 10);
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, 5)} ${clean.slice(5)}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function EditProfileView() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { profile, updateProfile } = useUserProfileStore();

  const [name, setName] = useState(profile.name ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryCode, setCountryCode] = useState(() => {
    const match = [...countries]
      .sort((a, b) => b.dialCode.length - a.dialCode.length)
      .find((country) => profile.phone?.startsWith(country.dialCode));
    return match?.code ?? "IN";
  });
  const selectedCountry =
    countries.find((country) => country.code === countryCode) ?? countries[0];
  const [phone, setPhone] = useState(
    parseNationalPhone(profile.phone, selectedCountry.dialCode),
  );
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth ?? "");
  const [dobOpen, setDobOpen] = useState(false);
  const [gender, setGender] = useState(profile.gender ?? "male");
  const [avatar, setAvatar] = useState(profile.avatar ?? "");
  const [stateName, setStateName] = useState(profile.state ?? "");
  const [stateOpen, setStateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const displayName = useMemo(() => name.trim() || profile.name, [name, profile.name]);
  const displayEmail = useMemo(
    () => email.trim() || profile.email,
    [email, profile.email],
  );

  const stateOptions = useMemo(
    () => [
      "Gujarat",
      "Maharashtra",
      "Rajasthan",
      "Karnataka",
      ...indianStates.filter(
        (s) => !["Gujarat", "Maharashtra", "Rajasthan", "Karnataka"].includes(s),
      ),
    ],
    [],
  );

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatar(dataUrl);
      toast.success("Photo updated");
    } catch {
      toast.error("Could not update photo");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Enter your full name");
      return;
    }
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }

    setSaving(true);
    try {
      const national = phone.replace(/\D/g, "");
      const result = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: national
          ? `${selectedCountry.dialCode} ${formatNationalPhone(national)}`
          : profile.phone,
        dateOfBirth: dateOfBirth || profile.dateOfBirth,
        gender,
        state: stateName || profile.state,
        avatar: avatar || profile.avatar,
      });

      if (result?.success === false) {
        toast.error("Could not save profile");
        return;
      }

      toast.success("Profile updated");
      router.push(ROUTES.PROFILE);
    } catch {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <UserPageShell
        title="Edit Profile"
        backHref={ROUTES.PROFILE}
        backLabel="Back to Profile"
        showBottomNav={false}
        showDesktopHeader={true}
        showBreadcrumb={true}
        containerVariant="browseWithBreadcrumb"
        className="bg-surface-page max-md:!pb-6"
        mainClassName="mx-auto max-w-lg space-y-5 px-4 pb-28 pt-2 max-md:!pt-4 md:!pt-2"
      >
        <div className="flex flex-col items-center pt-1 text-center">
          <div className="relative">
            <Avatar
              src={avatar}
              name={displayName}
              size="xl"
              className="size-[8.25rem] text-2xl shadow-[0_8px_24px_rgba(15,23,42,0.12)] ring-4 ring-white"
            />
            <label
              className="gradient-brand absolute right-0 bottom-0 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-white shadow-[0_4px_12px_rgba(24,101,234,0.35)]"
              aria-label="Change profile photo"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none size-[18px]"
                aria-hidden
              >
                <path
                  d="M14.0758 3.66689H11.7626V3.42924C11.7626 2.36754 10.9009 1.50586 9.83918 1.50586H6.16039C5.65031 1.50597 5.16116 1.70865 4.80048 2.06933C4.4398 2.43001 4.23712 2.91917 4.237 3.42924V3.66689H1.92339C1.41327 3.66689 0.924051 3.86953 0.563346 4.23024C0.202642 4.59094 0 5.08016 0 5.59027L0 12.5717C0 13.6334 0.861249 14.4951 1.92339 14.4951H14.0766C15.1388 14.4951 16 13.6334 16 12.5717V5.59027C15.9997 5.08012 15.7968 4.59096 15.436 4.23031C15.0752 3.86965 14.5859 3.667 14.0758 3.66689ZM7.99915 12.4999C5.99541 12.4999 4.36608 10.8706 4.36608 8.86687C4.36608 6.86356 5.99541 5.23381 7.99915 5.23381C10.0029 5.23381 11.6322 6.86313 11.6322 8.86687C11.6322 10.8706 10.0025 12.4999 7.99915 12.4999ZM9.92253 8.86687C9.92253 9.92644 9.05914 10.7903 7.99915 10.7903C6.93915 10.7903 6.07576 9.92644 6.07576 8.86687C6.07576 7.80687 6.93915 6.94348 7.99915 6.94348C9.05914 6.94348 9.92253 7.80687 9.92253 8.86687Z"
                  fill="#FFFFFF"
                />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          <h2 className="mt-5 text-[1.25rem] leading-tight font-bold text-[#111827]">
            {displayName}
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">{displayEmail}</p>
        </div>

        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-[10px]">
            <span className="text-[15px] leading-none font-medium text-[#334155]">
              Full Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="XYZ"
              className={FIELD_CLASS}
            />
          </label>

          <label className="flex flex-col gap-[10px]">
            <span className="text-[15px] leading-none font-medium text-[#334155]">
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="XYZ123@gmail.com"
              className={FIELD_CLASS}
            />
          </label>

          <div className="flex flex-col gap-[14px]">
            <span className="text-[15px] leading-none font-medium text-[#334155]">
              Phone number
            </span>
            <div className="focus-within:ring-primary/25 flex h-14 items-center rounded-2xl border border-[#F2F2F2] bg-white p-1.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] focus-within:ring-2">
              <button
                type="button"
                onClick={() => setCountryOpen(true)}
                className="inline-flex h-full shrink-0 items-center gap-1.5 rounded-xl bg-[#F3F6FB] px-2.5"
                aria-label="Select country code"
              >
                <CountryFlag code={selectedCountry.code} className="size-6 shrink-0" />
                <span className="h-4 w-px bg-[#D5DCE6]" aria-hidden />
                <span className="text-[15px] font-medium text-[#334155]">
                  {selectedCountry.dialCode}
                </span>
                <svg
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                  aria-hidden
                  className="ml-0.5"
                >
                  <path d="M0.8 0.6L4 4.2L7.2 0.6H0.8Z" fill="#4D5972" />
                </svg>
              </button>
              <input
                type="tel"
                inputMode="numeric"
                value={formatNationalPhone(phone)}
                onChange={(e) =>
                  setPhone(parseNationalPhone(e.target.value, selectedCountry.dialCode))
                }
                placeholder="12345 67890"
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[15px] text-[#111827] outline-none placeholder:text-[#ADB3B7]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <span className="text-[15px] leading-none font-medium text-[#334155]">
              Date of Birth
            </span>
            <button
              type="button"
              onClick={() => setDobOpen(true)}
              className={cn(FIELD_CLASS, "flex items-center justify-between text-left")}
            >
              <span className={dateOfBirth ? "text-[#111827]" : "text-[#ADB3B7]"}>
                {dateOfBirth ? formatDobDisplay(dateOfBirth) : "DD/MM/YYYY"}
              </span>
              <CalendarGlyph className="size-5 shrink-0" />
            </button>
          </div>

          <div className="flex flex-col gap-[10px]">
            <span className="text-[15px] leading-none font-medium text-[#334155]">
              Gender
            </span>
            <div className="flex gap-3">
              <GenderCard
                value="male"
                label="Male"
                selected={gender === "male"}
                imageSrc="/icons/male.png?v=2"
                onSelect={setGender}
              />
              <GenderCard
                value="female"
                label="Female"
                selected={gender === "female"}
                imageSrc="/icons/female.png?v=2"
                onSelect={setGender}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <span className="text-[15px] leading-none font-medium text-[#334155]">
              Select Country
            </span>
            <button
              type="button"
              onClick={() => setStateOpen((open) => !open)}
              className={cn(FIELD_CLASS, "flex items-center justify-between text-left")}
              aria-expanded={stateOpen}
            >
              <span className={stateName ? "text-[#111827]" : "text-[#ADB3B7]"}>
                {stateName || "Select Country"}
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                aria-hidden
                className={cn(
                  "shrink-0 transition-transform",
                  stateOpen && "rotate-180",
                )}
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="#4D5972"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {stateOpen ? (
              <div className="overflow-hidden rounded-xl border border-[#F2F2F2] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                {stateOptions.map((option) => {
                  const selected = option === stateName;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setStateName(option);
                        setStateOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-4 py-2.5 text-left text-[15px] font-medium text-[#111827]",
                        selected && "text-primary bg-[#F4F8FF]",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#F7F8FC] via-[#F7F8FC]/95 to-transparent px-4 pt-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:border-t md:border-[#E6EAF2] md:bg-white md:bg-none md:px-6 md:py-4 md:pb-4">
          <div className="mx-auto w-full max-w-lg md:max-w-7xl">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="gradient-brand flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 md:h-[3.25rem] md:text-base"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </UserPageShell>

      <DobCalendarSheet
        open={dobOpen}
        value={dateOfBirth}
        onSelect={setDateOfBirth}
        onClose={() => setDobOpen(false)}
      />
      <CountryPickerSheet
        open={countryOpen}
        value={countryCode}
        onSelect={setCountryCode}
        onClose={() => setCountryOpen(false)}
      />
    </>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
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
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { RadioIndicator } from "@/components/ui/radio-indicator";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import { LoginIllustration } from "@/features/auth/components/auth-illustrations";
import {
  AuthMobileFrame,
  AuthPrimaryButton,
  AuthWebFrame,
  CountryCodePicker,
  PhoneNumberField,
  useCountry,
} from "@/features/auth/components/auth-shared";
import { cn } from "@/lib/utils";
import { countries, indianStates } from "@/mock/languages";
import { useUserAuthStore, useUserProfileStore } from "@/store";
import { getLocalDateKey } from "@/utils/format.utils";

const FIELD_CLASS =
  "h-14 w-full rounded-2xl border border-[#F2F2F2] bg-white px-4 text-[15px] text-[#111827] shadow-[0_2px_12px_rgba(15,23,42,0.04)] outline-none placeholder:text-[#ADB3B7] focus-visible:ring-2 focus-visible:ring-primary/25";

const WEB_FIELD_CLASS =
  "h-12 w-full rounded-xl border border-[#E6EAF2] bg-white px-4 text-sm text-[#111827] outline-none placeholder:text-[#ADB3B7] focus-visible:ring-2 focus-visible:ring-primary/20";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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
      <rect x="3" y="5" width="18" height="16" rx="3" fill="#DDEBFF" />
      <rect x="3" y="5" width="18" height="5" rx="3" fill="#76ADFF" />
      <rect x="7" y="2" width="2" height="5" rx="1" fill="#76ADFF" />
      <rect x="15" y="2" width="2" height="5" rx="1" fill="#76ADFF" />
    </svg>
  );
}

function GenderCard({ value, label, selected, imageSrc, onSelect, compact = false }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={cn(
        "flex flex-1 items-center gap-3 text-left",
        compact
          ? "h-12 rounded-xl border border-[#E6EAF2] bg-white px-3"
          : "rounded-xl border border-[#F2F2F2] bg-white px-3.5 py-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
      )}
    >
      <img
        src={imageSrc}
        alt=""
        className={cn(
          "shrink-0 rounded-lg object-cover",
          compact ? "size-9" : "size-12",
        )}
        draggable={false}
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-[15px] font-semibold text-[#111827]">
        {label}
      </span>
      <RadioIndicator selected={selected} variant={compact ? "responsive" : "app"} />
    </button>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close calendar"
      />
      <div className="relative w-full max-w-[22.5rem] rounded-t-[1.5rem] bg-white px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.22)] sm:rounded-[1.5rem]">
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

function formatDobDisplay(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function RegisterFields({
  variant,
  name,
  setName,
  country,
  phone,
  onPhoneChange,
  onCountryClick,
  dateOfBirth,
  onDobClick,
  onDobChange,
  gender,
  setGender,
  stateName,
  setStateName,
  stateOpen,
  setStateOpen,
  errors,
  loading,
  onSubmit,
}) {
  const isWeb = variant === "web";
  const fieldClass = isWeb ? WEB_FIELD_CLASS : FIELD_CLASS;
  const stateOptions = indianStates;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className={isWeb ? "grid gap-5 sm:grid-cols-2" : "flex flex-col gap-5"}>
        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-medium text-[#334155]">Full Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className={fieldClass}
          />
          {errors.name ? (
            <p className="text-destructive text-xs">{errors.name}</p>
          ) : null}
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[15px] font-medium text-[#334155]">Phone Number</span>
          <PhoneNumberField
            variant={variant}
            country={country}
            phone={phone}
            onPhoneChange={onPhoneChange}
            onCountryClick={onCountryClick}
            error={errors.phone}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-medium text-[#334155]">Date Of Birth</span>
        {isWeb ? (
          <input
            type="date"
            value={dateOfBirth}
            max={getLocalDateKey(new Date())}
            onChange={(e) => onDobChange(e.target.value)}
            className={cn(fieldClass, !dateOfBirth && "text-[#ADB3B7]")}
          />
        ) : (
          <button
            type="button"
            onClick={onDobClick}
            className={cn(fieldClass, "flex items-center justify-between text-left")}
          >
            <span className={dateOfBirth ? "text-[#111827]" : "text-[#ADB3B7]"}>
              {dateOfBirth ? formatDobDisplay(dateOfBirth) : "Your Date Of Birth"}
            </span>
            <CalendarGlyph className="size-5 shrink-0" />
          </button>
        )}
        {errors.dateOfBirth ? (
          <p className="text-destructive text-xs">{errors.dateOfBirth}</p>
        ) : null}
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[15px] font-medium text-[#334155]">Gender</span>
        <div className="flex gap-3">
          <GenderCard
            value="male"
            label="Male"
            selected={gender === "male"}
            imageSrc="/icons/male.png?v=2"
            onSelect={setGender}
            compact={isWeb}
          />
          <GenderCard
            value="female"
            label="Female"
            selected={gender === "female"}
            imageSrc="/icons/female.png?v=2"
            onSelect={setGender}
            compact={isWeb}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[15px] font-medium text-[#334155]">Select Country</span>
        {isWeb ? (
          <select
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
            className={cn(fieldClass, !stateName && "text-[#ADB3B7]")}
          >
            <option value="">Select Country</option>
            {stateOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStateOpen((open) => !open)}
              className={cn(fieldClass, "flex items-center justify-between text-left")}
              aria-expanded={stateOpen}
            >
              <span className={stateName ? "text-[#111827]" : "text-[#ADB3B7]"}>
                {stateName || "Select Country"}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-[#4D5972] transition-transform",
                  stateOpen && "rotate-180",
                )}
              />
            </button>
            {stateOpen ? (
              <div className="overflow-hidden rounded-xl border border-[#F2F2F2] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                {stateOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setStateName(option);
                      setStateOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center px-4 py-2.5 text-left text-[15px] font-medium text-[#111827]",
                      option === stateName && "text-primary bg-[#F4F8FF]",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        )}
        {errors.stateName ? (
          <p className="text-destructive text-xs">{errors.stateName}</p>
        ) : null}
      </div>

      <AuthPrimaryButton
        type="submit"
        loading={loading}
        variant={isWeb ? "web" : "app"}
        className={isWeb ? "mt-2" : "mt-1"}
      >
        Create Account
      </AuthPrimaryButton>
    </form>
  );
}

export function UserRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeRegistration, isLoading, pendingPhone } = useUserAuthStore();
  const { updateProfile } = useUserProfileStore();
  const initialDial = searchParams.get("dial") || pendingPhone?.dialCode || "+91";
  const initialPhone = searchParams.get("phone") || pendingPhone?.phone || "";
  const redirect = searchParams.get("redirect");

  const initialCountry =
    countries.find((item) => item.dialCode === initialDial)?.code || "IN";

  const { country, countryCode, setCountryCode, pickerOpen, setPickerOpen } =
    useCountry(initialCountry);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(initialPhone.replace(/\D/g, "").slice(-10));
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dobOpen, setDobOpen] = useState(false);
  const [gender, setGender] = useState("male");
  const [stateName, setStateName] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Full name is required";
    if (phone.length < 10) next.phone = "Enter a valid mobile number";
    if (!dateOfBirth) next.dateOfBirth = "Date of birth is required";
    if (!stateName) next.stateName = "Please select a location";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const result = await completeRegistration({
      name: name.trim(),
      phone,
      dialCode: country.dialCode,
      dateOfBirth,
      gender,
      state: stateName,
    });

    if (!result.success) {
      toast.error("Could not create account");
      return;
    }

    await updateProfile(result.profile);
    toast.success("Account created");
    router.push(redirect || ROUTES.HOME);
  };

  const fieldProps = {
    name,
    setName,
    country,
    phone,
    onPhoneChange: setPhone,
    onCountryClick: () => setPickerOpen(true),
    dateOfBirth,
    onDobClick: () => setDobOpen(true),
    onDobChange: setDateOfBirth,
    gender,
    setGender,
    stateName,
    setStateName,
    stateOpen,
    setStateOpen,
    errors,
    loading: isLoading,
    onSubmit: handleSubmit,
  };

  return (
    <>
      <ResponsiveView
        fallback={<PageLoader />}
        mobile={
          <AuthMobileFrame>
            <div className="mb-6 text-center">
              <h1 className="text-[1.75rem] font-bold text-[#111827]">Registration</h1>
              <p className="mt-1 text-sm text-[#98A2B3]">
                Fill in your details to start exploring trusted professionals near you.
              </p>
            </div>
            <RegisterFields variant="app" {...fieldProps} />
          </AuthMobileFrame>
        }
        tablet={
          <AuthWebFrame
            wide
            illustration={<LoginIllustration className="h-44 w-52" />}
            headline="Create your Bookento account"
            copy="A few details help us personalize professionals and bookings for you."
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
                Registration
              </h1>
              <p className="mt-1.5 text-sm text-[#667085]">
                Fill in your details to start exploring trusted professionals near you.
              </p>
            </div>
            <RegisterFields variant="web" {...fieldProps} />
          </AuthWebFrame>
        }
        desktop={
          <AuthWebFrame
            wide
            illustration={<LoginIllustration className="h-52 w-60" />}
            headline="Create your Bookento account"
            copy="A few details help us personalize professionals and bookings for you."
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-[#111827]">
                Registration
              </h1>
              <p className="mt-1.5 text-sm text-[#667085]">
                Fill in your details to start exploring trusted professionals near you.
              </p>
            </div>
            <RegisterFields variant="web" {...fieldProps} />
          </AuthWebFrame>
        }
      />
      <CountryCodePicker
        open={pickerOpen}
        value={countryCode}
        onSelect={setCountryCode}
        onClose={() => setPickerOpen(false)}
      />
      <DobCalendarSheet
        open={dobOpen}
        value={dateOfBirth}
        onSelect={setDateOfBirth}
        onClose={() => setDobOpen(false)}
      />
    </>
  );
}

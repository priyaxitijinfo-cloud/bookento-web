"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Calendar01Icon } from "@/components/icons/calendar01-icon";
import {
  CountryCodePicker,
  CountryFlag,
  useCountry,
} from "@/features/auth/components/auth-shared";
import { ROUTES } from "@/constants/routes.constants";
import { formatNationalPhone, parseNationalPhone } from "@/features/auth/lib/phone";
import { currentProvider } from "@/mock/providers";
import { useProviderAuthStore, useProviderProfileStore } from "@/store";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-12 w-full rounded-xl border border-[#E8EEF8] bg-white px-3.5 text-[14.5px] text-[#111827] outline-none placeholder:text-[#ADB3B7] focus-visible:border-[#1865EA]/40 focus-visible:ring-2 focus-visible:ring-[#1865EA]/15";

const DESC_MAX = 500;

const STATE_OPTIONS = ["Gujarat", "Maharashtra", "Rajasthan", "Karnataka"];
const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
];

const TABS = [
  { id: "profile", label: "Profile Details" },
  { id: "service", label: "Service Details" },
];

function FieldLabel({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[13.5px] font-semibold text-[#1F2937]"
    >
      {children}
    </label>
  );
}

function GenderCard({ value, label, selected, imageSrc, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={cn(
        "flex flex-1 items-center gap-2.5 rounded-2xl border bg-white px-3 py-3 text-left transition-colors",
        selected
          ? "border-[#1865EA] shadow-[0_0_0_1px_rgba(24,101,234,0.12)]"
          : "border-[#E8EEF8]",
      )}
    >
      <Image
        src={imageSrc}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 object-contain"
      />
      <span className="min-w-0 flex-1 text-[14px] font-semibold text-[#0F172A]">
        {label}
      </span>
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white",
          selected ? "border-[#1865EA]" : "border-[#CBD5E1]",
        )}
        aria-hidden
      >
        {selected ? <span className="size-2.5 rounded-full bg-[#1865EA]" /> : null}
      </span>
    </button>
  );
}

function DropdownField({
  id,
  label,
  value,
  placeholder,
  options,
  open,
  onToggle,
  onSelect,
}) {
  return (
    <div className="relative">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <button
        id={id}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(FIELD_CLASS, "flex items-center justify-between text-left")}
      >
        <span className={value ? "text-[#111827]" : "text-[#ADB3B7]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#64748B] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-[#E8EEF8] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className={cn(
                  "flex w-full items-center px-3.5 py-2.5 text-left text-[14.5px] font-medium text-[#111827]",
                  selected && "bg-[#F4F8FF] text-[#1865EA]",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex size-[18px] items-center justify-center rounded-full bg-[#16A34A] text-white">
      <Check className="size-2.5" strokeWidth={3.5} />
    </span>
  );
}

function ClinicIcon() {
  return (
    <span className="flex size-14 items-center justify-center rounded-2xl bg-[#1865EA] text-white shadow-[0_6px_16px_rgba(24,101,234,0.3)]">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5.5v-5h-3v5H5a1 1 0 0 1-1-1v-9.5Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path d="M11 9h2v2h2v2h-2v2h-2v-2H9v-2h2V9Z" fill="white" />
      </svg>
    </span>
  );
}

function SegmentedTabs({ activeTab, onChange }) {
  return (
    <div className="rounded-2xl bg-[#EEF2F8] p-1">
      <div className="grid grid-cols-2 gap-1">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "h-11 rounded-xl text-[13.5px] font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-[#1865EA] to-[#3B82F6] text-white shadow-[0_4px_12px_rgba(24,101,234,0.28)]"
                  : "bg-transparent text-[#64748B]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isoToDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function ProviderProfileEditInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authProvider = useProviderAuthStore((s) => s.provider);
  const profile = useProviderProfileStore((s) => s.profile);
  const updateProfile = useProviderProfileStore((s) => s.updateProfile);

  const initial = useMemo(
    () => ({
      ...currentProvider,
      ...profile,
      ownerName: profile?.ownerName || authProvider?.name || currentProvider.ownerName,
      email: profile?.email || authProvider?.email || currentProvider.email,
      avatar: profile?.avatar || authProvider?.avatar || currentProvider.avatar,
      businessName:
        profile?.businessName ||
        authProvider?.businessName ||
        currentProvider.businessName,
    }),
    [profile, authProvider],
  );

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "service" ? "service" : "profile",
  );

  useEffect(() => {
    setActiveTab(tabParam === "service" ? "service" : "profile");
  }, [tabParam]);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [fullName, setFullName] = useState(initial.ownerName || "");
  const [email, setEmail] = useState(initial.email || "");
  const { country, setCountryCode } = useCountry("IN");
  const [phone, setPhone] = useState(() =>
    parseNationalPhone(initial.phone || "", "+91"),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dob, setDob] = useState(initial.dateOfBirth || "");
  const [gender, setGender] = useState(initial.gender || "male");
  const [avatar, setAvatar] = useState(initial.avatar || "");

  const [coverImage, setCoverImage] = useState(initial.coverImage || "");
  const [businessName, setBusinessName] = useState(initial.businessName || "");
  const [description, setDescription] = useState(initial.description || "");
  const [address, setAddress] = useState(initial.address || "");
  const [city, setCity] = useState(initial.city || "");
  const [pincode, setPincode] = useState(initial.pincode || "");
  const [stateName, setStateName] = useState(initial.state || "");
  const [countryName, setCountryName] = useState(initial.country || "India");
  const [stateOpen, setStateOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const specialty = initial.specialty || currentProvider.specialty;
  const isVerified = initial.isVerified ?? currentProvider.isVerified;
  const backHref = ROUTES.PROVIDER_SETTINGS;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStateOpen(false);
    setCountryOpen(false);
    const url =
      tab === "service"
        ? `${ROUTES.PROVIDER_SETTINGS_PROFILE}?tab=service`
        : ROUTES.PROVIDER_SETTINGS_PROFILE;
    router.replace(url, { scroll: false });
  };

  const pickImage = (file, setter) => {
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        ownerName: fullName.trim(),
        email: email.trim(),
        phone: `${country.dialCode} ${formatNationalPhone(phone)}`.trim(),
        dateOfBirth: dob,
        gender,
        avatar,
        coverImage,
        businessName: businessName.trim(),
        description: description.slice(0, DESC_MAX),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        state: stateName,
        country: countryName,
      });
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
          <Link
            href={backHref}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="flex-1 truncate text-lg font-bold text-[#111827]">Profile</h1>
          <span className="size-10 shrink-0" aria-hidden />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <form
          onSubmit={handleSave}
          className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 pt-4 lg:px-6"
        >
          <SegmentedTabs activeTab={activeTab} onChange={handleTabChange} />

          {activeTab === "profile" ? (
            <div className="mt-6 space-y-5 pb-28">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="relative size-[104px] overflow-hidden rounded-full bg-[#E8F1FF] shadow-[0_8px_24px_rgba(15,23,42,0.1)] ring-4 ring-white">
                    <Image
                      src={avatar || "/icons/provider-expert-logo.png"}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute right-0.5 bottom-0.5 flex size-9 items-center justify-center rounded-full bg-[#1865EA] text-white shadow-[0_4px_12px_rgba(24,101,234,0.4)]"
                    aria-label="Change profile photo"
                  >
                    <Camera className="size-4" strokeWidth={2.2} />
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickImage(e.target.files?.[0], setAvatar)}
                  />
                </div>
                <p className="mt-3 text-[17px] font-bold text-[#0F172A]">
                  {fullName.trim() || "Your name"}
                </p>
                <p className="mt-0.5 text-[13px] text-[#64748B]">
                  {email.trim() || "email@example.com"}
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="full-name">Full Name</FieldLabel>
                <input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="XYZ"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="XYZ123@gmail.com"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <FieldLabel>Phone Number</FieldLabel>
                <div className="flex h-12 items-center rounded-xl border border-[#E8EEF8] bg-white p-1 focus-within:border-[#1865EA]/40 focus-within:ring-2 focus-within:ring-[#1865EA]/15">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex h-full shrink-0 items-center gap-1.5 rounded-lg bg-[#F3F6FB] px-2.5"
                    aria-label="Select country code"
                  >
                    <CountryFlag code={country.code} className="size-6 shrink-0" />
                    <span className="h-4 w-px bg-[#D5DCE6]" aria-hidden />
                    <span className="text-[14px] font-medium text-[#334155]">
                      {country.dialCode}
                    </span>
                    <ChevronDown className="size-3.5 text-[#98A2B3]" />
                  </button>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={formatNationalPhone(phone)}
                    onChange={(e) =>
                      setPhone(parseNationalPhone(e.target.value, country.dialCode))
                    }
                    placeholder="12345 67890"
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[14.5px] text-[#111827] outline-none placeholder:text-[#ADB3B7]"
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="dob">Date of Birth (Optional)</FieldLabel>
                <div className="relative">
                  <input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    aria-label={dob ? isoToDisplay(dob) : "Date of birth"}
                    className={cn(
                      FIELD_CLASS,
                      "pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
                    )}
                  />
                  <Calendar01Icon
                    className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2"
                    aria-hidden
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Gender</FieldLabel>
                <div className="flex gap-3">
                  <GenderCard
                    value="male"
                    label="Male"
                    selected={gender === "male"}
                    imageSrc="/icons/male.png"
                    onSelect={setGender}
                  />
                  <GenderCard
                    value="female"
                    label="Female"
                    selected={gender === "female"}
                    imageSrc="/icons/female.png"
                    onSelect={setGender}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-5 pb-28">
              <div>
                <FieldLabel>Cover Image</FieldLabel>
                {coverImage ? (
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative h-40 w-full">
                      <Image
                        src={coverImage}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md"
                      aria-label="Remove cover image"
                    >
                      <Trash2 className="size-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#1865EA] bg-[#EEF4FF]"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm">
                      <Plus className="size-5" strokeWidth={2.5} />
                    </span>
                    <span className="text-[13px] font-medium text-[#334155]">
                      Add Photo
                    </span>
                  </button>
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => pickImage(e.target.files?.[0], setCoverImage)}
                />
              </div>

              <div className="flex flex-col items-center pt-1">
                {!coverImage ? <ClinicIcon /> : null}
                <p
                  className={cn(
                    "text-[17px] font-bold text-[#0F172A]",
                    !coverImage && "mt-3",
                  )}
                >
                  {businessName.trim() || "Business name"}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <p className="text-[13px] text-[#64748B]">{specialty}</p>
                  {isVerified ? <VerifiedBadge /> : null}
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="business-name">Business Name</FieldLabel>
                <input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="UrbanCare Clinic"
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <div className="relative">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
                    rows={5}
                    placeholder="ABC..."
                    className="w-full resize-none rounded-xl border border-[#E8EEF8] bg-white px-3.5 py-3 pb-8 text-[14.5px] text-[#111827] outline-none placeholder:text-[#ADB3B7] focus-visible:border-[#1865EA]/40 focus-visible:ring-2 focus-visible:ring-[#1865EA]/15"
                  />
                  <span className="pointer-events-none absolute right-3 bottom-2.5 text-[11px] font-medium text-[#94A3B8]">
                    {description.length}/{DESC_MAX}
                  </span>
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building, Floor, Street"
                  className={FIELD_CLASS}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className={FIELD_CLASS}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="pincode">Pincode</FieldLabel>
                  <input
                    id="pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    inputMode="numeric"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              <DropdownField
                id="state"
                label="State"
                value={stateName}
                placeholder="Select State"
                options={STATE_OPTIONS}
                open={stateOpen}
                onToggle={() => {
                  setStateOpen((o) => !o);
                  setCountryOpen(false);
                }}
                onSelect={(option) => {
                  setStateName(option);
                  setStateOpen(false);
                }}
              />

              <DropdownField
                id="country"
                label="Country"
                value={countryName}
                placeholder="Select Country"
                options={COUNTRY_OPTIONS}
                open={countryOpen}
                onToggle={() => {
                  setCountryOpen((o) => !o);
                  setStateOpen(false);
                }}
                onSelect={(option) => {
                  setCountryName(option);
                  setCountryOpen(false);
                }}
              />
            </div>
          )}

          <div className="safe-bottom sticky bottom-0 mt-auto bg-[#F4F7FF] pt-4 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-[#1865EA] to-[#3B82F6] text-base font-semibold text-white shadow-[0_8px_20px_rgba(24,101,234,0.3)] transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </main>

      <CountryCodePicker
        open={pickerOpen}
        value={country.code}
        onSelect={setCountryCode}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}

export function ProviderProfileEditView() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center bg-[#F4F7FF] text-sm text-[#64748B]">
          Loading profile...
        </div>
      }
    >
      <ProviderProfileEditInner />
    </Suspense>
  );
}

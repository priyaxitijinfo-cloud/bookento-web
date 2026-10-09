"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  Bone,
  ChevronDown,
  Eye,
  FileText,
  HeartPulse,
  Plus,
  Smile,
  Stethoscope,
  Wind,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { Calendar01Icon } from "@/components/icons/calendar01-icon";
import {
  CountryCodePicker,
  PhoneNumberField,
  useCountry,
} from "@/features/auth/components/auth-shared";
import {
  ProviderAuthField,
  ProviderAuthResponsive,
  ProviderContinueButton,
  providerAuthInputClass,
} from "@/features/auth/components/provider-auth-shell";
import { ProviderRegistrationStatusView } from "@/features/auth/components/provider-registration-status-view";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const STATES = ["Gujarat", "Maharashtra", "Rajasthan", "Karnataka"];
const COUNTRIES = ["India", "United States", "Canada", "United Kingdom", "Australia"];
const TOTAL_STEPS = 6;

const DOC_FIELDS = [
  { key: "businessLicense", label: "Business License" },
  { key: "idProof", label: "ID Proof (Aadhaar/PAN)" },
  { key: "addressProof", label: "Address Proof" },
];

const PROVIDER_TYPES = [
  {
    id: "salon-spa",
    title: "Salon & Spa",
    description: "Beauty salon, spa, parlor with fixed location",
    icon: "/icons/categories/salon.svg",
    iconBg: "bg-[#FFE8EE]",
  },
  {
    id: "clinic-wellness",
    title: "Clinic & Wellness",
    description: "Health clinic, therapy center, wellness",
    icon: "/icons/categories/doctor.svg",
    iconBg: "bg-[#E0F2FF]",
  },
  {
    id: "fitness-yoga",
    title: "Fitness & Yoga",
    description: "Gym, yoga studio, personal trainer",
    icon: "/icons/categories/fitness.svg",
    iconBg: "bg-[#E4F5E8]",
  },
  {
    id: "tutoring",
    title: "Tutoring",
    description: "Academic tutoring, coaching classes, skill training",
    icon: "/icons/categories/tutoring.svg",
    iconBg: "bg-[#FFF1DE]",
  },
  {
    id: "pet-care",
    title: "Pet Care",
    description: "Pet grooming, vet clinic, pet sitting, training",
    icon: "/icons/categories/pet-care.svg",
    iconBg: "bg-[#ECEBFF]",
  },
  {
    id: "homecare",
    title: "Homecare",
    description: "Elder care, patient care, nursing, home assistance",
    icon: "/icons/categories/homecare.svg",
    iconBg: "bg-[#F9E8FF]",
  },
  {
    id: "kids-care",
    title: "Kids Care",
    description: "Child care, babysitting, kids activities",
    icon: "/icons/categories/kids-care.svg",
    iconBg: "bg-[#FFE8F3]",
  },
];

const SERVICE_CATEGORIES = [
  { id: "dental", title: "Dental Care", Icon: Smile },
  { id: "diabetes", title: "Diabetes Care", Icon: Activity },
  { id: "eye", title: "Eye Care", Icon: Eye },
  { id: "general-physician", title: "General Physician", Icon: Stethoscope },
  { id: "cardiology", title: "Cardiology", Icon: HeartPulse },
  { id: "pulmonology", title: "Pulmonology", Icon: Wind },
  { id: "orthopedics", title: "Orthopedics", Icon: Bone },
];

const initialForm = {
  ownerName: "",
  businessName: "",
  experience: "",
  phone: "",
  dob: "",
  gender: "male",
  email: "",
  password: "",
  address: "",
  city: "",
  pincode: "",
  state: "",
  country: "India",
  providerType: "",
  serviceCategory: "",
  documents: {
    businessLicense: null,
    idProof: null,
    addressProof: null,
  },
};

function AvatarUpload({ preview, onPick }) {
  const inputRef = useRef(null);
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex size-[6.5rem] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-dashed border-[#1865EA] bg-[#EEF4FF]"
        aria-label="Upload profile photo"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="size-full object-cover" />
        ) : (
          <Plus className="size-8 text-[#1865EA]" strokeWidth={2.4} />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onPick(URL.createObjectURL(file));
        }}
      />
    </div>
  );
}

function CoverUpload({ preview, onPick }) {
  const inputRef = useRef(null);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex h-[8.5rem] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-[1.5px] border-dashed border-[#1865EA] bg-[#EEF4FF]"
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="size-full object-cover" />
      ) : (
        <>
          <span className="flex size-11 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm">
            <Plus className="size-5" strokeWidth={2.5} />
          </span>
          <span className="text-[13px] font-medium text-[#334155]">Add Photo</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onPick(URL.createObjectURL(file));
        }}
      />
    </button>
  );
}

function GenderCards({ value, onChange }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3">
      {[
        { id: "male", label: "Male", icon: "/icons/male.png" },
        { id: "female", label: "Female", icon: "/icons/female.png" },
      ].map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "flex min-w-0 items-center gap-2.5 rounded-2xl border bg-white px-3 py-3 text-left transition-colors sm:gap-3 sm:px-3.5",
              selected
                ? "border-[#1865EA] shadow-[0_0_0_1px_rgba(24,101,234,0.15)]"
                : "border-[#E2E8F0]",
            )}
          >
            <Image
              src={option.icon}
              alt=""
              width={40}
              height={40}
              className="size-9 shrink-0 object-contain sm:size-10"
            />
            <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#0F172A]">
              {option.label}
            </span>
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                selected ? "border-[#1865EA]" : "border-[#CBD5E1]",
              )}
              aria-hidden
            >
              {selected ? (
                <span className="size-2.5 rounded-full bg-[#1865EA]" />
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProviderTypeCards({ value, onChange }) {
  return (
    <div className="space-y-3">
      {PROVIDER_TYPES.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "flex w-full items-center gap-3.5 rounded-2xl border bg-white px-3.5 py-3.5 text-left transition-colors",
              selected
                ? "border-[#1865EA] shadow-[0_0_0_1px_rgba(24,101,234,0.12)]"
                : "border-[#EEF1F6] shadow-[0_2px_10px_rgba(15,23,42,0.04)]",
            )}
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                option.iconBg,
              )}
            >
              <Image
                src={option.icon}
                alt=""
                width={28}
                height={28}
                className="size-7 object-contain"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-[#0F172A]">
                {option.title}
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-[#64748B]">
                {option.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ServiceCategoryCards({ value, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-[14px] font-semibold text-[#1E293B]">Select Category</p>
      {SERVICE_CATEGORIES.map(({ id, title, Icon }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex w-full items-center gap-3.5 rounded-2xl border bg-white px-3.5 py-3.5 text-left transition-colors",
              selected
                ? "border-[#1865EA] shadow-[0_0_0_1px_rgba(24,101,234,0.12)]"
                : "border-[#EEF1F6] shadow-[0_2px_10px_rgba(15,23,42,0.04)]",
            )}
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#1865EA]">
              <Icon className="size-6" strokeWidth={1.8} aria-hidden />
            </span>
            <span className="min-w-0 flex-1 text-[15px] font-medium text-[#0F172A]">
              {title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DropdownField({ label, value, placeholder, options, onChange, error }) {
  const [open, setOpen] = useState(false);
  return (
    <ProviderAuthField label={label} error={error}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            providerAuthInputClass(error),
            "flex items-center justify-between text-left",
            !value && "text-[#94A3B8]",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-[#64748B] transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {open ? (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-[#F8FAFC]",
                  value === option
                    ? "bg-[#EEF4FF] font-semibold text-[#1865EA]"
                    : "text-[#0F172A]",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </ProviderAuthField>
  );
}

function DocumentUploadCard({ label, document, onUpload, onRemove }) {
  const inputRef = useRef(null);
  const isImage = document?.type?.startsWith("image/");

  return (
    <ProviderAuthField label={label}>
      {document ? (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-300 bg-emerald-50">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={document.url}
              alt={document.name}
              className="h-[7.5rem] w-full object-cover"
            />
          ) : (
            <div className="flex h-[7.5rem] w-full flex-col items-center justify-center gap-2 px-4">
              <FileText className="size-8 text-emerald-600" strokeWidth={1.8} />
              <p className="line-clamp-2 max-w-full text-center text-[13px] font-medium text-[#0F172A]">
                {document.name}
              </p>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/45 px-3 py-2">
            <span className="truncate text-[12px] font-medium text-white">
              {document.name}
            </span>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#0F172A]"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex size-7 items-center justify-center rounded-full bg-white/95 text-[#EF4444]"
                aria-label={`Remove ${label}`}
              >
                <X className="size-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-[7.5rem] w-full flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#1865EA] bg-[#EEF4FF]"
        >
          <FileText className="size-8 text-[#1865EA]" strokeWidth={1.8} />
          <span className="text-[14px] font-medium text-[#0F172A]">Tap to Upload</span>
          <span className="text-[11px] text-[#64748B]">PDF, JPG or PNG</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          onUpload({
            name: file.name,
            type: file.type || "application/octet-stream",
            url: URL.createObjectURL(file),
            size: file.size,
          });
        }}
      />
    </ProviderAuthField>
  );
}

export function ProviderRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [rejected] = useState(false);
  const { country, setCountryCode, pickerOpen, setPickerOpen } = useCountry("IN");

  const requestMeta = useMemo(() => {
    const now = new Date();
    return {
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      id: `PR${String(now.getTime()).slice(-8).toUpperCase()}`,
    };
  }, []);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const titles = {
    1: {
      title: "Register as Provider",
      subtitle:
        "Fill in your personal & business information to set up your provider account.",
    },
    2: {
      title: "Service Location",
      subtitle: "Add your business address and service location details",
    },
    3: {
      title: "Choose Provider Type",
      subtitle: "Select the type that best describes your business",
    },
    4: {
      title: "Select Your Service Category",
      subtitle: "Select the healthcare category that matches your clinic or expertise",
    },
    5: {
      title: "Verification Documents",
      subtitle: "Upload the required documents to verify your business account",
    },
    6: {
      title: "Request Send Successfully",
      subtitle:
        "Your provider request send successfully for admin wait 48 hours to approve request.",
    },
  };

  const selectedCategoryLabel =
    SERVICE_CATEGORIES.find((item) => item.id === form.serviceCategory)?.title ||
    PROVIDER_TYPES.find((item) => item.id === form.providerType)?.title ||
    "Provider";

  const validateStep = () => {
    const next = {};
    if (step === 1) {
      if (!form.ownerName.trim()) next.ownerName = "Required";
      if (!form.businessName.trim()) next.businessName = "Required";
      if (!form.phone.trim()) next.phone = "Required";
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
        next.email = "Enter a valid email";
      }
      if (!form.password || form.password.length < 6) {
        next.password = "Min 6 characters";
      }
    }
    if (step === 2) {
      if (!form.address.trim()) next.address = "Required";
      if (!form.city.trim()) next.city = "Required";
      if (!form.pincode.trim()) next.pincode = "Required";
      if (!form.state) next.state = "Select state";
      if (!form.country) next.country = "Select country";
    }
    if (step === 3 && !form.providerType) {
      next.providerType = "Select a provider type";
    }
    if (step === 4 && !form.serviceCategory) {
      next.serviceCategory = "Select a service category";
    }
    if (step === 5) {
      if (!form.documents.businessLicense || !form.documents.idProof) {
        next.documents = "Upload required documents";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  };

  const shellTitles = titles[step];

  return (
    <>
      <ProviderAuthResponsive
        title={shellTitles.title}
        subtitle={shellTitles.subtitle}
        wide
        headline="Join Bookento Pro"
        copy="Create your provider profile, verify documents, and start receiving bookings."
        footer={
          step < TOTAL_STEPS ? (
            <ProviderContinueButton onClick={nextStep}>Continue</ProviderContinueButton>
          ) : (
            <ProviderContinueButton onClick={() => router.push(ROUTES.PROVIDER_LOGIN)}>
              Back to Login
            </ProviderContinueButton>
          )
        }
      >
        {step === 1 ? (
          <div className="w-full max-w-full min-w-0 space-y-5 overflow-x-hidden">
            <AvatarUpload preview={avatarPreview} onPick={setAvatarPreview} />

            <ProviderAuthField label="Owner Name" error={errors.ownerName}>
              <input
                value={form.ownerName}
                onChange={(e) => update("ownerName", e.target.value)}
                placeholder="Your full name"
                className={providerAuthInputClass(errors.ownerName)}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Business Name" error={errors.businessName}>
              <input
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="e.g., Wellness & Clinic"
                className={providerAuthInputClass(errors.businessName)}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Years of Experience">
              <input
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                placeholder="Your experience"
                className={providerAuthInputClass()}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Phone Number" error={errors.phone}>
              <PhoneNumberField
                country={country}
                phone={form.phone}
                onPhoneChange={(value) => update("phone", value)}
                onCountryClick={() => setPickerOpen(true)}
                placeholder="Enter mobile number"
                error={Boolean(errors.phone)}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Date Of Birth">
              <div className="relative">
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  className={cn(
                    providerAuthInputClass(),
                    "pr-11 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
                  )}
                />
                <Calendar01Icon
                  className="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2"
                  aria-hidden
                />
              </div>
            </ProviderAuthField>

            <ProviderAuthField label="Gender">
              <GenderCards
                value={form.gender}
                onChange={(value) => update("gender", value)}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Email Address" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Your email address"
                className={providerAuthInputClass(errors.email)}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Password" error={errors.password}>
              <PasswordInput
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Your Password"
                className={cn(providerAuthInputClass(errors.password), "pr-11")}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Cover Image">
              <CoverUpload preview={coverPreview} onPick={setCoverPreview} />
            </ProviderAuthField>

            <p className="pt-1 text-center text-[13.5px] text-[#64748B]">
              Already registered?{" "}
              <Link
                href={ROUTES.PROVIDER_LOGIN}
                className="font-semibold text-[#1865EA] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="w-full max-w-full min-w-0 space-y-5 overflow-x-hidden">
            <ProviderAuthField label="Address" error={errors.address}>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Building, Floor, Street"
                className={providerAuthInputClass(errors.address)}
              />
            </ProviderAuthField>

            <div className="grid grid-cols-2 gap-3">
              <ProviderAuthField label="City" error={errors.city}>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="City"
                  className={providerAuthInputClass(errors.city)}
                />
              </ProviderAuthField>
              <ProviderAuthField label="Pincode" error={errors.pincode}>
                <input
                  value={form.pincode}
                  onChange={(e) => update("pincode", e.target.value)}
                  placeholder="Pincode"
                  className={providerAuthInputClass(errors.pincode)}
                />
              </ProviderAuthField>
            </div>

            <DropdownField
              label="State"
              value={form.state}
              placeholder="Select State"
              options={STATES}
              onChange={(value) => update("state", value)}
              error={errors.state}
            />

            <DropdownField
              label="Country"
              value={form.country}
              placeholder="Select Country"
              options={COUNTRIES}
              onChange={(value) => update("country", value)}
              error={errors.country}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="w-full max-w-full min-w-0 space-y-4 overflow-x-hidden">
            <ProviderTypeCards
              value={form.providerType}
              onChange={(value) => {
                update("providerType", value);
                setErrors((prev) => ({ ...prev, providerType: undefined }));
              }}
            />
            {errors.providerType ? (
              <p className="sr-only">{errors.providerType}</p>
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="w-full max-w-full min-w-0 space-y-4 overflow-x-hidden">
            <ServiceCategoryCards
              value={form.serviceCategory}
              onChange={(value) => {
                update("serviceCategory", value);
                setErrors((prev) => ({ ...prev, serviceCategory: undefined }));
              }}
            />
            {errors.serviceCategory ? (
              <p className="sr-only">{errors.serviceCategory}</p>
            ) : null}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="w-full max-w-full min-w-0 space-y-5 overflow-x-hidden">
            {DOC_FIELDS.map(({ key, label }) => (
              <DocumentUploadCard
                key={key}
                label={label}
                document={form.documents[key]}
                onUpload={(doc) => {
                  setForm((prev) => {
                    const previous = prev.documents[key];
                    if (previous?.url) URL.revokeObjectURL(previous.url);
                    return {
                      ...prev,
                      documents: { ...prev.documents, [key]: doc },
                    };
                  });
                  toast.success(`${label} uploaded`);
                }}
                onRemove={() => {
                  setForm((prev) => {
                    const previous = prev.documents[key];
                    if (previous?.url) URL.revokeObjectURL(previous.url);
                    return {
                      ...prev,
                      documents: { ...prev.documents, [key]: null },
                    };
                  });
                }}
              />
            ))}
            {errors.documents ? <p className="sr-only">{errors.documents}</p> : null}
          </div>
        ) : null}

        {step === 6 ? (
          <ProviderRegistrationStatusView
            rejected={rejected}
            avatarSrc={avatarPreview || "/images/app-icon.jpg"}
            name={form.ownerName || "Provider"}
            businessName={form.businessName || "Business"}
            category={selectedCategoryLabel}
            requestDate={requestMeta.date}
            requestTime={requestMeta.time}
            requestId={requestMeta.id}
          />
        ) : null}
      </ProviderAuthResponsive>

      <CountryCodePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        value={country.code}
        onSelect={setCountryCode}
      />
    </>
  );
}

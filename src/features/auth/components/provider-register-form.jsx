"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Calendar, Check, ChevronDown, FileText, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
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
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const STATES = ["Gujarat", "Maharashtra", "Rajasthan", "Karnataka"];
const COUNTRIES = ["India", "United States", "Canada", "United Kingdom", "Australia"];

const DOC_FIELDS = [
  { key: "businessLicense", label: "Business License" },
  { key: "idProof", label: "ID Proof (Aadhaar/PAN)" },
  { key: "addressProof", label: "Address Proof" },
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
  documents: {
    businessLicense: false,
    idProof: false,
    addressProof: false,
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
    <div className="grid grid-cols-2 gap-3">
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
              "flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 text-left transition-colors",
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
              className="size-10 object-contain"
            />
            <span className="flex-1 text-[14px] font-semibold text-[#0F172A]">
              {option.label}
            </span>
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border-2",
                selected ? "border-[#1865EA] bg-[#1865EA]" : "border-[#CBD5E1]",
              )}
            >
              {selected ? (
                <Check className="size-3 text-white" strokeWidth={3} />
              ) : null}
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

function DocumentUploadCard({ label, uploaded, onUpload }) {
  return (
    <ProviderAuthField label={label}>
      <button
        type="button"
        onClick={onUpload}
        className={cn(
          "flex h-[7.5rem] w-full flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed",
          uploaded
            ? "border-emerald-400 bg-emerald-50"
            : "border-[#1865EA] bg-[#EEF4FF]",
        )}
      >
        <FileText
          className={cn("size-8", uploaded ? "text-emerald-600" : "text-[#1865EA]")}
          strokeWidth={1.8}
        />
        <span className="text-[14px] font-medium text-[#0F172A]">
          {uploaded ? "Uploaded" : "Tap to Upload"}
        </span>
      </button>
    </ProviderAuthField>
  );
}

function SuccessStamp({ tone = "success" }) {
  const isSuccess = tone === "success";
  return (
    <div
      className={cn(
        "mx-auto flex size-[5.5rem] items-center justify-center rounded-[1.75rem]",
        isSuccess ? "bg-[#22C55E]" : "bg-[#EF4444]",
        "[clip-path:polygon(50%_0%,63%_8%,75%_4%,82%_16%,94%_20%,92%_33%,100%_45%,94%_58%,96%_72%,84%_78%,78%_90%,65%_88%,50%_100%,35%_88%,22%_90%,16%_78%,4%_72%,6%_58%,0%_45%,8%_33%,6%_20%,18%_16%,25%_4%,37%_8%)]",
      )}
    >
      {isSuccess ? (
        <Check className="size-9 text-white" strokeWidth={3} />
      ) : (
        <X className="size-9 text-white" strokeWidth={3} />
      )}
    </div>
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
      title: "Verification Documents",
      subtitle: "Upload the required documents to verify your business account",
    },
    4: {
      title: "Request Send Successfully",
      subtitle:
        "Your provider request send successfully for admin wait 48 hours to approve request.",
    },
  };

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
    if (step === 3) {
      if (!form.documents.businessLicense || !form.documents.idProof) {
        next.documents = "Upload required documents";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < 4) setStep((s) => s + 1);
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
          step < 4 ? (
            <ProviderContinueButton onClick={nextStep}>Continue</ProviderContinueButton>
          ) : (
            <ProviderContinueButton onClick={() => router.push(ROUTES.PROVIDER_LOGIN)}>
              Back to Login
            </ProviderContinueButton>
          )
        }
      >
        {step === 1 ? (
          <div className="space-y-5">
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
                error={errors.phone}
              />
            </ProviderAuthField>

            <ProviderAuthField label="Date Of Birth">
              <div className="relative">
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => update("dob", e.target.value)}
                  className={cn(providerAuthInputClass(), "pr-11")}
                />
                <Calendar
                  className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#1865EA]"
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
          <div className="space-y-5">
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
          <div className="space-y-5">
            {DOC_FIELDS.map(({ key, label }) => (
              <DocumentUploadCard
                key={key}
                label={label}
                uploaded={form.documents[key]}
                onUpload={() => {
                  setForm((prev) => ({
                    ...prev,
                    documents: { ...prev.documents, [key]: true },
                  }));
                  toast.success(`${label} uploaded`);
                }}
              />
            ))}
            {errors.documents ? (
              <p className="text-[12.5px] text-red-500">{errors.documents}</p>
            ) : null}
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-6">
            <SuccessStamp />

            <div className="overflow-hidden rounded-2xl border border-[#E8EDF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="bg-muted size-14 shrink-0 overflow-hidden rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarPreview || "/images/app-icon.jpg"}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-bold text-[#0F172A]">
                    {form.ownerName || "Provider"}
                  </p>
                  <p className="truncate text-[13px] text-[#64748B]">
                    {form.businessName || "Business"}
                  </p>
                  <span className="mt-1.5 inline-flex rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1865EA]">
                    Pending Review
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-t border-[#EEF1F6] px-4 py-4 text-[13.5px]">
                {[
                  ["Request Date", requestMeta.date],
                  ["Request Time", requestMeta.time],
                  ["Request ID", requestMeta.id],
                  ["Request Status", "Pending"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[#64748B]">{label}</span>
                    <span
                      className={cn(
                        "font-semibold",
                        label === "Request Status"
                          ? "text-[#1865EA]"
                          : "text-[#0F172A]",
                      )}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {rejected ? (
              <div className="flex gap-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                <SuccessStamp tone="error" />
                <div className="min-w-0 flex-1 pt-1">
                  <p className="text-[14px] font-bold text-[#0F172A]">
                    Reason for Rejection
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">
                    Your documents are not valid. Please upload valid documents and try
                    again.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
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

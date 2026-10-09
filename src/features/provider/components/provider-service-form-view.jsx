"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  Home,
  Minus,
  Plus,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import {
  SERVICE_CATEGORIES,
  SERVICE_DURATION_OPTIONS,
  emptyServiceForm,
  serviceToForm,
  useProviderServicesStore,
} from "@/store/provider-services.store";

const DESC_MAX = 500;

function FieldLabel({ children, className }) {
  return (
    <label
      className={cn("mb-1.5 block text-[13px] font-semibold text-[#334155]", className)}
    >
      {children}
    </label>
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-[#1865EA]" : "bg-[#CBD5E1]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

function CategoryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = SERVICE_CATEGORIES.find((c) => c.id === value);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <FieldLabel>Select Category</FieldLabel>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-left transition-colors hover:border-[#CBD5E1]"
      >
        {selected ? (
          <>
            <span className="relative size-8 shrink-0 overflow-hidden rounded-lg bg-[#F4F7FF]">
              <Image
                src={selected.icon}
                alt=""
                fill
                className="object-contain p-1"
                unoptimized
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#0F172A]">
              {selected.label}
            </span>
          </>
        ) : (
          <span className="flex-1 text-sm text-[#94A3B8]">Category</span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#94A3B8] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-[#E2E8F0] bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = cat.id === value;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
                  isActive ? "bg-[#E8F1FF]" : "hover:bg-[#F8FAFF]",
                )}
              >
                <span className="relative size-9 shrink-0 overflow-hidden rounded-xl bg-[#F4F7FF]">
                  <Image
                    src={cat.icon}
                    alt=""
                    fill
                    className="object-contain p-1.5"
                    unoptimized
                  />
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium text-[#0F172A]">
                  {cat.label}
                </span>
                {isActive ? <Check className="size-4 shrink-0 text-[#1865EA]" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function DurationDropdown({ value, onChange }) {
  const options = SERVICE_DURATION_OPTIONS;
  const selected = options.find((o) => o.value === String(value)) || options[2];

  return (
    <div>
      <FieldLabel>Duration</FieldLabel>
      <div className="relative">
        <select
          value={String(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-12 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm font-medium text-[#0F172A] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
        <span className="sr-only">{selected.label}</span>
      </div>
    </div>
  );
}

function DateField({ value, onChange, placeholder }) {
  return (
    <div className="relative min-w-0 flex-1">
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3 pr-9 text-sm font-medium text-[#0F172A] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:opacity-60"
        placeholder={placeholder}
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
    </div>
  );
}

const SERVICE_TYPES = [
  {
    key: "inClinic",
    title: "In-clinic",
    subtitle: "Patients visit your clinic",
    icon: Building2,
    iconWrap: "bg-[#FFE4EC] text-[#E91E63]",
  },
  {
    key: "online",
    title: "Online",
    subtitle: "Consult with patients online",
    icon: Video,
    iconWrap: "bg-[#F3E8FF] text-[#9333EA]",
  },
  {
    key: "atHome",
    title: "At-home",
    subtitle: "We'll visit the patient at their location",
    icon: Home,
    iconWrap: "bg-[#FFE4EC] text-[#EC407A]",
  },
];

export function ProviderServiceFormView({ serviceId = null }) {
  const router = useRouter();
  const isEdit = Boolean(serviceId);
  const fileInputId = useId();
  const fileRef = useRef(null);

  const getServiceById = useProviderServicesStore((s) => s.getServiceById);
  const addService = useProviderServicesStore((s) => s.addService);
  const updateService = useProviderServicesStore((s) => s.updateService);

  const existing = isEdit ? getServiceById(serviceId) : null;
  const [form, setForm] = useState(() =>
    isEdit ? serviceToForm(existing) : emptyServiceForm(),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const service = getServiceById(serviceId);
    if (service) {
      setForm(serviceToForm(service));
    }
  }, [isEdit, serviceId, getServiceById]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const descriptionLen = (form.description || "").length;

  const handleAddPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), url],
    }));
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const adjustTravelFee = (delta) => {
    setForm((prev) => {
      const next = Math.max(0, Number(prev.travelFee || 0) + delta);
      return { ...prev, travelFee: next };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      toast.error("Service name is required");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!form.price && form.price !== 0) {
      toast.error("Price is required");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        updateService(serviceId, form);
        toast.success("Service updated");
      } else {
        addService(form);
        toast.success("Service saved");
      }
      router.push(ROUTES.PROVIDER_SERVICES);
    } finally {
      setSaving(false);
    }
  };

  const missingEditTarget = isEdit && !getServiceById(serviceId);

  if (missingEditTarget) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[#F4F7FF] px-4 text-center">
        <p className="font-semibold text-[#0F172A]">Service not found</p>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-[#1865EA]"
          onClick={() => router.push(ROUTES.PROVIDER_SERVICES)}
        >
          Back to My Services
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-1 px-3 lg:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F4F7FF]"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="flex-1 truncate pr-10 text-center text-lg font-bold text-[#111827]">
            {isEdit ? "Edit Service" : "Add Service"}
          </h1>
        </div>
      </header>

      <form
        onSubmit={handleSave}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 flex-1 overflow-y-auto bg-white">
          <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4 pb-6 lg:px-6 lg:py-6">
            <div>
              <FieldLabel>Service Name</FieldLabel>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Name"
                className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
              />
            </div>

            <div>
              <FieldLabel>Description Service</FieldLabel>
              <div className="relative">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setField("description", e.target.value.slice(0, DESC_MAX))
                  }
                  placeholder="ABC..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 pb-8 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
                />
                <span className="pointer-events-none absolute right-3 bottom-2.5 text-[11px] font-medium text-[#94A3B8]">
                  {descriptionLen}/{DESC_MAX}
                </span>
              </div>
            </div>

            <CategoryDropdown
              value={form.categoryId}
              onChange={(id) => setField("categoryId", id)}
            />

            <div>
              <FieldLabel>Service images (Optional)</FieldLabel>
              <div className="flex flex-wrap gap-2.5">
                {(form.images || []).map((src, index) => (
                  <div
                    key={`${src}-${index}`}
                    className="relative size-20 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
                  >
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/55 text-[10px] font-bold text-white"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label
                  htmlFor={fileInputId}
                  className="flex min-h-[7.5rem] min-w-[9rem] flex-1 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#93C5FD] bg-[#F4F7FF] px-4 py-5 transition-colors hover:bg-[#E8F1FF]"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm">
                    <Plus className="size-5" strokeWidth={2.4} />
                  </span>
                  <span className="text-sm font-medium text-[#64748B]">Add Photo</span>
                  <input
                    id={fileInputId}
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleAddPhoto}
                  />
                </label>
              </div>
            </div>

            <DurationDropdown
              value={form.duration}
              onChange={(v) => setField("duration", v)}
            />

            {/* Pricing */}
            <div className="space-y-3.5 rounded-2xl bg-[#F4F7FF] p-3.5 ring-1 ring-[#E8EEF8]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Price</FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-[#64748B]">
                      ₹
                    </span>
                    <input
                      inputMode="numeric"
                      value={form.price}
                      onChange={(e) =>
                        setField("price", e.target.value.replace(/[^\d.]/g, ""))
                      }
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white py-2 pr-3 pl-7 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Limited Price</FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-[#1865EA]">
                      ₹
                    </span>
                    <input
                      inputMode="numeric"
                      value={form.limitedPrice}
                      onChange={(e) =>
                        setField("limitedPrice", e.target.value.replace(/[^\d.]/g, ""))
                      }
                      className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white py-2 pr-3 pl-7 text-sm font-semibold text-[#1865EA] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel>Discount Type</FieldLabel>
                <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-2 pl-3.5">
                  <input
                    inputMode="numeric"
                    value={form.discountValue}
                    onChange={(e) =>
                      setField("discountValue", e.target.value.replace(/[^\d.]/g, ""))
                    }
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#0F172A] outline-none"
                    placeholder={form.discountType === "percent" ? "20" : "200"}
                  />
                  <span className="text-sm font-medium text-[#64748B]">
                    {form.discountType === "percent" ? "%" : "₹"}
                  </span>
                  <div className="flex shrink-0 overflow-hidden rounded-lg bg-[#EEF2F7] p-0.5">
                    <button
                      type="button"
                      onClick={() => setField("discountType", "percent")}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors",
                        form.discountType === "percent"
                          ? "bg-[#1865EA] text-white"
                          : "text-[#64748B]",
                      )}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => setField("discountType", "rupee")}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors",
                        form.discountType === "rupee"
                          ? "bg-[#1865EA] text-white"
                          : "text-[#64748B]",
                      )}
                    >
                      ₹
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel>Discount Value</FieldLabel>
                <div className="flex gap-2.5">
                  <DateField
                    value={form.offerStart}
                    onChange={(v) => setField("offerStart", v)}
                    placeholder="From"
                  />
                  <DateField
                    value={form.offerEnd}
                    onChange={(v) => setField("offerEnd", v)}
                    placeholder="To"
                  />
                </div>
              </div>
            </div>

            {/* Service type */}
            <div className="overflow-hidden rounded-2xl bg-[#F4F7FF] ring-1 ring-[#E8EEF8]">
              <div className="divide-y divide-[#E8EEF8]">
                {SERVICE_TYPES.map((item) => {
                  const Icon = item.icon;
                  const checked = Boolean(form[item.key]);
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 px-3.5 py-3.5"
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl",
                          item.iconWrap,
                        )}
                      >
                        <Icon className="size-5" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14.5px] font-semibold text-[#0F172A]">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#94A3B8]">
                          {item.subtitle}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={checked}
                        onChange={(v) => setField(item.key, v)}
                        label={item.title}
                      />
                    </div>
                  );
                })}
              </div>

              {form.atHome ? (
                <div className="flex items-center justify-between gap-3 border-t border-[#E8EEF8] px-3.5 py-3.5">
                  <p className="text-[14.5px] font-semibold text-[#0F172A]">
                    Travel Fee
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adjustTravelFee(-50)}
                      className="flex size-9 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
                      aria-label="Decrease travel fee"
                    >
                      <Minus className="size-4" strokeWidth={2.4} />
                    </button>
                    <span className="min-w-[4.5rem] rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-center text-sm font-bold text-[#0F172A]">
                      ₹{Number(form.travelFee || 0)}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustTravelFee(50)}
                      className="flex size-9 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
                      aria-label="Increase travel fee"
                    >
                      <Plus className="size-4" strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 shrink-0 border-t border-[#E8EEF8] bg-white/95 px-4 py-3 backdrop-blur-sm lg:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1865EA] text-base font-semibold text-white shadow-[0_8px_20px_rgba(24,101,234,0.28)] transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Pencil, Play, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import {
  emptyVideoForm,
  useProviderMediaStore,
  videoToForm,
} from "@/store/provider-media.store";
import { useProviderServicesStore } from "@/store/provider-services.store";
import { formatCurrency } from "@/utils/format.utils";

const DESC_MAX = 500;
const FALLBACK_VIDEO = "/images/doctor-videos/video-1.png";

function FieldLabel({ children, className }) {
  return (
    <label
      className={cn("mb-1.5 block text-[13px] font-semibold text-[#334155]", className)}
    >
      {children}
    </label>
  );
}

function DiscountEmptyIllustration({ kind }) {
  return (
    <div className="relative mx-auto mb-4 flex h-40 w-48 items-end justify-center">
      <span className="absolute top-4 left-8 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-10 right-10 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute right-12 bottom-24 size-1.5 rounded-full bg-[#93C5FD]" />

      <div className="absolute bottom-8 left-2 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-4 w-2 rounded-t-full bg-[#4ADE80]" />
          <span className="h-6 w-2 rounded-t-full bg-[#22C55E]" />
          <span className="h-3.5 w-1.5 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-4 w-6 rounded-b-lg bg-[#93C5FD]" />
      </div>

      <div className="relative z-10 mb-6 drop-shadow-sm">
        <div className="w-[5.5rem] overflow-hidden rounded-xl border-2 border-[#1865EA] bg-white">
          <div className="flex h-5 items-center justify-center gap-2 bg-[#1865EA]">
            <span className="size-1.5 rounded-full bg-white/90" />
            <span className="size-1.5 rounded-full bg-white/90" />
          </div>
          <div className="space-y-1.5 p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2.5 rounded-sm border",
                    i === 1
                      ? "border-[#1865EA] bg-[#1865EA]"
                      : "border-[#CBD5E1] bg-white",
                  )}
                />
                <span className="h-1.5 flex-1 rounded bg-[#E8F1FF]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-3 bottom-14 flex size-9 items-center justify-center rounded-full bg-[#E8F1FF] text-[#1865EA] shadow-sm">
        <Search className="size-4" />
      </div>

      <span className="sr-only">{kind}</span>
    </div>
  );
}

function getServiceOffer(service) {
  if (service.discountType === "percent" && service.discountValue > 0) {
    return `${service.discountValue}% OFF`;
  }
  if (
    service.originalPrice > 0 &&
    service.price > 0 &&
    service.originalPrice > service.price
  ) {
    const pct = Math.round((1 - service.price / service.originalPrice) * 100);
    if (pct > 0) return `${pct}% OFF`;
  }
  return null;
}

function DiscountRow({ item, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
        selected ? "bg-[#ECFDF5]" : "bg-white hover:bg-[#F8FAFF]",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          selected
            ? "border-[#22C55E] bg-[#22C55E] text-white"
            : "border-[#CBD5E1] bg-white",
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} /> : null}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold text-[#0F172A]">
          {item.name}
        </p>
        <p className="mt-0.5 text-[11.5px] font-medium text-[#94A3B8]">
          {item.duration} min
        </p>
      </div>

      <div className="shrink-0 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {item.originalPrice > item.price ? (
            <span className="text-[11.5px] text-[#94A3B8] line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          ) : null}
          <span className="text-[13.5px] font-bold text-[#0F172A]">
            {formatCurrency(item.price)}
          </span>
        </div>
        {item.offerLabel ? (
          <span className="mt-1 inline-flex rounded-md bg-[#22C55E] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
            {item.offerLabel}
          </span>
        ) : null}
      </div>
    </button>
  );
}

export function ProviderVideoFormView({ videoId }) {
  const router = useRouter();
  const isEdit = Boolean(videoId);
  const fileInputId = useId();
  const inputRef = useRef(null);

  const getVideoById = useProviderMediaStore((s) => s.getVideoById);
  const addVideo = useProviderMediaStore((s) => s.addVideo);
  const updateVideo = useProviderMediaStore((s) => s.updateVideo);
  const deleteVideo = useProviderMediaStore((s) => s.deleteVideo);
  const packages = useProviderMediaStore((s) => s.packages);
  const services = useProviderServicesStore((s) => s.services);

  const existing = isEdit ? getVideoById(videoId) : null;
  const [form, setForm] = useState(() =>
    isEdit ? videoToForm(getVideoById(videoId)) : emptyVideoForm(),
  );
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const video = getVideoById(videoId);
    if (video) setForm(videoToForm(video));
  }, [isEdit, videoId, getVideoById]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const discountItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (form.discountType === "packages") {
      return packages
        .map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          duration: pkg.duration,
          originalPrice: pkg.originalPrice,
          price: pkg.price,
          offerLabel: pkg.discountPercent > 0 ? `${pkg.discountPercent}% OFF` : null,
        }))
        .filter((item) => !q || item.name.toLowerCase().includes(q));
    }

    return services
      .map((svc) => ({
        id: svc.id,
        name: svc.name,
        duration: svc.duration,
        originalPrice: svc.originalPrice || svc.price,
        price: svc.price,
        offerLabel: getServiceOffer(svc),
      }))
      .filter((item) => !q || item.name.toLowerCase().includes(q));
  }, [form.discountType, packages, services, search]);

  const toggleLinked = (id) => {
    setForm((prev) => {
      const has = prev.linkedIds.includes(id);
      return {
        ...prev,
        linkedIds: has
          ? prev.linkedIds.filter((x) => x !== id)
          : [...prev.linkedIds, id],
      };
    });
  };

  const handlePickVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({
      ...prev,
      thumbnail: url,
      duration: prev.duration && prev.duration !== "00.00" ? prev.duration : "00.45",
    }));
    e.target.value = "";
  };

  const clearVideo = () => {
    setForm((prev) => ({ ...prev, thumbnail: "", duration: "00.00" }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.thumbnail) {
      toast.error("Please add a video");
      return;
    }
    if (!form.title?.trim()) {
      toast.error("Video title is required");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        updateVideo(videoId, form);
        toast.success("Video updated");
      } else {
        addVideo(form);
        toast.success("Video saved");
      }
      router.push(`${ROUTES.PROVIDER_MEDIA}?tab=videos`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFromPreview = () => {
    if (isEdit && existing) {
      deleteVideo(videoId);
      toast.success("Video deleted");
      router.push(`${ROUTES.PROVIDER_MEDIA}?tab=videos`);
      return;
    }
    clearVideo();
  };

  const missingEditTarget = isEdit && !existing;
  if (missingEditTarget) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[#F4F7FF] px-4 text-center">
        <p className="font-semibold text-[#0F172A]">Video not found</p>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-[#1865EA]"
          onClick={() => router.push(`${ROUTES.PROVIDER_MEDIA}?tab=videos`)}
        >
          Back to Post Upload
        </button>
      </div>
    );
  }

  const emptyKind = form.discountType === "packages" ? "packages" : "services";
  const emptyTitle =
    form.discountType === "packages" ? "No Packages Yet" : "No Services Yet";
  const emptySubtitle =
    form.discountType === "packages"
      ? "You haven't added any packages yet. Add a package to make it available for selection."
      : "You haven't added any services yet. Add a service to make it available for selection.";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
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
            {isEdit ? "Edit Videos" : "Upload Videos"}
          </h1>
        </div>
      </header>

      <form
        onSubmit={handleSave}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4 pb-6 lg:px-6 lg:py-6">
            <div>
              <FieldLabel>Upload Videos</FieldLabel>
              <input
                id={fileInputId}
                ref={inputRef}
                type="file"
                accept="video/*,image/*"
                className="sr-only"
                onChange={handlePickVideo}
              />

              {form.thumbnail ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#E8F1FF]">
                  <Image
                    src={form.thumbnail || FALLBACK_VIDEO}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
                    <Play className="size-3 fill-current" />
                    {form.duration || "00.45"}
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex gap-2">
                    <label
                      htmlFor={fileInputId}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white text-[#64748B] shadow-sm transition-opacity hover:opacity-90"
                      aria-label="Replace video"
                    >
                      <Pencil className="size-3.5" />
                    </label>
                    <button
                      type="button"
                      onClick={handleDeleteFromPreview}
                      className="flex size-8 items-center justify-center rounded-lg bg-[#EF4444] text-white shadow-sm transition-opacity hover:opacity-90"
                      aria-label="Remove video"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor={fileInputId}
                  className="flex min-h-[9.5rem] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed border-[#93C5FD] bg-white px-4 py-6 transition-colors hover:bg-[#F8FAFF]"
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm">
                    <Plus className="size-5" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-semibold text-[#0F172A]">
                    Add Videos
                  </span>
                </label>
              )}
            </div>

            <div>
              <FieldLabel>Video Title</FieldLabel>
              <input
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Write Video Title"
                className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
              />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
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
                  {form.description.length}/{DESC_MAX}
                </span>
              </div>
            </div>

            <div>
              <FieldLabel>Select Discount</FieldLabel>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "packages", label: "Packages" },
                  { id: "service", label: "Service" },
                ].map((option) => {
                  const selected = form.discountType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setField("discountType", option.id);
                        setSearch("");
                      }}
                      className={cn(
                        "flex h-12 items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm font-semibold transition-colors",
                        selected
                          ? "border-[#1865EA] text-[#0F172A]"
                          : "border-[#E2E8F0] text-[#0F172A]",
                      )}
                    >
                      <span>{option.label}</span>
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border-2",
                          selected ? "border-[#1865EA]" : "border-[#CBD5E1]",
                        )}
                      >
                        {selected ? (
                          <span className="size-2.5 rounded-full bg-[#1865EA]" />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl bg-white ring-1 ring-[#E8EEF8]">
                <div className="border-b border-[#EEF1F6] p-3">
                  <div className="flex h-11 items-center gap-2 rounded-xl bg-[#F4F7FF] px-3">
                    <Search className="size-4 shrink-0 text-[#94A3B8]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={
                        form.discountType === "packages"
                          ? "Search packages"
                          : "Search services"
                      }
                      className="h-full w-full bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
                    />
                  </div>
                </div>

                {discountItems.length === 0 ? (
                  <div className="flex flex-col items-center px-4 py-8 text-center">
                    <DiscountEmptyIllustration kind={emptyKind} />
                    <h3 className="text-base font-bold text-[#0F172A]">{emptyTitle}</h3>
                    <p className="mt-1.5 max-w-[240px] text-[12.5px] leading-relaxed text-[#94A3B8]">
                      {emptySubtitle}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F1F5F9] p-1.5">
                    {discountItems.map((item) => (
                      <DiscountRow
                        key={item.id}
                        item={item}
                        selected={form.linkedIds.includes(item.id)}
                        onToggle={() => toggleLinked(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#E8EEF8] bg-white/95 px-4 py-3 backdrop-blur-sm lg:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <button
              type="submit"
              disabled={saving}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#1865EA] text-base font-semibold text-white shadow-[0_8px_20px_rgba(24,101,234,0.28)] transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              Save Videos
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

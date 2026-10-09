"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "sonner";

import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { ROUTES } from "@/constants/routes.constants";
import {
  PROVIDER_DESKTOP_GRID,
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import {
  CATEGORY_SUGGESTION_STATUS,
  useProviderCategorySuggestionsStore,
} from "@/store/provider-category-suggestions.store";

const DESC_MAX = 500;

const TABS = [
  { id: CATEGORY_SUGGESTION_STATUS.PENDING, label: "Pending" },
  { id: CATEGORY_SUGGESTION_STATUS.APPROVED, label: "Approved" },
  { id: CATEGORY_SUGGESTION_STATUS.REJECTED, label: "Rejected" },
];

const TAB_ACTIVE_CLASS = {
  [CATEGORY_SUGGESTION_STATUS.PENDING]: "border-[#1865EA] bg-[#F4F7FF] text-[#1865EA]",
  [CATEGORY_SUGGESTION_STATUS.APPROVED]: "border-[#16A34A] bg-white text-[#16A34A]",
  [CATEGORY_SUGGESTION_STATUS.REJECTED]: "border-[#EF4444] bg-white text-[#EF4444]",
};

const STATUS_LABEL = {
  [CATEGORY_SUGGESTION_STATUS.PENDING]: "Requested",
  [CATEGORY_SUGGESTION_STATUS.APPROVED]: "Approved",
  [CATEGORY_SUGGESTION_STATUS.REJECTED]: "Rejected",
};

function isValidTab(value) {
  return TABS.some((tab) => tab.id === value);
}

function formatStatusAt(value) {
  if (!value) return "";
  const parsed = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(parsed)) return "";
  return format(parsed, "dd MMM yyyy, hh:mm a");
}

function CategoriesEmptyIllustration() {
  return (
    <div className="relative mx-auto mb-6 flex h-48 w-56 items-end justify-center">
      <span className="absolute top-5 left-10 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-12 right-12 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute top-20 left-16 size-1 rounded-full bg-[#BFDBFE]" />
      <span className="absolute right-14 bottom-36 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-8 right-16 text-[10px] text-[#93C5FD]">✦</span>
      <span className="absolute top-16 left-8 text-[8px] text-[#60A5FA]">✦</span>

      {/* Plant */}
      <div className="absolute bottom-12 left-1 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-8 w-2.5 rounded-t-full bg-[#22C55E]" />
          <span className="h-5 w-2 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-5 w-8 rounded-b-lg bg-[#93C5FD]" />
      </div>

      {/* Clipboard */}
      <div className="relative z-10 mb-8 drop-shadow-md">
        <div className="w-[6.75rem] overflow-hidden rounded-2xl border-[3px] border-[#1865EA] bg-white shadow-sm">
          <div className="flex h-6 items-center justify-center bg-[#1865EA]">
            <span className="h-2 w-8 rounded-full bg-white/90" />
          </div>
          <div className="space-y-1.5 p-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border text-[7px] font-bold",
                    i < 2
                      ? "border-[#1865EA] bg-[#1865EA] text-white"
                      : "border-[#CBD5E1] bg-[#F4F7FF] text-transparent",
                  )}
                >
                  ✓
                </span>
                <span className="h-1.5 flex-1 rounded-full bg-[#E8F1FF]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sad box */}
      <div className="absolute right-0 bottom-10">
        <div className="relative flex h-14 w-16 items-center justify-center rounded-md border-2 border-[#93C5FD] bg-[#E8F1FF] shadow-sm">
          <div className="absolute -top-2 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-t-md border-2 border-b-0 border-[#93C5FD] bg-[#F4F7FF]" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex gap-2">
              <span className="size-1.5 rounded-full bg-[#1865EA]" />
              <span className="size-1.5 rounded-full bg-[#1865EA]" />
            </div>
            <span className="mt-0.5 text-[11px] leading-none font-bold text-[#1865EA]">
              :(
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySuggestionCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const description = item.description || "";
  const shouldTruncate = description.length > 90;
  const statusLabel = STATUS_LABEL[item.status] || "Requested";
  const when = formatStatusAt(item.statusAt);

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex gap-3 p-3.5">
        <div className="relative size-[3.75rem] shrink-0 overflow-hidden rounded-xl border border-[#E8F1FF] bg-[#F4F7FF]">
          <Image
            src={item.icon || "/icons/categories/service/general-physician.png"}
            alt=""
            fill
            className="object-contain p-1.5"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-[#0F172A]">{item.name}</h3>

          <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#64748B]">
            <img
              src={PROVIDER_ICONS.calendar}
              alt=""
              className="size-3.5 shrink-0 object-contain opacity-55"
              draggable={false}
            />
            <span className="truncate">
              {statusLabel} : {when || "—"}
            </span>
          </div>

          {description ? (
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#94A3B8]">
              {expanded || !shouldTruncate
                ? description
                : `${description.slice(0, 90).trimEnd()}… `}
              {shouldTruncate ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="inline font-semibold text-[#1865EA]"
                >
                  {expanded ? "Less" : "More..."}
                </button>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function SuggestCategoryModal({ open, onClose, onSubmit }) {
  const fileInputId = useId();
  const fileInputRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setPhoto("");
    setSubmitting(false);
  }, [open]);

  if (!open || !mounted) return null;

  const handlePick = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Please enter a category name");
      return;
    }
    setSubmitting(true);
    onSubmit({
      name: trimmedName,
      description: description.trim(),
      icon: photo || "",
    });
    setSubmitting(false);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggest-category-modal-title"
        className="relative max-h-[min(92dvh,640px)] w-full max-w-[400px] overflow-y-auto rounded-[1.5rem] bg-white px-5 pt-5 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <h2
          id="suggest-category-modal-title"
          className="text-center text-lg font-bold text-[#111827]"
        >
          Suggest Category
        </h2>
        <div className="mt-4 h-px bg-[#EEF1F6]" />

        <div className="mt-5 flex justify-center">
          {photo ? (
            <div className="relative size-[7.5rem] overflow-hidden rounded-2xl bg-[#F4F7FF]">
              <Image src={photo} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => setPhoto("")}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md"
                aria-label="Remove photo"
              >
                <img
                  src={PROVIDER_ICONS.closeCircle}
                  alt=""
                  className="size-3.5 object-contain brightness-0 invert"
                  draggable={false}
                />
              </button>
            </div>
          ) : (
            <label
              htmlFor={fileInputId}
              className="flex size-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#1865EA] bg-[#F4F7FF] transition-colors hover:bg-[#E8F1FF]"
            >
              <img
                src={PROVIDER_ICONS.gallery}
                alt=""
                className="size-7 object-contain"
                draggable={false}
              />
              <span className="text-[12.5px] font-semibold text-[#0F172A]">
                Upload Photo
              </span>
            </label>
          )}
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              handlePick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="suggest-category-name"
            className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
          >
            Category Name
          </label>
          <input
            id="suggest-category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            className="h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/15"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="suggest-category-explain"
            className="mb-1.5 block text-[13px] font-semibold text-[#0F172A]"
          >
            Explain Category
          </label>
          <div className="relative">
            <textarea
              id="suggest-category-explain"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              rows={4}
              placeholder="ABC..."
              className="min-h-[7rem] w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-3 pr-14 text-sm leading-relaxed text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/15"
            />
            <span className="pointer-events-none absolute right-3 bottom-2.5 text-[11px] font-medium text-[#94A3B8]">
              {description.length}/{DESC_MAX}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-[#F4F7FF] text-sm font-semibold text-[#0F172A] transition-colors hover:bg-[#E8F1FF]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="h-12 rounded-xl bg-[#1865EA] text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ProviderSuggestCategoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const tabParam = searchParams.get("tab");

  const suggestions = useProviderCategorySuggestionsStore((s) => s.suggestions);
  const addSuggestion = useProviderCategorySuggestionsStore((s) => s.addSuggestion);

  const [tab, setTab] = useState(() =>
    isValidTab(tabParam) ? tabParam : CATEGORY_SUGGESTION_STATUS.PENDING,
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isValidTab(tabParam)) setTab(tabParam);
  }, [tabParam]);

  const setTabAndQuery = (next) => {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${ROUTES.PROVIDER_CATEGORIES}?${params.toString()}`, {
      scroll: false,
    });
  };

  const list = useMemo(() => {
    if (forceEmpty) return [];
    return suggestions.filter((item) => item.status === tab);
  }, [forceEmpty, suggestions, tab]);

  const isEmpty = list.length === 0;

  const handleSubmit = (payload) => {
    addSuggestion(payload);
    toast.success("Category suggestion submitted");
    if (tab !== CATEGORY_SUGGESTION_STATUS.PENDING) {
      setTabAndQuery(CATEGORY_SUGGESTION_STATUS.PENDING);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-white/95 backdrop-blur-sm">
        <div className={PROVIDER_MOBILE_HEADER}>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-[#F4F7FF]"
            aria-label="Back"
          >
            <img
              src={PROVIDER_ICONS.arrowLeft}
              alt=""
              className="size-5 object-contain"
              draggable={false}
            />
          </button>
          <h1 className="flex-1 truncate text-center text-lg font-bold text-[#111827]">
            Suggest Category
          </h1>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label="Suggest category"
          >
            <img
              src={PROVIDER_ICONS.plus}
              alt=""
              className="size-5 object-contain brightness-0 invert"
              draggable={false}
            />
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(PROVIDER_PAGE_SHELL, "py-4 lg:py-6")}>
          <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-white p-1 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTabAndQuery(item.id)}
                  className={cn(
                    "h-10 rounded-xl border text-sm font-semibold transition-colors",
                    active
                      ? TAB_ACTIVE_CLASS[item.id]
                      : "border-transparent bg-transparent text-[#64748B]",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {isEmpty ? (
            <div className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center px-4 pb-16 text-center">
              <CategoriesEmptyIllustration />
              <h2 className="text-xl font-bold text-[#0F172A]">Not Category Yet</h2>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#94A3B8]">
                Your category suggestions will appear here once you submit one.
              </p>
            </div>
          ) : (
            <div className={cn(PROVIDER_DESKTOP_GRID, "gap-3.5")}>
              {list.map((item) => (
                <CategorySuggestionCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>

      <SuggestCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

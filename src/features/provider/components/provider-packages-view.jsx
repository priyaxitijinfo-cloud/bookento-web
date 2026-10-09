"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ROUTES, providerPackageEditRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import {
  getSavePercent,
  useProviderPackagesStore,
} from "@/store/provider-packages.store";
import { formatCurrency } from "@/utils/format.utils";

const THEME_STYLES = {
  pink: {
    card: "bg-[#FDF2F8]",
    check: "bg-[#EC4899]",
    price: "text-[#EC4899]",
    badge: "bg-[#FCE7F3] text-[#DB2777]",
  },
  blue: {
    card: "bg-[#EFF6FF]",
    check: "bg-[#1865EA]",
    price: "text-[#1865EA]",
    badge: "bg-[#DBEAFE] text-[#1865EA]",
  },
  orange: {
    card: "bg-[#FFF7ED]",
    check: "bg-[#F97316]",
    price: "text-[#EA580C]",
    badge: "bg-[#FFEDD5] text-[#EA580C]",
  },
};

function PackagesEmptyIllustration() {
  return (
    <div className="relative mx-auto mb-6 flex h-52 w-64 items-end justify-center">
      <span className="absolute top-6 left-10 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-12 right-14 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute top-20 left-16 size-1 rounded-full bg-[#BFDBFE]" />
      <span className="absolute right-10 bottom-32 size-1.5 rounded-full bg-[#93C5FD]" />

      {/* Paper plane */}
      <div className="absolute top-8 right-8 rotate-12 text-[#60A5FA]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
        <span className="absolute -bottom-3 -left-4 h-6 w-10 border-t border-dashed border-[#93C5FD]" />
      </div>

      {/* Plant */}
      <div className="absolute bottom-12 left-2 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-7 w-2.5 rounded-t-full bg-[#22C55E]" />
          <span className="h-4 w-2 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-5 w-7 rounded-b-lg bg-[#93C5FD]" />
      </div>

      {/* Document card */}
      <div className="relative z-10 mb-8 drop-shadow-md">
        <div className="w-[7.5rem] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="space-y-1.5 px-3 pt-4 pb-2">
            <span className="block h-1.5 w-10 rounded-full bg-[#E2E8F0]" />
            <span className="block h-1.5 w-14 rounded-full bg-[#E2E8F0]" />
            <span className="block h-1.5 w-8 rounded-full bg-[#E2E8F0]" />
          </div>
          <div className="flex justify-center px-3 pb-3">
            <span className="rounded-md bg-[#1865EA] px-2.5 py-1 text-[8px] font-bold tracking-wide text-white">
              PACKAGES
            </span>
          </div>
        </div>

        {/* Check badge */}
        <span className="absolute -top-3 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-[#1865EA] text-white shadow-md">
          <Check className="size-4" strokeWidth={3} />
        </span>
      </div>

      {/* Bell */}
      <div className="absolute top-16 right-6">
        <span className="relative flex size-9 items-center justify-center rounded-full bg-[#1865EA] text-white shadow-md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#EF4444] text-[8px] font-bold text-white">
            1
          </span>
        </span>
      </div>

      {/* Coins */}
      <div className="absolute right-10 bottom-10">
        <div className="relative">
          <span className="block size-8 rounded-full border-2 border-[#F59E0B] bg-[#FBBF24] shadow-sm" />
          <span className="absolute -top-2 left-3 block size-8 rounded-full border-2 border-[#F59E0B] bg-[#FCD34D]" />
          <span className="absolute -top-4 left-1.5 block size-8 rounded-full border-2 border-[#D97706] bg-[#F59E0B]" />
        </div>
      </div>

      {/* Shield */}
      <div className="absolute right-4 bottom-20">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#1865EA] text-white shadow-md">
          <Check className="size-4" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

function DeletePackageModal({ open, onClose, onConfirm }) {
  const [mounted, setMounted] = useState(false);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-package-title"
        className="relative w-full max-w-[340px] rounded-[1.5rem] bg-white px-5 pt-8 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative mx-auto mb-5 flex size-20 items-center justify-center">
          <span className="absolute -top-1 left-2 text-sm font-bold text-[#F87171]">
            +
          </span>
          <span className="absolute top-1 right-1 size-2 rounded-full border-2 border-[#F87171]" />
          <span className="absolute bottom-2 left-0 text-xs font-bold text-[#FCA5A5]">
            +
          </span>
          <span className="absolute right-0 bottom-3 size-1.5 rounded-full bg-[#FCA5A5]" />
          <span className="flex size-16 items-center justify-center rounded-full bg-[#FEE2E2]">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-sm">
              <Trash2 className="size-5" strokeWidth={2.2} />
            </span>
          </span>
        </div>

        <h2
          id="delete-package-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          Delete Package
        </h2>
        <p className="mx-auto mt-2 max-w-[260px] text-center text-sm leading-relaxed text-[#64748B]">
          Are you sure you want to remove this Package from your Service?
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E8ECF1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-xl bg-[#EF4444] text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PackageCard({ pkg, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const theme = THEME_STYLES[pkg.theme] || THEME_STYLES.pink;
  const savePercent = getSavePercent(pkg);
  const features = (pkg.features || []).slice(0, 4);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl p-3.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
        theme.card,
      )}
    >
      <div className="flex gap-3">
        <div className="relative size-[4.75rem] shrink-0 overflow-hidden rounded-xl bg-white/70">
          <Image
            src={pkg.image || "/icons/provider-expert-logo.png"}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="min-w-0 flex-1 text-[14.5px] leading-snug font-bold text-[#0F172A]">
              {pkg.name}
            </h3>
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex size-8 items-center justify-center rounded-full bg-[#E8F1FF] text-[#64748B] transition-colors hover:bg-[#D6E6FF]"
                aria-label="Package actions"
                aria-expanded={menuOpen}
              >
                <MoreVertical className="size-4" />
              </button>
              {menuOpen ? (
                <div className="absolute top-full right-0 z-20 mt-1.5 min-w-[8.5rem] overflow-hidden rounded-xl border border-[#EEF1F6] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFF]"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(pkg);
                    }}
                  >
                    <Pencil className="size-3.5 text-[#64748B]" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFF]"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(pkg);
                    }}
                  >
                    <Trash2 className="size-3.5 text-[#64748B]" />
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-2 flex gap-3">
            <ul className="min-w-0 flex-1 space-y-1.5">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-1.5">
                  <span
                    className={cn(
                      "mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full text-white",
                      theme.check,
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-[11.5px] leading-snug text-[#64748B]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex w-[4.75rem] shrink-0 flex-col items-end justify-center border-l border-black/5 pl-2.5">
              <span className={cn("text-[17px] font-bold tabular-nums", theme.price)}>
                {formatCurrency(pkg.price)}
              </span>
              {savePercent > 0 ? (
                <span
                  className={cn(
                    "mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                    theme.badge,
                  )}
                >
                  Save {savePercent}%
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProviderPackagesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const packages = useProviderPackagesStore((s) => s.packages);
  const deletePackage = useProviderPackagesStore((s) => s.deletePackage);

  const [pendingDelete, setPendingDelete] = useState(null);

  const list = forceEmpty ? [] : packages;
  const isEmpty = list.length === 0;

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    deletePackage(pendingDelete.id);
    setPendingDelete(null);
    toast.success("Package deleted");
  };

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
          <h1 className="flex-1 truncate text-[17px] font-bold text-[#111827]">
            Packages
          </h1>
          <Link
            href={ROUTES.PROVIDER_PACKAGES_NEW}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label="Add package"
          >
            <Plus className="size-5" strokeWidth={2.4} />
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 lg:px-6 lg:py-6">
          {isEmpty ? (
            <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-4 pb-16 text-center">
              <PackagesEmptyIllustration />
              <h2 className="text-xl font-bold text-[#0F172A]">No Packages Yet</h2>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#94A3B8]">
                You don&apos;t have any upcoming Service. Let&apos;s schedule your first
                appointment.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {list.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onEdit={(p) => router.push(providerPackageEditRoute(p.id))}
                  onDelete={setPendingDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <DeletePackageModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

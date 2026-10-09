"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Home,
  MoreVertical,
  Pencil,
  Percent,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { ROUTES, providerServiceEditRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { useProviderServicesStore } from "@/store/provider-services.store";
import { formatCurrency, formatDate } from "@/utils/format.utils";

function getOfferLabel(service) {
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
  if (service.discountType === "rupee" && service.discountValue > 0) {
    return `₹${service.discountValue} OFF`;
  }
  return null;
}

function formatOfferRange(start, end) {
  if (!start && !end) return "—";
  const from = start ? formatDate(start, "dd MMM") : "—";
  const to = end ? formatDate(end, "dd MMM") : "—";
  if (start && end) return `${from} To ${to}`;
  return start ? from : to;
}

function ServicesEmptyIllustration() {
  return (
    <div className="relative mx-auto mb-6 flex h-48 w-56 items-end justify-center">
      <span className="absolute top-4 left-8 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-10 right-10 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute top-16 left-14 size-1 rounded-full bg-[#BFDBFE]" />
      <span className="absolute right-12 bottom-28 size-1.5 rounded-full bg-[#93C5FD]" />

      {/* Plant */}
      <div className="absolute bottom-10 left-3 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-7 w-2.5 rounded-t-full bg-[#22C55E]" />
          <span className="h-4 w-2 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-5 w-7 rounded-b-lg bg-[#93C5FD]" />
      </div>

      {/* Calendar */}
      <div className="relative z-10 mb-6 drop-shadow-md">
        <div className="w-[7.25rem] overflow-hidden rounded-2xl border-[3px] border-[#1865EA] bg-white shadow-sm">
          <div className="flex h-7 items-center justify-center gap-3 bg-[#1865EA]">
            <span className="size-2 rounded-full bg-white/90" />
            <span className="size-2 rounded-full bg-white/90" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-2.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "flex size-5 items-center justify-center rounded-md text-[9px] font-semibold",
                  i === 4 ? "bg-[#1865EA] text-white" : "bg-[#E8F1FF] text-[#94A3B8]",
                )}
              >
                {i === 4 ? "12" : ""}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Chair */}
      <div className="absolute right-2 bottom-8">
        <div className="relative">
          <div className="h-10 w-14 rounded-t-2xl bg-[#5B8DEF]" />
          <div className="mx-auto h-3 w-16 rounded-md bg-[#3B6FD9]" />
          <div className="mt-0.5 flex justify-between px-1">
            <span className="h-5 w-1.5 rounded-full bg-[#93C5FD]" />
            <span className="h-5 w-1.5 rounded-full bg-[#93C5FD]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AttrTile({ icon: Icon, iconWrap, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
          iconWrap,
        )}
      >
        <Icon className="size-4" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[#94A3B8]">{label}</p>
        <p className="truncate text-[12.5px] font-semibold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

function ServiceCard({ service, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const offer = getOfferLabel(service);

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
    <article className="relative overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex gap-3 p-3.5 pb-3">
        <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-[#E8F1FF]">
          <Image
            src={service.image || "/icons/provider-expert-logo.png"}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1 pr-8">
          <h3 className="truncate text-[15px] font-bold text-[#0F172A]">
            {service.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-[#94A3B8]">
            {service.description || "No description"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-[15px] font-bold text-[#1865EA]">
              {formatCurrency(service.price)}
            </span>
            {service.originalPrice > service.price ? (
              <span className="text-[12.5px] text-[#94A3B8] line-through">
                {formatCurrency(service.originalPrice)}
              </span>
            ) : null}
            {offer ? (
              <span className="rounded-full bg-[#FCE7F3] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#DB2777]">
                {offer}
              </span>
            ) : null}
          </div>
        </div>

        <div className="absolute top-3 right-3" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex size-8 items-center justify-center rounded-full bg-[#F4F7FF] text-[#64748B] transition-colors hover:bg-[#E8F1FF]"
            aria-label="Service actions"
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
                  onEdit(service);
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
                  onDelete(service);
                }}
              >
                <Trash2 className="size-3.5 text-[#64748B]" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-3 border-t border-[#EEF1F6] px-3.5 py-3">
        <AttrTile
          icon={CalendarDays}
          iconWrap="bg-[#FFE4EC] text-[#E91E63]"
          label="Available From"
          value={formatOfferRange(service.offerStart, service.offerEnd)}
        />
        <AttrTile
          icon={Video}
          iconWrap="bg-[#E8F1FF] text-[#1865EA]"
          label="Online"
          value={
            service.online
              ? (service.onlineModes || ["Video", "Audio Call"]).join(", ")
              : "—"
          }
        />
        <AttrTile
          icon={Home}
          iconWrap="bg-[#FFE4EC] text-[#EC407A]"
          label="Home Visit"
          value={service.atHome ? formatCurrency(service.travelFee || 0) : "—"}
        />
        <AttrTile
          icon={Percent}
          iconWrap="bg-[#F3E8FF] text-[#9333EA]"
          label="Offer"
          value={offer || "—"}
        />
      </div>
    </article>
  );
}

export function ProviderServicesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const services = useProviderServicesStore((s) => s.services);
  const deleteService = useProviderServicesStore((s) => s.deleteService);

  const list = forceEmpty ? [] : services;
  const isEmpty = list.length === 0;

  const handleDelete = (service) => {
    deleteService(service.id);
    toast.success("Service deleted");
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
          <h1 className="flex-1 truncate text-center text-lg font-bold text-[#111827]">
            My Services
          </h1>
          <Link
            href={ROUTES.PROVIDER_SERVICES_NEW}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label="Add service"
          >
            <Plus className="size-5" strokeWidth={2.4} />
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-4 lg:px-6 lg:py-6">
          {isEmpty ? (
            <div className="flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center px-4 pb-16 text-center">
              <ServicesEmptyIllustration />
              <h2 className="text-xl font-bold text-[#0F172A]">No Services Yet</h2>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#94A3B8]">
                You don&apos;t have any services yet. Add your first service to get
                started.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {list.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={(s) => router.push(providerServiceEditRoute(s.id))}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

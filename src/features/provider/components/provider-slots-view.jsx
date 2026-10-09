"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { ROUTES, providerSlotEditRoute } from "@/constants/routes.constants";
import {
  PROVIDER_DESKTOP_GRID,
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { slotCountLabel, useProviderSlotsStore } from "@/store/provider-slots.store";
import { formatDate } from "@/utils/format.utils";

const REASON_MAX = 500;

function PackIcon({ src, className, alt = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-contain", className)}
      draggable={false}
    />
  );
}

function SlotsEmptyIllustration() {
  return (
    <div className="relative mx-auto mb-6 flex h-52 w-64 items-end justify-center">
      <span className="absolute top-6 left-10 size-1.5 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-12 right-14 size-1 rounded-full bg-[#60A5FA]" />
      <span className="absolute top-20 left-16 size-1.5 rounded-full bg-[#BFDBFE]" />
      <span className="absolute right-10 bottom-36 size-1 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-10 right-20 text-[10px] text-[#93C5FD]">✦</span>

      <svg
        className="absolute top-8 right-8 text-[#60A5FA]"
        width="36"
        height="28"
        viewBox="0 0 36 28"
        fill="none"
        aria-hidden
      >
        <path
          d="M2 18c6-2 10-8 14-10 3-1.5 8-2 12 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <path d="M28 6l6 4-7 1 1-5z" fill="currentColor" />
      </svg>

      <div className="absolute bottom-12 left-4 flex flex-col items-center">
        <div className="mb-0.5 flex items-end gap-0.5">
          <span className="h-5 w-2.5 rounded-t-full bg-[#4ADE80]" />
          <span className="h-8 w-2.5 rounded-t-full bg-[#22C55E]" />
          <span className="h-5 w-2 rounded-t-full bg-[#86EFAC]" />
        </div>
        <div className="h-5 w-8 rounded-b-lg bg-[#93C5FD]" />
      </div>

      <div className="relative z-10 mb-8 drop-shadow-md">
        <div className="w-[7.5rem] overflow-hidden rounded-2xl border-[3px] border-[#1865EA] bg-white shadow-sm">
          <div className="flex h-7 items-center justify-center gap-3 bg-[#1865EA]">
            <span className="size-2 rounded-full bg-white/90" />
            <span className="size-2 rounded-full bg-white/90" />
          </div>
          <div className="relative grid grid-cols-3 gap-1.5 p-2.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="flex size-5 items-center justify-center rounded-md bg-[#E8F1FF]"
              />
            ))}
            <span className="absolute inset-0 m-auto flex size-9 items-center justify-center rounded-lg border-2 border-dashed border-[#1865EA] bg-white">
              <PackIcon src={PROVIDER_ICONS.plus} className="size-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-3 bottom-14 flex size-14 items-center justify-center rounded-full bg-[#1865EA] shadow-md">
        <span className="absolute size-11 rounded-full border-2 border-white/30" />
        <span className="absolute top-3 h-3.5 w-0.5 origin-bottom rotate-[-20deg] rounded-full bg-white" />
        <span className="absolute top-[1.35rem] h-2.5 w-0.5 origin-top rotate-[50deg] rounded-full bg-white/90" />
        <span className="absolute size-1.5 rounded-full bg-white" />
      </div>
    </div>
  );
}

function CardMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex size-8 items-center justify-center rounded-xl bg-[#E8F1FF] transition-colors hover:bg-[#DCE9FF]"
        aria-label="Actions"
        aria-expanded={open}
      >
        <PackIcon src={PROVIDER_ICONS.more} className="size-4" />
      </button>
      {open ? (
        <div className="absolute top-full right-0 z-20 mt-1.5 min-w-[8.5rem] overflow-hidden rounded-xl border border-[#EEF1F6] bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFF]"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <PackIcon src={PROVIDER_ICONS.edit} className="size-3.5 opacity-70" />
            Edit
          </button>
          <div className="mx-3 h-px bg-[#EEF1F6]" />
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-[#0F172A] hover:bg-[#F8FAFF]"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <PackIcon src={PROVIDER_ICONS.trash} className="size-3.5 opacity-70" />
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TimeDetail({ label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <PackIcon
        src={PROVIDER_ICONS.clock}
        className="mt-0.5 size-3.5 shrink-0 opacity-50"
      />
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[#94A3B8]">{label}</p>
        <p className="truncate text-[12.5px] font-semibold text-[#0F172A]">{value}</p>
      </div>
    </div>
  );
}

function SlotCountCell({ label, count, border }) {
  return (
    <div
      className={cn(
        "min-w-0 flex-1 px-2 py-1 text-center",
        border && "border-l border-[#E8EEF8]",
      )}
    >
      <p className="text-[10.5px] font-medium text-[#94A3B8]">{label}</p>
      <p className="mt-0.5 text-[17px] font-bold text-[#0F172A] tabular-nums">
        {slotCountLabel(count)}
      </p>
    </div>
  );
}

function WeeklyCard({ slot, onEdit, onDelete }) {
  const breakLabel =
    slot.breakIn && slot.breakOut ? `${slot.breakIn} – ${slot.breakOut}` : "—";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3 px-3.5 pt-3.5 pb-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F1FF]">
          <PackIcon src={PROVIDER_ICONS.calendarBlue} className="size-4" />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#0F172A]">
          {slot.day}
        </h3>
        <CardMenu onEdit={() => onEdit(slot)} onDelete={() => onDelete(slot)} />
      </div>

      <div className="mx-3.5 mb-3 grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl border border-[#E8EEF8] bg-white px-3 py-3">
        <TimeDetail label="Open Time" value={slot.openTime} />
        <TimeDetail label="Close Time" value={slot.closeTime} />
        <TimeDetail label="Break Time" value={breakLabel} />
        <TimeDetail label="Service Time" value={slot.serviceTime} />
      </div>

      <div className="mx-3.5 mb-3.5 flex items-stretch rounded-xl border border-[#E8EEF8] bg-[#FAFBFF] py-2.5">
        <SlotCountCell label="Morning Slot" count={slot.morningSlots?.length || 0} />
        <SlotCountCell
          label="Afternoon Slot"
          count={slot.afternoonSlots?.length || 0}
          border
        />
        <SlotCountCell
          label="Evening Slot"
          count={slot.eveningSlots?.length || 0}
          border
        />
      </div>
    </article>
  );
}

function HolidayCard({ holiday, onEdit, onDelete }) {
  const titleDate = formatDate(holiday.from, "dd MMM yyyy") || "Holiday";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-3 px-3.5 pt-3.5 pb-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFE4EC]">
          <PackIcon src={PROVIDER_ICONS.calendarPink} className="size-4" />
        </span>
        <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#0F172A]">
          {titleDate}
        </h3>
        <CardMenu onEdit={() => onEdit(holiday)} onDelete={() => onDelete(holiday)} />
      </div>

      <div className="mx-3.5 mb-3 grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-[#E8EEF8] bg-white">
        <div className="border-r border-[#E8EEF8] px-3 py-2.5">
          <div className="flex items-start gap-1.5">
            <PackIcon
              src={PROVIDER_ICONS.calendar}
              className="mt-0.5 size-3.5 shrink-0 opacity-45"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[#94A3B8]">From</p>
              <p className="mt-0.5 text-[12.5px] font-semibold text-[#0F172A]">
                {formatDate(holiday.from, "dd MMM yyyy") || "—"}
              </p>
            </div>
          </div>
        </div>
        <div className="px-3 py-2.5">
          <div className="flex items-start gap-1.5">
            <PackIcon
              src={PROVIDER_ICONS.calendar}
              className="mt-0.5 size-3.5 shrink-0 opacity-45"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-[#94A3B8]">To</p>
              <p className="mt-0.5 text-[12.5px] font-semibold text-[#0F172A]">
                {formatDate(holiday.to, "dd MMM yyyy") || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-3.5 pb-3.5">
        <p className="mb-1.5 text-[13px] font-semibold text-[#0F172A]">Reason</p>
        <div className="rounded-xl border border-[#E8EEF8] bg-white px-3.5 py-3 text-[13px] font-medium text-[#0F172A]">
          {holiday.reason || "—"}
        </div>
      </div>
    </article>
  );
}

function DeleteConfirmModal({ open, onClose, onConfirm }) {
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
        aria-labelledby="delete-slot-title"
        className="relative w-full max-w-[340px] rounded-[1.75rem] bg-white px-5 pt-8 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
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
          <span className="flex size-16 items-center justify-center rounded-full bg-[#FEE2E2] ring-4 ring-[#FEE2E2]/60">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-sm">
              <PackIcon
                src={PROVIDER_ICONS.trashRed}
                className="size-5 brightness-0 invert"
              />
            </span>
          </span>
        </div>

        <h2
          id="delete-slot-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          Delete Slot
        </h2>
        <p className="mx-auto mt-2 max-w-[260px] text-center text-sm leading-relaxed text-[#64748B]">
          Are you sure you want to remove this slot from your schedule?
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

function HolidayScheduleModal({ open, onClose, initial, onSubmit }) {
  const [mounted, setMounted] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setFrom(initial?.from || "");
    setTo(initial?.to || "");
    setReason(initial?.reason || "");
  }, [open, initial]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) {
      toast.error("Please select From and To dates");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    onSubmit({ from, to, reason: reason.trim() });
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-schedule-title"
        onSubmit={handleSubmit}
        className="relative w-full max-w-[380px] rounded-[1.75rem] bg-white px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <h2
          id="holiday-schedule-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          Holiday Schedule
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#334155]">
              From
            </label>
            <div className="relative">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3 pr-10 text-sm font-medium text-[#0F172A] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <span className="pointer-events-none absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center">
                <PackIcon src={PROVIDER_ICONS.calendarBlue} className="size-5" />
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#334155]">
              To
            </label>
            <div className="relative">
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3 pr-10 text-sm font-medium text-[#0F172A] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <span className="pointer-events-none absolute top-1/2 right-2.5 flex size-6 -translate-y-1/2 items-center justify-center">
                <PackIcon src={PROVIDER_ICONS.calendarBlue} className="size-5" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-[13px] font-semibold text-[#334155]">
            Reason
          </label>
          <div className="relative">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX))}
              placeholder="ABC..."
              rows={4}
              className="w-full resize-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-3 pb-8 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
            />
            <span className="pointer-events-none absolute right-3 bottom-2.5 text-[11px] font-medium text-[#94A3B8]">
              {reason.length}/{REASON_MAX}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E8ECF1]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-12 rounded-xl bg-[#1865EA] text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Submit
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

export function ProviderSlotsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forceEmpty = searchParams.get("empty") === "1";
  const tabParam = searchParams.get("tab");

  const weeklySchedules = useProviderSlotsStore((s) => s.weeklySchedules);
  const holidays = useProviderSlotsStore((s) => s.holidays);
  const deleteWeekly = useProviderSlotsStore((s) => s.deleteWeekly);
  const deleteHoliday = useProviderSlotsStore((s) => s.deleteHoliday);
  const addHoliday = useProviderSlotsStore((s) => s.addHoliday);
  const updateHoliday = useProviderSlotsStore((s) => s.updateHoliday);

  const [tab, setTab] = useState(tabParam === "holiday" ? "holiday" : "weekly");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [holidayModal, setHolidayModal] = useState(null);

  useEffect(() => {
    if (tabParam === "holiday" || tabParam === "weekly") {
      setTab(tabParam);
    }
  }, [tabParam]);

  const weeklyList = forceEmpty ? [] : weeklySchedules;
  const holidayList = forceEmpty ? [] : holidays;
  const isEmpty = tab === "weekly" ? weeklyList.length === 0 : holidayList.length === 0;

  const setTabAndUrl = (next) => {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`${ROUTES.PROVIDER_SLOTS}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleAdd = () => {
    if (tab === "holiday") {
      setHolidayModal({ mode: "create" });
      return;
    }
    router.push(ROUTES.PROVIDER_SLOTS_NEW);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "weekly") {
      deleteWeekly(deleteTarget.item.id);
      toast.success("Slot deleted");
    } else {
      deleteHoliday(deleteTarget.item.id);
      toast.success("Holiday deleted");
    }
    setDeleteTarget(null);
  };

  const handleHolidaySubmit = (form) => {
    if (holidayModal?.mode === "edit" && holidayModal.item?.id) {
      updateHoliday(holidayModal.item.id, form);
      toast.success("Holiday updated");
    } else {
      addHoliday(form);
      toast.success("Holiday added");
    }
    setHolidayModal(null);
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
            <PackIcon src={PROVIDER_ICONS.arrowLeft} className="size-5" />
          </button>
          <h1 className="flex-1 truncate text-center text-lg font-bold text-[#111827]">
            Slot Management
          </h1>
          <button
            type="button"
            onClick={handleAdd}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#1865EA] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label={tab === "holiday" ? "Add holiday" : "Add slot"}
          >
            <PackIcon
              src={PROVIDER_ICONS.plus}
              className="size-5 brightness-0 invert"
            />
          </button>
        </div>

        <div className={cn(PROVIDER_PAGE_SHELL, "pb-3")}>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#EEF2F7] p-1">
            <button
              type="button"
              onClick={() => setTabAndUrl("weekly")}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-colors",
                tab === "weekly"
                  ? "border border-[#1865EA] bg-white text-[#1865EA] shadow-sm"
                  : "border border-transparent text-[#64748B]",
              )}
            >
              Weekly schedule
            </button>
            <button
              type="button"
              onClick={() => setTabAndUrl("holiday")}
              className={cn(
                "h-10 rounded-lg text-sm font-semibold transition-colors",
                tab === "holiday"
                  ? "border border-[#1865EA] bg-white text-[#1865EA] shadow-sm"
                  : "border border-transparent text-[#64748B]",
              )}
            >
              Holiday
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(PROVIDER_PAGE_SHELL, "py-4 lg:py-6")}>
          {isEmpty ? (
            <div className="flex min-h-[calc(100dvh-11rem)] flex-col items-center justify-center px-4 pb-16 text-center">
              <SlotsEmptyIllustration />
              <h2 className="text-xl font-bold text-[#0F172A]">No Slots Added Yet</h2>
              <p className="mt-2 max-w-xs text-[13.5px] leading-relaxed text-[#94A3B8]">
                You haven&apos;t added any slots yet. Create your first slot to start
                receiving bookings.
              </p>
            </div>
          ) : tab === "weekly" ? (
            <div className={cn(PROVIDER_DESKTOP_GRID, "gap-3.5")}>
              {weeklyList.map((slot) => (
                <WeeklyCard
                  key={slot.id}
                  slot={slot}
                  onEdit={(item) => router.push(providerSlotEditRoute(item.id))}
                  onDelete={(item) => setDeleteTarget({ type: "weekly", item })}
                />
              ))}
            </div>
          ) : (
            <div className={cn(PROVIDER_DESKTOP_GRID, "gap-3.5")}>
              {holidayList.map((holiday) => (
                <HolidayCard
                  key={holiday.id}
                  holiday={holiday}
                  onEdit={(item) => setHolidayModal({ mode: "edit", item })}
                  onDelete={(item) => setDeleteTarget({ type: "holiday", item })}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <HolidayScheduleModal
        open={Boolean(holidayModal)}
        onClose={() => setHolidayModal(null)}
        initial={holidayModal?.item}
        onSubmit={handleHolidaySubmit}
      />
    </div>
  );
}

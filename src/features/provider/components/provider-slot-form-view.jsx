"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
} from "date-fns";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Umbrella,
} from "lucide-react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import {
  SESSION_TIMES,
  TIME_OPTIONS,
  emptySlotForm,
  slotToForm,
  useProviderSlotsStore,
} from "@/store/provider-slots.store";
import { getLocalDateKey } from "@/utils/format.utils";

function FieldLabel({ children }) {
  return (
    <label className="mb-1.5 block text-[13px] font-semibold text-[#334155]">
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

function TimeDropdown({ label, value, onChange }) {
  return (
    <div className="min-w-0">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-xl border border-[#E2E8F0] bg-white px-3.5 pr-10 text-sm font-medium text-[#0F172A] outline-none focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/20"
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={`${label}-${opt}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
      </div>
    </div>
  );
}

function SessionAccordion({ title, open, onToggle, times, selected, onToggleTime }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="text-[14.5px] font-bold text-[#0F172A]">{title}</span>
        <ChevronDown
          className={cn(
            "size-4 text-[#64748B] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="grid grid-cols-3 gap-2 border-t border-[#EEF1F6] px-3.5 py-3.5">
          {times.map((time) => {
            const isSelected = selected.includes(time);
            return (
              <button
                key={time}
                type="button"
                onClick={() => onToggleTime(time)}
                className={cn(
                  "rounded-xl px-2 py-2.5 text-center text-[12px] font-semibold transition-colors",
                  isSelected
                    ? "border border-[#1865EA] bg-white text-[#1865EA]"
                    : "border border-transparent bg-[#F4F7FF] text-[#64748B]",
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function weekdayFromDate(date) {
  return format(date, "EEEE");
}

export function ProviderSlotFormView({ slotId } = {}) {
  const router = useRouter();
  const isEdit = Boolean(slotId);
  const getWeeklyById = useProviderSlotsStore((s) => s.getWeeklyById);
  const addWeekly = useProviderSlotsStore((s) => s.addWeekly);
  const updateWeekly = useProviderSlotsStore((s) => s.updateWeekly);

  const existing = isEdit ? getWeeklyById(slotId) : null;

  const initialDate = (() => {
    if (existing?.dateKey) {
      try {
        return parseISO(existing.dateKey);
      } catch {
        /* fall through */
      }
    }
    return new Date(2026, 4, 3);
  })();

  const [form, setForm] = useState(() => {
    if (isEdit) return slotToForm(existing);
    return {
      ...emptySlotForm(),
      dateKey: getLocalDateKey(initialDate),
      day: weekdayFromDate(initialDate),
    };
  });
  const [monthCursor, setMonthCursor] = useState(() => startOfMonth(initialDate));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [openSession, setOpenSession] = useState("morning");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const slot = getWeeklyById(slotId);
    if (slot) setForm(slotToForm(slot));
  }, [isEdit, slotId, getWeeklyById]);

  const days = useMemo(() => {
    const start = startOfMonth(monthCursor);
    const end = endOfMonth(monthCursor);
    return eachDayOfInterval({ start, end });
  }, [monthCursor]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSessionTime = (sessionKey, time) => {
    setForm((prev) => {
      const list = prev[sessionKey] || [];
      const next = list.includes(time)
        ? list.filter((t) => t !== time)
        : [...list, time];
      return { ...prev, [sessionKey]: next };
    });
  };

  const handleSelectDate = (day) => {
    setSelectedDate(day);
    setForm((prev) => ({
      ...prev,
      dateKey: getLocalDateKey(day),
      day: weekdayFromDate(day),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      dateKey: form.dateKey || getLocalDateKey(selectedDate),
      day: form.day || weekdayFromDate(selectedDate),
    };

    setSaving(true);
    try {
      if (isEdit) {
        updateWeekly(slotId, payload);
        toast.success("Slot updated");
      } else {
        addWeekly(payload);
        toast.success("Slot saved");
      }
      router.push(ROUTES.PROVIDER_SLOTS);
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && !existing) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-[#F4F7FF] px-4 text-center">
        <p className="font-semibold text-[#0F172A]">Slot not found</p>
        <button
          type="button"
          className="mt-3 text-sm font-semibold text-[#1865EA]"
          onClick={() => router.push(ROUTES.PROVIDER_SLOTS)}
        >
          Back to Slot Management
        </button>
      </div>
    );
  }

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
            Slot Management
          </h1>
        </div>
      </header>

      <form
        onSubmit={handleSave}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-4 pb-6 lg:px-6 lg:py-6">
            {/* Select Date */}
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-bold text-[#0F172A]">Select Date</h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMonthCursor((m) => addMonths(m, -1))}
                    className="flex size-8 items-center justify-center rounded-full text-[#64748B] hover:bg-white"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="min-w-[6.5rem] text-center text-sm font-semibold text-[#0F172A]">
                    {format(monthCursor, "MMM, yyyy")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMonthCursor((m) => addMonths(m, 1))}
                    className="flex size-8 items-center justify-center rounded-full text-[#64748B] hover:bg-white"
                    aria-label="Next month"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div className="-mx-1 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
                {days.map((day) => {
                  const selected = isSameDay(day, selectedDate);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => handleSelectDate(day)}
                      className={cn(
                        "flex w-[3.35rem] shrink-0 flex-col items-center rounded-xl px-2 py-2.5 transition-colors",
                        selected
                          ? "border border-[#1865EA] bg-white text-[#1865EA]"
                          : "border border-transparent bg-[#EEF2F7] text-[#64748B]",
                      )}
                    >
                      <span
                        className={cn(
                          "text-[15px] font-bold",
                          selected ? "text-[#1865EA]" : "text-[#0F172A]",
                        )}
                      >
                        {format(day, "dd")}
                      </span>
                      <span className="mt-0.5 text-[11px] font-medium">
                        {format(day, "EEE")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Holiday Mode */}
            <div className="flex items-center gap-3 rounded-2xl border border-[#EEF1F6] bg-white px-3.5 py-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.03)]">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFE4EC] text-[#E11D48]">
                <Umbrella className="size-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-bold text-[#0F172A]">Holiday Mode</p>
                <p className="text-[12px] font-medium text-[#94A3B8]">
                  At Not Available
                </p>
              </div>
              <ToggleSwitch
                checked={form.holidayMode}
                onChange={(v) => setField("holidayMode", v)}
                label="Holiday Mode"
              />
            </div>

            {/* Time dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <TimeDropdown
                label="Open Time"
                value={form.openTime}
                onChange={(v) => setField("openTime", v)}
              />
              <TimeDropdown
                label="Close Time"
                value={form.closeTime}
                onChange={(v) => setField("closeTime", v)}
              />
              <TimeDropdown
                label="Break In"
                value={form.breakIn}
                onChange={(v) => setField("breakIn", v)}
              />
              <TimeDropdown
                label="Break Out"
                value={form.breakOut}
                onChange={(v) => setField("breakOut", v)}
              />
              <TimeDropdown
                label="Service Time"
                value={form.serviceTime}
                onChange={(v) => setField("serviceTime", v)}
              />
            </div>

            {/* Sessions */}
            <div className="space-y-3">
              <SessionAccordion
                title="Morning Session"
                open={openSession === "morning"}
                onToggle={() =>
                  setOpenSession((s) => (s === "morning" ? "" : "morning"))
                }
                times={SESSION_TIMES.morning}
                selected={form.morningSlots}
                onToggleTime={(t) => toggleSessionTime("morningSlots", t)}
              />
              <SessionAccordion
                title="Afternoon Session"
                open={openSession === "afternoon"}
                onToggle={() =>
                  setOpenSession((s) => (s === "afternoon" ? "" : "afternoon"))
                }
                times={SESSION_TIMES.afternoon}
                selected={form.afternoonSlots}
                onToggleTime={(t) => toggleSessionTime("afternoonSlots", t)}
              />
              <SessionAccordion
                title="Evening Session"
                open={openSession === "evening"}
                onToggle={() =>
                  setOpenSession((s) => (s === "evening" ? "" : "evening"))
                }
                times={SESSION_TIMES.evening}
                selected={form.eveningSlots}
                onToggleTime={(t) => toggleSessionTime("eveningSlots", t)}
              />
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
              {saving ? "Saving…" : "Update Slot"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

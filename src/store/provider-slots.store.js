import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TIME_OPTIONS = (() => {
  const options = [];
  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
      options.push(label);
    }
  }
  return options;
})();

export const SESSION_TIMES = {
  morning: [
    "06:00 AM",
    "06:30 AM",
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  afternoon: [
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ],
  evening: [
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
  ],
};

function createWeeklyId() {
  return `wslot_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function createHolidayId() {
  return `hol_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const SAMPLE_MORNING = [
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
];

const SAMPLE_AFTERNOON = [
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
];

const SAMPLE_EVENING = [
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
];

function makeWeeklySample(id, day, dateKey) {
  return {
    id,
    day,
    dateKey,
    holidayMode: false,
    openTime: "09:30 AM",
    closeTime: "10:00 PM",
    breakIn: "12:00 PM",
    breakOut: "12:30 PM",
    serviceTime: "12:00 AM",
    morningSlots: [...SAMPLE_MORNING],
    afternoonSlots: [...SAMPLE_AFTERNOON],
    eveningSlots: [...SAMPLE_EVENING],
  };
}

export const SAMPLE_WEEKLY_SCHEDULES = [
  makeWeeklySample("wslot_1", "Monday", "2026-05-04"),
  makeWeeklySample("wslot_2", "Tuesday", "2026-05-05"),
  makeWeeklySample("wslot_3", "Wednesday", "2026-05-06"),
];

export const SAMPLE_HOLIDAYS = [
  {
    id: "hol_1",
    from: "2026-07-05",
    to: "2026-07-06",
    reason: "Family Function",
  },
  {
    id: "hol_2",
    from: "2026-07-05",
    to: "2026-07-06",
    reason: "Family Function",
  },
  {
    id: "hol_3",
    from: "2026-07-05",
    to: "2026-07-06",
    reason: "Family Function",
  },
];

export const emptySlotForm = () => ({
  day: "Monday",
  dateKey: "",
  holidayMode: false,
  openTime: "09:30 AM",
  closeTime: "10:30 PM",
  breakIn: "09:30 AM",
  breakOut: "12:30 PM",
  serviceTime: "09:30 AM",
  morningSlots: ["11:30 AM"],
  afternoonSlots: [],
  eveningSlots: [],
});

export function slotToForm(slot) {
  if (!slot) return emptySlotForm();
  return {
    day: slot.day || "Monday",
    dateKey: slot.dateKey || "",
    holidayMode: Boolean(slot.holidayMode),
    openTime: slot.openTime || "09:30 AM",
    closeTime: slot.closeTime || "10:30 PM",
    breakIn: slot.breakIn || "12:00 PM",
    breakOut: slot.breakOut || "12:30 PM",
    serviceTime: slot.serviceTime || "09:30 AM",
    morningSlots: [...(slot.morningSlots || [])],
    afternoonSlots: [...(slot.afternoonSlots || [])],
    eveningSlots: [...(slot.eveningSlots || [])],
  };
}

function normalizeWeekly(form, existingId) {
  return {
    id: existingId || createWeeklyId(),
    day: form.day || "Monday",
    dateKey: form.dateKey || "",
    holidayMode: Boolean(form.holidayMode),
    openTime: form.openTime || "09:30 AM",
    closeTime: form.closeTime || "10:00 PM",
    breakIn: form.breakIn || "12:00 PM",
    breakOut: form.breakOut || "12:30 PM",
    serviceTime: form.serviceTime || "12:00 AM",
    morningSlots: form.morningSlots || [],
    afternoonSlots: form.afternoonSlots || [],
    eveningSlots: form.eveningSlots || [],
  };
}

function normalizeHoliday(form, existingId) {
  return {
    id: existingId || createHolidayId(),
    from: form.from || "",
    to: form.to || "",
    reason: (form.reason || "").trim(),
  };
}

export function slotCountLabel(count) {
  return String(count).padStart(2, "0");
}

export const useProviderSlotsStore = create(
  devtools(
    persist(
      (set, get) => ({
        weeklySchedules: SAMPLE_WEEKLY_SCHEDULES,
        holidays: SAMPLE_HOLIDAYS,

        getWeeklyById: (id) => get().weeklySchedules.find((item) => item.id === id),

        getHolidayById: (id) => get().holidays.find((item) => item.id === id),

        addWeekly: (form) => {
          const slot = normalizeWeekly(form);
          set((state) => ({
            weeklySchedules: [...state.weeklySchedules, slot],
          }));
          return slot;
        },

        updateWeekly: (id, form) => {
          const slot = normalizeWeekly(form, id);
          set((state) => ({
            weeklySchedules: state.weeklySchedules.map((item) =>
              item.id === id ? slot : item,
            ),
          }));
          return slot;
        },

        deleteWeekly: (id) => {
          set((state) => ({
            weeklySchedules: state.weeklySchedules.filter((item) => item.id !== id),
          }));
        },

        addHoliday: (form) => {
          const holiday = normalizeHoliday(form);
          set((state) => ({
            holidays: [holiday, ...state.holidays],
          }));
          return holiday;
        },

        updateHoliday: (id, form) => {
          const holiday = normalizeHoliday(form, id);
          set((state) => ({
            holidays: state.holidays.map((item) => (item.id === id ? holiday : item)),
          }));
          return holiday;
        },

        deleteHoliday: (id) => {
          set((state) => ({
            holidays: state.holidays.filter((item) => item.id !== id),
          }));
        },

        resetToSample: () =>
          set({
            weeklySchedules: SAMPLE_WEEKLY_SCHEDULES,
            holidays: SAMPLE_HOLIDAYS,
          }),
      }),
      createPersistOptions({ name: "bookento-provider-slots" }),
    ),
    { name: "ProviderSlotsStore" },
  ),
);

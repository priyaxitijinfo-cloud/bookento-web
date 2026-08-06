import { generateId, isoDate } from "./helpers";

export const earningsSummary = {
  totalEarnings: 485600,
  pendingSettlement: 32400,
  availableBalance: 52300,
  todayEarnings: 4850,
  monthlyEarnings: 68400,
  earningsTrend: 12.5,
  settlementTrend: -3.2,
  appointmentsTrend: 8.7,
  monthlyEarningsChart: [
    { month: "Jan", value: 42000 },
    { month: "Feb", value: 38500 },
    { month: "Mar", value: 51200 },
    { month: "Apr", value: 47800 },
    { month: "May", value: 55600 },
    { month: "Jun", value: 62100 },
    { month: "Jul", value: 68400 },
  ],
  monthlyAppointmentsChart: [
    { month: "Jan", value: 145 },
    { month: "Feb", value: 132 },
    { month: "Mar", value: 168 },
    { month: "Apr", value: 155 },
    { month: "May", value: 178 },
    { month: "Jun", value: 192 },
    { month: "Jul", value: 210 },
  ],
  weeklyEarnings: [
    { day: "Mon", value: 4200 },
    { day: "Tue", value: 5800 },
    { day: "Wed", value: 6100 },
    { day: "Thu", value: 7200 },
    { day: "Fri", value: 8900 },
    { day: "Sat", value: 12400 },
    { day: "Sun", value: 9800 },
  ],
};

export const earningsByService = Array.from({ length: 10 }, (_, i) => ({
  service: ["Haircut", "Massage", "Facial", "Manicure", "Spa Package", "Consultation", "Training", "Cleaning", "Repair", "Styling"][i],
  earnings: 15000 + i * 3500,
  bookings: 20 + i * 8,
  percentage: 25 - i * 2,
}));

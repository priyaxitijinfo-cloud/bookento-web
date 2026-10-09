import { generateId, isoDate } from "./helpers";

export const earningsSummary = {
  totalEarnings: 105320,
  pendingSettlement: 45236,
  availableBalance: 11220,
  walletBalance: 12560,
  coinConversionRate: 10,
  coinConversionUnit: 1000,
  minimumWithdraw: 200,
  todayEarnings: 4850,
  monthlyEarnings: 68400,
  earningsTrend: 12.5,
  settlementTrend: 12.5,
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
  /** Chart plot values (0–100 scale) + tooltip booking counts */
  serviceBookingChart: [
    { month: "Jan", value: 42, bookings: 1450 },
    { month: "Feb", value: 55, bookings: 1820 },
    { month: "Mar", value: 48, bookings: 1680 },
    { month: "Apr", value: 62, bookings: 2100 },
    { month: "May", value: 78, bookings: 2678 },
    { month: "Jun", value: 58, bookings: 1980 },
    { month: "July", value: 70, bookings: 2340 },
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

export const earningsChartPeriods = [
  { id: "apr-2026", label: "April 2026", year: 2026, monthIndex: 3 },
  { id: "mar-2026", label: "March 2026", year: 2026, monthIndex: 2 },
  { id: "feb-2026", label: "February 2026", year: 2026, monthIndex: 1 },
  { id: "jan-2026", label: "January 2026", year: 2026, monthIndex: 0 },
];

export const paymentGateways = [
  { id: "gpay", label: "Google Pay", logo: "G" },
  { id: "phonepe", label: "PhonePe", logo: "P" },
  { id: "paytm", label: "Paytm", logo: "₹" },
  { id: "upi", label: "UPI", logo: "U" },
];

export const earningsByService = Array.from({ length: 10 }, (_, i) => ({
  service: [
    "Haircut",
    "Massage",
    "Facial",
    "Manicure",
    "Spa Package",
    "Consultation",
    "Training",
    "Cleaning",
    "Repair",
    "Styling",
  ][i],
  earnings: 15000 + i * 3500,
  bookings: 20 + i * 8,
  percentage: 25 - i * 2,
}));

export function getEarningsReportFileName(year, monthIndex) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `earnings-report-${months[monthIndex]}-${year}.pdf`;
}

export const demoEarningsReport = {
  id: generateId("report", 1),
  createdAt: isoDate(0),
};

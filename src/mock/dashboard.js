import { earningsSummary } from "./earnings";
import { getPendingAppointments, providerAppointments } from "./appointments";
import { currentUser } from "./users";

export const userDashboard = {
  upcomingAppointments: 3,
  completedBookings: 24,
  savedProviders: 8,
  walletBalance: currentUser.walletBalance,
  recentActivity: [
    { type: "booking", message: "Booked Haircut at Urban Salon", time: "2 hours ago" },
    { type: "review", message: "Reviewed Quiet Garden Spa", time: "1 day ago" },
    { type: "payment", message: "Added ₹500 to wallet", time: "3 days ago" },
  ],
};

export const providerDashboard = {
  todayEarnings: earningsSummary.todayEarnings,
  monthlyEarnings: earningsSummary.monthlyEarnings,
  pendingAppointments: getPendingAppointments().length,
  completedAppointments: providerAppointments.filter((a) => a.status === "completed").length,
  cancelledAppointments: providerAppointments.filter((a) => a.status === "cancelled").length,
  totalCustomers: 342,
  averageRating: 4.7,
  earningsTrend: earningsSummary.earningsTrend,
  appointmentsTrend: earningsSummary.appointmentsTrend,
  todaySchedule: providerAppointments.filter((a) => a.status === "upcoming" || a.status === "confirmed").slice(0, 5),
  quickStats: [
    { label: "Today's Bookings", value: 8, change: "+2" },
    { label: "This Week", value: 42, change: "+12%" },
    { label: "Revenue", value: "₹48.5K", change: "+8%" },
    { label: "Rating", value: "4.7", change: "+0.2" },
  ],
};

export const homeFeed = {
  banners: 10,
  categories: 30,
  providers: 100,
  services: 50,
  packages: 20,
};

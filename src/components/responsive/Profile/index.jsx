"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { ROUTES } from "@/constants/routes.constants";
import { setBackFromSource } from "@/lib/navigation/back-navigation";
import { appointments } from "@/mock/appointments";
import { reviews } from "@/mock/reviews";
import { useUserAuthStore, useUserProfileStore } from "@/store";

import { ProfileDesktop } from "./ProfileDesktop";
import { ProfileMobile } from "./ProfileMobile";
import { ProfileTablet } from "./ProfileTablet";

export function ProfileResponsive() {
  const { profile } = useUserProfileStore();
  const { logout } = useUserAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.preferences?.notifications ?? true,
  );
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setBackFromSource("profile");
  }, []);

  const stats = useMemo(() => {
    const userAppointments = appointments.filter((item) => item.userId === profile.id);
    const totalExpenses = userAppointments.reduce((sum, item) => sum + (item.amount || 0), 0);
    const reviewCount = reviews.filter((item) => item.userId === profile.id).length;

    return [
      { value: profile.totalBookings ?? userAppointments.length, label: "Bookings" },
      {
        value: totalExpenses > 0 ? totalExpenses.toLocaleString("en-IN") : "1000",
        label: "Expenses",
      },
      { value: reviewCount || 12, label: "Review" },
    ];
  }, [profile.id, profile.totalBookings]);

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      window.location.href = ROUTES.USER_LOGIN;
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  const handlePlaceholder = (label) => {
    toast.message(`${label} coming soon`);
  };

  const sharedProps = {
    profile,
    stats,
    notificationsEnabled,
    setNotificationsEnabled,
    onLogout: () => setLogoutOpen(true),
    onPlaceholder: handlePlaceholder,
  };

  return (
    <>
      <ResponsiveView
        mobile={<ProfileMobile {...sharedProps} />}
        tablet={<ProfileTablet {...sharedProps} />}
        desktop={<ProfileDesktop {...sharedProps} />}
      />

      <LogoutConfirmResponsive
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogoutConfirm}
        loading={loggingOut}
      />
    </>
  );
}

export default ProfileResponsive;

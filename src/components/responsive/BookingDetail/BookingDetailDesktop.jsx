"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Check, Copy, Phone } from "lucide-react";
import { toast } from "sonner";

import { CallRestrictionModal } from "@/components/appointments/call-restriction-modal";
import { CancelAppointmentModal } from "@/components/appointments/cancel-appointment-modal";
import { RebookAppointmentModal } from "@/components/appointments/rebook-appointment-modal";
import { getBookingTabLabel } from "@/components/appointments/booking-tab-bar";
import {
  BookingCalendarIcon,
  BookingClockIcon,
  BookingLocationIcon,
} from "@/components/icons/booking-detail-icons";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { ROUTES, chatDetailRoute } from "@/constants/routes.constants";
import { conversations } from "@/mock/chat";
import { getPaymentStatusLabel } from "@/mock/appointments";
import { getProviderById } from "@/mock/providers";
import { useFilterStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/utils/format.utils";
import { copyToClipboard } from "@/utils/share.utils";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

const ACTIVE_STATUSES = [
  APPOINTMENT_STATUS.PENDING,
  APPOINTMENT_STATUS.CONFIRMED,
  APPOINTMENT_STATUS.UPCOMING,
];

function findChatRoute(providerId) {
  const conversation = conversations.find((item) => item.participantId === providerId);
  return conversation ? chatDetailRoute(conversation.id) : ROUTES.CHATS;
}

function canStartCall(scheduledDate, scheduledTime) {
  const match = scheduledTime?.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  const appointmentDate = new Date(`${scheduledDate}T00:00:00`);
  appointmentDate.setHours(hours, minutes, 0, 0);

  const diffMs = appointmentDate.getTime() - Date.now();
  return diffMs <= 10 * 60 * 1000 && diffMs >= -60 * 60 * 1000;
}

function DesktopBookingHeader({ backLabel, tabLabel, onCall }) {
  return (
    <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center justify-between gap-6 px-6 lg:px-8">
      <div className="min-w-0">
        <Link
          href={ROUTES.APPOINTMENTS}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {backLabel}
        </Link>
        <h1 className="truncate text-xl font-semibold text-foreground">
          Booking Details · {tabLabel}
        </h1>
      </div>
      <button
        type="button"
        onClick={onCall}
        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors hover:bg-[#EAF3FF]"
        aria-label="Call provider"
      >
        <Phone className="size-5" />
      </button>
    </div>
  );
}

export function BookingDetailDesktop({ appointment: initialAppointment }) {
  const router = useRouter();
  const { appointmentTab } = useFilterStore();
  const [appointment, setAppointment] = useState(initialAppointment);
  const [copiedBookingId, setCopiedBookingId] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rebookOpen, setRebookOpen] = useState(false);
  const [callRestrictionOpen, setCallRestrictionOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const provider = getProviderById(appointment.providerId);
  const platformFee = appointment.platformFee ?? 2000;
  const totalAmount = appointment.amount;
  const statusLabel = STATUS_LABELS[appointment.status] ?? appointment.status;
  const isActive = ACTIVE_STATUSES.includes(appointment.status);
  const isCancelled = [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.REJECTED].includes(appointment.status);
  const isCompleted = appointment.status === APPOINTMENT_STATUS.COMPLETED;
  const dateLabel = formatDate(appointment.scheduledDate, "EEE, MMM d yyyy");
  const locationLabel =
    appointment.locationName || provider?.businessName || appointment.address || "Provider location";
  const paymentLabel = getPaymentStatusLabel(appointment.paymentMethod);
  const chatHref = useMemo(() => findChatRoute(appointment.providerId), [appointment.providerId]);

  const handleCopyBookingId = async () => {
    const bookingId = appointment.bookingCode || appointment.id;
    const copied = await copyToClipboard(bookingId);
    if (!copied) {
      toast.error("Could not copy booking ID");
      return;
    }
    setCopiedBookingId(true);
    toast.success("Booking ID copied");
    window.setTimeout(() => setCopiedBookingId(false), 2000);
  };

  const handleCall = () => {
    if (canStartCall(appointment.scheduledDate, appointment.scheduledTime)) {
      router.push(`${ROUTES.CALL_AUDIO}?provider=${appointment.providerId}`);
      return;
    }
    setCallRestrictionOpen(true);
  };

  const handleCancelConfirm = async (reason) => {
    setActionLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setAppointment((current) => ({
      ...current,
      status: APPOINTMENT_STATUS.CANCELLED,
      cancelReason: reason,
    }));
    setActionLoading(false);
    setCancelOpen(false);
    toast.success("Appointment cancelled");
  };

  const handleRebookConfirm = async ({ date, time }) => {
    setActionLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    setAppointment((current) => ({
      ...current,
      status: APPOINTMENT_STATUS.UPCOMING,
      scheduledDate: date,
      scheduledTime: time,
    }));
    setActionLoading(false);
    setRebookOpen(false);
    toast.success("Appointment rescheduled");
  };

  return (
    <>
      <DesktopLayout
        header={(
          <DesktopBookingHeader
            backLabel="Back to My Bookings"
            tabLabel={getBookingTabLabel(appointmentTab)}
            onCall={handleCall}
          />
        )}
        maxWidth="wide"
      >
        <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ResponsiveCard className="!p-0 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-5">
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={appointment.providerAvatar}
                      alt={appointment.providerName}
                      fill
                      className="object-cover"
                      sizes="96px"
                      priority
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-foreground">{appointment.providerName}</h2>
                    <p className="mt-1 text-muted-foreground">{appointment.serviceName}</p>
                    <span
                      className={cn(
                        "mt-3 inline-flex rounded-full px-3.5 py-1 text-xs font-semibold capitalize",
                        isActive && "bg-[#EAF3FF] text-primary",
                        isCancelled && "bg-[#FEF3F3] text-[#F13339]",
                        isCompleted && "bg-[#EBF9ED] text-[#05B21F]",
                        !isActive && !isCancelled && !isCompleted && "bg-surface-page text-muted-foreground",
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-page px-4 py-3.5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-primary">
                      <BookingLocationIcon className="size-[18px]" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{locationLabel}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-page px-4 py-3.5">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-primary">
                      <BookingCalendarIcon className="size-[18px]" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{dateLabel}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-page px-4 py-3.5 sm:col-span-2">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-primary">
                      <BookingClockIcon className="size-[18px]" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{appointment.scheduledTime}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-6 py-4">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-[#EFF6FF] px-4 py-3.5">
                  <p className="text-sm font-semibold text-foreground">
                    Booking ID: <span className="text-primary">{appointment.bookingCode}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyBookingId}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl bg-background transition-colors hover:bg-background/80",
                      copiedBookingId ? "text-emerald-600" : "text-primary",
                    )}
                    aria-label={copiedBookingId ? "Booking ID copied" : "Copy booking ID"}
                  >
                    {copiedBookingId ? <Check className="size-4" strokeWidth={2.5} /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard>
              <h3 className="text-lg font-semibold text-foreground">Payment</h3>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-border bg-surface-page px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-[#05B21F] text-white">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <span className="text-sm font-medium text-foreground">{paymentLabel}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{formatCurrency(totalAmount)}</span>
              </div>
            </ResponsiveCard>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <ResponsiveCard>
              <h3 className="text-lg font-semibold text-foreground">Booking Summary</h3>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-foreground">{appointment.serviceName}</span>
                  <span className="font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-foreground">Platform Fees</span>
                  <span className="font-semibold">{formatCurrency(platformFee)}</span>
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Total Amount</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </ResponsiveCard>

            <ResponsiveCard>
              <h3 className="text-lg font-semibold text-foreground">Actions</h3>
              <div className="mt-4 grid gap-2">
                {isActive ? (
                  <>
                    <PrimaryButton variant="outline" onClick={() => setCancelOpen(true)} className="w-full">
                      Cancel appointment
                    </PrimaryButton>
                    <Link href={chatHref} className="block">
                      <PrimaryButton className="w-full">Chat with provider</PrimaryButton>
                    </Link>
                  </>
                ) : null}
                {isCancelled ? (
                  <>
                    <PrimaryButton variant="outline" onClick={() => setRebookOpen(true)} className="w-full">
                      Rebook
                    </PrimaryButton>
                    <Link href={chatHref} className="block">
                      <PrimaryButton className="w-full">Chat with provider</PrimaryButton>
                    </Link>
                  </>
                ) : null}
                {isCompleted ? (
                  <>
                    <Link href={ROUTES.PROVIDERS} className="block">
                      <PrimaryButton variant="outline" className="w-full">Book again</PrimaryButton>
                    </Link>
                    <Link href={chatHref} className="block">
                      <PrimaryButton className="w-full">Chat with provider</PrimaryButton>
                    </Link>
                  </>
                ) : null}
              </div>
            </ResponsiveCard>
          </aside>
        </div>
      </DesktopLayout>

      <CancelAppointmentModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        loading={actionLoading}
      />
      <RebookAppointmentModal
        open={rebookOpen}
        onClose={() => setRebookOpen(false)}
        onConfirm={handleRebookConfirm}
        loading={actionLoading}
        confirmLabel={isCancelled ? "Rebook" : "Reschedule"}
      />
      <CallRestrictionModal
        open={callRestrictionOpen}
        onClose={() => setCallRestrictionOpen(false)}
        providerName={appointment.providerName}
        scheduledDate={appointment.scheduledDate}
        scheduledTime={appointment.scheduledTime}
      />
    </>
  );
}

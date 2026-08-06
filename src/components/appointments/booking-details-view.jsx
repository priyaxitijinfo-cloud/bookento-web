"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Check, Copy,
} from "lucide-react";
import { toast } from "sonner";

import { CallRestrictionModal } from "@/components/appointments/call-restriction-modal";
import { CancelAppointmentModal } from "@/components/appointments/cancel-appointment-modal";
import { RebookAppointmentModal } from "@/components/appointments/rebook-appointment-modal";
import { getBookingTabLabel } from "@/components/appointments/booking-tab-bar";
import {
  BookingCalendarIcon,
  BookingClockIcon,
  BookingLocationIcon,
  BookingPhoneIcon,
} from "@/components/icons/booking-detail-icons";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import {
  ROUTES,
  chatDetailRoute,
} from "@/constants/routes.constants";
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

function SectionTitle({ children }) {
  return <h2 className="text-foreground mb-3 text-base font-bold md:mb-4 md:text-lg">{children}</h2>;
}

function InfoBox({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3.5">
      <span className="text-[#4D5972] md:bg-primary/10 md:text-primary flex shrink-0 items-center justify-center md:size-10 md:rounded-xl">
        <Icon className="size-[18px] shrink-0" />
      </span>
      <div className="text-foreground min-w-0 text-sm font-medium leading-snug md:text-base">{children}</div>
    </div>
  );
}

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

export function BookingDetailsView({ appointment: initialAppointment }) {
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

  const chatBtnClass =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors max-md:bg-[#E4EEFF] max-md:text-primary max-md:hover:bg-[#D6E6FF] md:gradient-brand md:text-white md:transition-opacity md:hover:opacity-95";
  const chatIconClass = "size-[18px] md:brightness-0 md:invert";
  const cancelBtnClass =
    "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors max-md:border-0 max-md:bg-[#FFEBEB] max-md:text-[#F13339] max-md:hover:bg-[#FFD6D6] md:border md:border-[#FECACA] md:bg-background md:text-[#EF4444] md:hover:bg-[#FEF2F2]";

  const actionBar = (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#EEF2F7] bg-background px-4 py-3 md:bottom-0 md:px-6">
      <div className="mx-auto flex w-full max-w-lg gap-3 md:max-w-7xl">
        {isActive ? (
          <>
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className={cancelBtnClass}
            >
              <img src="/icons/Cancel.svg" alt="" className="size-[18px]" draggable={false} />
              Cancel
            </button>
            <Link href={chatHref} className={chatBtnClass}>
              <img src="/icons/Chats.svg" alt="" className={chatIconClass} draggable={false} />
              Chats
            </Link>
          </>
        ) : null}

        {isCancelled ? (
          <>
            <button
              type="button"
              onClick={() => setRebookOpen(true)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#FB7A01]/20 bg-[#FEF6EF] text-sm font-semibold text-[#FB7A01] transition-colors hover:bg-[#FDECD9]"
            >
              <img src="/icons/Rebook.svg" alt="" className="size-[18px]" draggable={false} />
              Rebook
            </button>
            <Link href={chatHref} className={chatBtnClass}>
              <img src="/icons/Chats.svg" alt="" className={chatIconClass} draggable={false} />
              Chats
            </Link>
          </>
        ) : null}

        {isCompleted ? (
          <>
            <Link
              href={ROUTES.PROVIDERS}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-[#FB7A01]/20 bg-[#FEF6EF] text-sm font-semibold text-[#FB7A01] transition-colors hover:bg-[#FDECD9]"
            >
              <img src="/icons/Rebook.svg" alt="" className="size-[18px]" draggable={false} />
              Book Again
            </Link>
            <Link href={chatHref} className={chatBtnClass}>
              <img src="/icons/Chats.svg" alt="" className={chatIconClass} draggable={false} />
              Chats
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <UserPageShell
        title="Booking Details"
        backHref={ROUTES.APPOINTMENTS}
        backLabel="Back to My Bookings"
        breadcrumbCurrentLabel={getBookingTabLabel(appointmentTab)}
        containerVariant="browseWithBreadcrumb"
        className="bg-surface-page pb-0 md:pb-6"
        mainClassName="pb-28 md:pb-24"
        showBottomNav={false}
        rightAction={(
          <button
            type="button"
            onClick={handleCall}
            className="flex size-9 items-center justify-center rounded-full bg-[#FFFFFF] text-primary transition-colors hover:bg-[#EFF6FF] md:size-10"
            aria-label="Call provider"
          >
            <BookingPhoneIcon className="size-5" />
          </button>
        )}
      >
        <div className="space-y-5 md:space-y-6">
          <section className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-card">
            <div className="p-4 md:p-5">
              <div className="flex flex-col items-center text-center">
                <div className="relative size-[5.5rem] overflow-hidden rounded-[1.125rem] bg-muted md:size-24">
                  <Image
                    src={appointment.providerAvatar}
                    alt={appointment.providerName}
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority
                  />
                </div>
                <h2 className="text-foreground mt-4 text-lg font-bold md:text-xl">{appointment.providerName}</h2>
                <p className="text-muted-foreground mt-1 text-sm md:text-base">{appointment.serviceName}</p>
                <span
                  className={cn(
                    "mt-3 inline-flex rounded-full px-3.5 py-1 text-xs font-semibold capitalize",
                    isActive && "bg-[#EAF3FF] text-primary",
                    isCancelled && "bg-[#FEF3F3] text-[#F13339]",
                    isCompleted && "bg-[#EBF9ED] text-[#05B21F]",
                    !isActive && !isCancelled && !isCompleted && "bg-muted text-muted-foreground",
                  )}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <InfoBox icon={BookingLocationIcon}>{locationLabel}</InfoBox>
                <InfoBox icon={BookingCalendarIcon}>
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="truncate">{dateLabel}</span>
                    <span className="bg-border h-5 w-px shrink-0" aria-hidden />
                    <span className="inline-flex shrink-0 items-center gap-2.5">
                      <span className="text-[#4D5972] md:bg-primary/10 md:text-primary flex shrink-0 items-center justify-center md:size-10 md:rounded-xl">
                        <BookingClockIcon className="size-[18px] shrink-0" />
                      </span>
                      {appointment.scheduledTime}
                    </span>
                  </div>
                </InfoBox>
              </div>
            </div>

            <div className="border-t border-border/60 px-4 pb-4 pt-4 md:px-5 md:pb-5">
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#EFF6FF] px-4 py-3.5">
                <p className="text-foreground text-sm font-semibold">
                  Booking ID:- <span className="text-primary">{appointment.bookingCode}</span>
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
          </section>

          <section>
            <SectionTitle>Booking Summary</SectionTitle>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-card">
              <div className="space-y-2.5 px-4 py-4 text-sm md:px-5 md:py-5 md:text-base">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground font-medium">{appointment.serviceName}</span>
                  <span className="text-foreground shrink-0 font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-foreground font-medium">Platform Fees</span>
                  <span className="text-foreground shrink-0 font-semibold">{formatCurrency(platformFee)}</span>
                </div>
              </div>
              <div className="border-t border-border/60 px-4 pb-4 pt-4 md:px-5 md:pb-5">
                <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:py-4">
                  <span className="text-primary text-sm font-semibold md:text-base">Total Amount</span>
                  <span className="text-primary text-lg font-bold md:text-xl">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Payment</SectionTitle>
            <div className="md:rounded-2xl md:border md:border-border/60 md:bg-background md:p-5 md:shadow-card">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background px-4 py-3.5 shadow-card md:bg-muted/40 md:shadow-none">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#05B21F] text-white">
                    <Check className="size-4" strokeWidth={3} />
                  </span>
                  <span className="text-foreground text-sm font-medium md:text-base">{paymentLabel}</span>
                </div>
                <span className="text-foreground shrink-0 text-sm font-bold md:text-base">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </section>

          <div className="hidden md:block">{actionBar}</div>
        </div>
      </UserPageShell>

      <div className="md:hidden">{actionBar}</div>

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

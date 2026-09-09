"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { CallRestrictionModal } from "@/components/appointments/call-restriction-modal";
import { CancelAppointmentModal } from "@/components/appointments/cancel-appointment-modal";
import { RebookAppointmentModal } from "@/components/appointments/rebook-appointment-modal";
import {
  BookingCalendarIcon,
  BookingClockIcon,
  BookingLocationIcon,
  BookingPhoneIcon,
} from "@/components/icons/booking-detail-icons";
import { MobileHeader } from "@/components/layout/mobile-header";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { ROUTES, appointmentDetailRoute } from "@/constants/routes.constants";
import {
  buildChatRouteForProvider,
  ensureProviderConversation,
} from "@/lib/chats/chat.utils";
import { PAGE_SHELL_CLASS_TALL } from "@/lib/layout/page-layout.constants";
import { getPaymentStatusLabel } from "@/mock/appointments";
import { getProviderById } from "@/mock/providers";
import { useChatStore } from "@/store/chat.store";
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
  return (
    <h2 className="text-foreground mb-3 text-base font-semibold md:mb-3 md:text-[16px] md:font-semibold">
      {children}
    </h2>
  );
}

function InfoBox({ children, className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-[#E6EAF2] bg-white px-4 py-3.5",
        className,
      )}
    >
      {children}
    </div>
  );
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
  const [appointment, setAppointment] = useState(initialAppointment);
  const [copiedBookingId, setCopiedBookingId] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rebookOpen, setRebookOpen] = useState(false);
  const [callRestrictionOpen, setCallRestrictionOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const provider = getProviderById(appointment.providerId);
  const platformFee = appointment.platformFee ?? 2000;
  const serviceAmount = appointment.amount;
  const totalAmount = appointment.amount;
  const statusLabel = STATUS_LABELS[appointment.status] ?? appointment.status;
  const isActive = ACTIVE_STATUSES.includes(appointment.status);
  const isCancelled = [
    APPOINTMENT_STATUS.CANCELLED,
    APPOINTMENT_STATUS.REJECTED,
  ].includes(appointment.status);
  const isCompleted = appointment.status === APPOINTMENT_STATUS.COMPLETED;
  const dateLabel = formatDate(appointment.scheduledDate, "EEE, MMM d yyyy");
  const locationLabel =
    appointment.locationName ||
    provider?.businessName ||
    appointment.address ||
    "Provider location";
  const paymentLabel = getPaymentStatusLabel(appointment.paymentMethod);
  const chatConversations = useChatStore((state) => state.conversations);
  const returnTo = appointmentDetailRoute(appointment.id);

  useEffect(() => {
    ensureProviderConversation(appointment.providerId, appointment);
  }, [appointment]);

  const chatHref = useMemo(
    () => buildChatRouteForProvider(appointment.providerId, returnTo),
    [appointment.providerId, returnTo, chatConversations],
  );
  const bookingId = appointment.bookingCode || appointment.id;

  const handleCopyBookingId = async () => {
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

  const actionButtonClass =
    "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-0 text-sm font-semibold transition-colors md:border";

  const actionBar = (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[#EEF2F7] bg-white">
      <div className="mx-auto w-full max-w-lg px-4 py-3 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] md:py-4 xl:px-[5.875rem]">
        <div className="flex w-full gap-3">
          {isActive ? (
            <>
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className={cn(
                  actionButtonClass,
                  "bg-[#FFEBEB] text-[#F13339] hover:bg-[#FFD6D6] md:border-[#F9C7C7]",
                )}
              >
                <img
                  src="/icons/Cancel.svg"
                  alt=""
                  className="size-[18px]"
                  draggable={false}
                />
                Cancel
              </button>
              <Link
                href={chatHref}
                className={cn(
                  actionButtonClass,
                  "text-primary bg-[#E4EEFF] hover:bg-[#D6E6FF] md:border-[#BFD6FF]",
                )}
              >
                <img
                  src="/icons/Chats.svg"
                  alt=""
                  className="size-[18px]"
                  draggable={false}
                />
                Chats
              </Link>
            </>
          ) : null}

          {isCancelled ? (
            <>
              <button
                type="button"
                onClick={() => setRebookOpen(true)}
                className={cn(
                  actionButtonClass,
                  "bg-[#FEF6EF] text-[#FB7A01] hover:bg-[#FDECD9] md:border-[#FB7A01]/25",
                )}
              >
                <img
                  src="/icons/Rebook.svg"
                  alt=""
                  className="size-[18px]"
                  draggable={false}
                />
                Rebook
              </button>
              <Link
                href={chatHref}
                className={cn(
                  actionButtonClass,
                  "text-primary bg-[#E4EEFF] hover:bg-[#D6E6FF] md:border-[#BFD6FF]",
                )}
              >
                <img
                  src="/icons/Chats.svg"
                  alt=""
                  className="size-[18px]"
                  draggable={false}
                />
                Chats
              </Link>
            </>
          ) : null}

          {isCompleted ? (
            <>
              <Link
                href={ROUTES.PROVIDERS}
                className={cn(
                  actionButtonClass,
                  "bg-[#FEF6EF] text-[#FB7A01] hover:bg-[#FDECD9] md:border-[#FB7A01]/25",
                )}
              >
                <img
                  src="/icons/Rebook.svg"
                  alt=""
                  className="size-[18px]"
                  draggable={false}
                />
                Book Again
              </Link>
              <Link
                href={chatHref}
                className={cn(
                  actionButtonClass,
                  "text-primary bg-[#E4EEFF] hover:bg-[#D6E6FF] md:border-[#BFD6FF]",
                )}
              >
                <img
                  src="/icons/Chats.svg"
                  alt=""
                  className="size-[18px]"
                  draggable={false}
                />
                Chats
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={cn(PAGE_SHELL_CLASS_TALL, "md:bg-surface-page md:pb-24")}>
        <MobileHeader
          mobileOnly={false}
          title="Booking Details"
          titleCentered
          onBack={() => router.push(ROUTES.APPOINTMENTS)}
          backLabel="Back to My Bookings"
          rightAction={
            <button
              type="button"
              onClick={handleCall}
              className="text-primary flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#EFF6FF]"
              aria-label="Call provider"
            >
              <BookingPhoneIcon className="size-5" />
            </button>
          }
        />

        <main className="mx-auto w-full max-w-lg space-y-5 px-4 py-5 md:max-w-[calc(96rem-60px)] md:space-y-6 md:px-[4.875rem] md:py-6 xl:px-[5.875rem]">
          <section className="overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white shadow-[0_2px_12px_rgba(24,39,75,0.04)]">
            <div className="p-4 md:p-5">
              <div className="flex flex-col items-center text-center">
                <div className="bg-muted relative size-[5.5rem] overflow-hidden rounded-[1.125rem] md:size-24">
                  <Image
                    src={appointment.providerAvatar}
                    alt={appointment.providerName}
                    fill
                    className="object-cover"
                    sizes="96px"
                    priority
                  />
                </div>
                <h2 className="text-foreground mt-4 text-lg font-bold md:text-xl">
                  {appointment.providerName}
                </h2>
                <p className="mt-1 text-sm text-[#7A8699] md:text-base">
                  {appointment.serviceName}
                </p>
                <span
                  className={cn(
                    "mt-3 inline-flex rounded-lg px-3.5 py-1 text-xs font-semibold capitalize",
                    isActive && "text-primary bg-[#EAF3FF]",
                    isCancelled && "bg-[#FEF3F3] text-[#F13339]",
                    isCompleted && "bg-[#EBF9ED] text-[#05B21F]",
                    !isActive &&
                      !isCancelled &&
                      !isCompleted &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {statusLabel}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <InfoBox>
                  <span className="flex shrink-0 text-[#4D5972]">
                    <BookingLocationIcon className="size-[18px]" />
                  </span>
                  <p className="text-foreground min-w-0 text-sm leading-snug font-medium md:text-base">
                    {locationLabel}
                  </p>
                </InfoBox>

                <InfoBox>
                  <span className="flex shrink-0 text-[#4D5972]">
                    <BookingCalendarIcon className="size-[18px]" />
                  </span>
                  <div className="text-foreground flex min-w-0 flex-1 items-center gap-3 text-sm font-medium md:text-base">
                    <span className="truncate">{dateLabel}</span>
                    <span className="h-5 w-px shrink-0 bg-[#D8DEE8]" aria-hidden />
                    <span className="inline-flex shrink-0 items-center gap-2.5">
                      <span className="flex text-[#4D5972]">
                        <BookingClockIcon className="size-[18px]" />
                      </span>
                      {appointment.scheduledTime}
                    </span>
                  </div>
                </InfoBox>

                <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#EFF6FF] px-4 py-3.5">
                  <p className="text-foreground text-sm font-medium">Booking ID:-</p>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-bold">
                      {bookingId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyBookingId}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg transition-colors",
                        copiedBookingId
                          ? "text-emerald-600"
                          : "text-primary hover:bg-white/70",
                      )}
                      aria-label={
                        copiedBookingId ? "Booking ID copied" : "Copy booking ID"
                      }
                    >
                      {copiedBookingId ? (
                        <Check className="size-4" strokeWidth={2.5} />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Booking Summary</SectionTitle>
            <div className="overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white shadow-[0_2px_12px_rgba(24,39,75,0.04)]">
              <div className="space-y-3 px-4 py-4 text-sm md:px-5 md:py-5 md:text-base">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-[#4D5972]">
                    {appointment.serviceName}
                  </span>
                  <span className="text-foreground shrink-0 font-semibold">
                    {formatCurrency(serviceAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium text-[#4D5972]">Platform Fees</span>
                  <span className="text-foreground shrink-0 font-semibold">
                    {formatCurrency(platformFee)}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-4 md:px-5 md:pb-5">
                <div className="flex items-center justify-between rounded-xl bg-[#EFF6FF] px-4 py-3.5 md:py-4">
                  <span className="text-primary text-sm font-semibold md:text-base">
                    Total Amount
                  </span>
                  <span className="text-primary text-sm font-bold md:text-xl">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>Payment</SectionTitle>
            <div className="rounded-2xl border border-[#E6EAF2] bg-white p-4 shadow-[0_2px_12px_rgba(24,39,75,0.04)] md:p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#05B21F] text-white">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="truncate text-sm font-medium text-[#7A8699] md:text-base">
                    {paymentLabel}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[#7A8699] md:text-base">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {actionBar}

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

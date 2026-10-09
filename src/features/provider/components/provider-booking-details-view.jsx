"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Clock3,
  Copy,
  Info,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Shield,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { OtpBoxes, useOtpCountdown } from "@/features/auth/components/auth-shared";
import {
  BookingCalendarIcon,
  BookingLocationIcon,
  BookingPhoneIcon,
} from "@/components/icons/booking-detail-icons";
import { ProviderVisitBadge } from "@/features/provider/components/provider-visit-badge";
import {
  ROUTES,
  providerAppointmentDetailRoute,
  providerChatDetailRoute,
} from "@/constants/routes.constants";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { providerConversations } from "@/mock/chat";
import { useAppointmentStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatDate, getInitials } from "@/utils/format.utils";
import { copyToClipboard } from "@/utils/share.utils";

const STATUS_META = {
  pending: {
    label: "Pending",
    className: "bg-[#FFF4E5] text-[#E67E22]",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[#E8F1FF] text-[#1865EA]",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-[#E8F1FF] text-[#1865EA]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#E6F7ED] text-[#1B9E5A]",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#FEECEC] text-[#EF4444]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#FEECEC] text-[#EF4444]",
  },
};

const COMPLETABLE_STATUSES = [
  APPOINTMENT_STATUS.UPCOMING,
  APPOINTMENT_STATUS.CONFIRMED,
];

function ShieldLockIllustration({ className }) {
  return (
    <div className={cn("relative mx-auto flex items-center justify-center", className)}>
      <span className="absolute top-2 left-6 size-2 rounded-full bg-[#93C5FD]" />
      <span className="absolute top-8 right-4 size-1.5 rounded-full bg-[#34D399]" />
      <span className="absolute bottom-6 left-4 text-lg font-light text-[#93C5FD]">
        +
      </span>
      <span className="absolute right-8 bottom-10 text-sm font-light text-[#60A5FA]">
        +
      </span>
      <div className="relative flex size-24 items-center justify-center rounded-full bg-[#E8F1FF] shadow-[0_8px_24px_rgba(24,101,234,0.12)]">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#1865EA] text-white shadow-md">
          <div className="relative">
            <Shield className="size-9 fill-white/15" strokeWidth={1.75} />
            <Lock
              className="absolute inset-0 m-auto size-4 text-white"
              strokeWidth={2.4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SendCompletionOtpModal({ open, appointment, onClose, onConfirm }) {
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

  if (!open || !mounted || !appointment) return null;

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
        aria-labelledby="send-completion-otp-title"
        className="relative w-full max-w-[360px] rounded-[1.5rem] bg-white px-5 pt-7 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <ShieldLockIllustration className="mb-4 h-28 w-full" />
        <h2
          id="send-completion-otp-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          Send Completion OTP?
        </h2>
        <p className="mx-auto mt-2 max-w-[300px] text-center text-sm leading-relaxed text-[#6B7280]">
          Confirm that the appointment has been completed before sending the
          verification code to {appointment.userName}.
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
            className="gradient-brand h-12 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Send OTP
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function OtpVerifiedModal({ open, onBackHome }) {
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
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-verified-title"
        className="relative w-full max-w-[360px] overflow-hidden rounded-[1.5rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative flex h-40 items-center justify-center bg-gradient-to-b from-[#E8F1FF] to-white">
          <span className="absolute top-8 left-10 size-2 rotate-12 rounded-sm bg-[#F97316]" />
          <span className="absolute top-12 right-12 size-2 rounded-full bg-[#22C55E]" />
          <span className="absolute top-20 left-16 size-1.5 rounded-full bg-[#EF4444]" />
          <span className="absolute right-16 bottom-10 size-2 rotate-45 bg-[#1865EA]" />
          <span className="absolute bottom-12 left-12 size-1.5 rounded-sm bg-[#F59E0B]" />
          <div className="flex size-20 items-center justify-center rounded-full bg-[#22C55E] shadow-[0_10px_28px_rgba(34,197,94,0.35)]">
            <Check className="size-10 text-white" strokeWidth={3} />
          </div>
        </div>
        <div className="px-6 pt-2 pb-6 text-center">
          <h2 id="otp-verified-title" className="text-xl font-bold text-[#111827]">
            OTP Verified!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            Your confirmation has been successfully verified.
          </p>
          <button
            type="button"
            onClick={onBackHome}
            className="gradient-brand mt-6 h-12 w-full rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E6EAF2] bg-white px-4 py-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1865EA]">
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#4D5972]">{label}</p>
        <div className="shrink-0">{children}</div>
      </div>
    </div>
  );
}

function CompletionOtpView({ onBack, onVerified }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const { countdown, restart } = useOtpCountdown(90);
  const code = otp.join("");

  const handleVerify = async () => {
    if (code.length !== 6 || otp.some((digit) => !digit)) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setSubmitting(false);
    onVerified?.();
  };

  const handleResend = () => {
    restart();
    setOtp(Array(6).fill(""));
    toast.success("OTP resent");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
          <button
            type="button"
            onClick={onBack}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="flex-1 truncate text-center text-lg font-bold text-[#111827]">
            User Details
          </h1>
          <span className="size-10 shrink-0" aria-hidden />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className="mx-auto flex w-full max-w-3xl flex-col px-4 pt-6 pb-8 lg:px-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/images/auth/otp-illustration.png?v=1"
              alt=""
              width={220}
              height={160}
              className="h-auto w-[11rem] object-contain"
              unoptimized
              aria-hidden
            />
            <h2 className="mt-5 text-2xl font-bold text-[#111827]">Verify Your OTP</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
              We have sent a 6-digit verification code to your mobile number
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#EEF2F7] bg-white px-4 py-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <OtpBoxes value={otp} onChange={setOtp} />
            <p className="mt-4 text-center text-sm text-[#6B7280]">
              Don&apos;t Receive Code?{" "}
              {countdown > 0 ? (
                <span className="font-semibold text-[#1865EA]">
                  Resend {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                  {String(countdown % 60).padStart(2, "0")}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-[#1865EA] hover:underline"
                >
                  Resend
                </button>
              )}
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#E8F1FF] px-3.5 py-3">
            <Info className="mt-0.5 size-4 shrink-0 text-[#1865EA]" />
            <p className="text-sm text-[#374151]">
              Do not share this code with anyone.
            </p>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={submitting}
            className="gradient-brand mt-8 h-12 w-full rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {submitting ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </main>
    </div>
  );
}

export function ProviderBookingDetailsView({ appointmentId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step");
  const { providerAppointments, updateStatus } = useAppointmentStore();

  const appointment = useMemo(
    () => providerAppointments.find((item) => item.id === appointmentId),
    [providerAppointments, appointmentId],
  );

  const [sendOtpOpen, setSendOtpOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [copiedBookingId, setCopiedBookingId] = useState(false);

  const chatHref = useMemo(() => {
    if (!appointment?.userId) return ROUTES.PROVIDER_CHATS;
    const conversation = providerConversations.find(
      (item) => item.participantId === appointment.userId,
    );
    return conversation
      ? providerChatDetailRoute(conversation.id)
      : ROUTES.PROVIDER_CHATS;
  }, [appointment?.userId]);

  if (!appointment) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#F4F7FF] px-6 text-center">
        <p className="text-muted-foreground text-sm">Appointment not found</p>
        <Link
          href={ROUTES.PROVIDER_APPOINTMENTS}
          className="mt-4 text-sm font-semibold text-[#1865EA]"
        >
          Back to Appointments
        </Link>
      </div>
    );
  }

  const bookingId = appointment.bookingCode || appointment.bookingId || appointment.id;
  const statusMeta = STATUS_META[appointment.status] || STATUS_META.pending;
  const canComplete = COMPLETABLE_STATUSES.includes(appointment.status);
  const dateLabel = formatDate(appointment.scheduledDate, "EEE, MMM d yyyy");
  const isOtpStep = step === "otp";

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

  const goToOtpStep = () => {
    setSendOtpOpen(false);
    router.push(`${providerAppointmentDetailRoute(appointment.id)}?step=otp`);
  };

  const leaveOtpStep = () => {
    router.push(providerAppointmentDetailRoute(appointment.id));
  };

  const handleVerified = () => {
    updateStatus(appointment.id, APPOINTMENT_STATUS.COMPLETED);
    setSuccessOpen(true);
  };

  const handleBackHome = () => {
    setSuccessOpen(false);
    router.push(ROUTES.PROVIDER_HOME);
  };

  if (isOtpStep) {
    return (
      <>
        <CompletionOtpView onBack={leaveOtpStep} onVerified={handleVerified} />
        <OtpVerifiedModal open={successOpen} onBackHome={handleBackHome} />
      </>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
          <Link
            href={ROUTES.PROVIDER_APPOINTMENTS}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="flex-1 truncate text-center text-lg font-bold text-[#111827]">
            Booking Details
          </h1>
          <span className="size-10 shrink-0" aria-hidden />
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-4 pb-6 lg:px-6">
          <section className="overflow-hidden rounded-2xl border border-[#E6EAF2] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3.5 p-4">
              {appointment.userAvatar ? (
                <Image
                  src={appointment.userAvatar}
                  alt=""
                  width={72}
                  height={72}
                  className="size-[72px] shrink-0 rounded-2xl object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-[72px] shrink-0 items-center justify-center rounded-2xl bg-[#FFE8D6] text-lg font-semibold text-[#E07A3D]">
                  {getInitials(appointment.userName)}
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="truncate text-base font-bold text-[#111827]">
                  {appointment.userName}
                </p>
                {appointment.userPhone ? (
                  <p className="flex items-center gap-2 text-sm text-[#4D5972]">
                    <BookingPhoneIcon className="size-4 shrink-0 text-[#6B7280]" />
                    <span className="truncate">{appointment.userPhone}</span>
                  </p>
                ) : null}
                {appointment.userEmail ? (
                  <p className="flex items-center gap-2 text-sm text-[#4D5972]">
                    <Mail className="size-4 shrink-0 text-[#6B7280]" />
                    <span className="truncate">{appointment.userEmail}</span>
                  </p>
                ) : null}
                {appointment.locationName ? (
                  <p className="flex items-center gap-2 text-sm text-[#4D5972]">
                    <BookingLocationIcon className="size-4 shrink-0 text-[#6B7280]" />
                    <span className="truncate">{appointment.locationName}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mx-4 mb-4 flex items-center justify-between gap-3 rounded-xl bg-[#EFF6FF] px-4 py-3">
              <p className="text-sm font-medium text-[#111827]">Booking ID:-</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#111827]">{bookingId}</span>
                <button
                  type="button"
                  onClick={handleCopyBookingId}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors",
                    copiedBookingId
                      ? "text-emerald-600"
                      : "text-[#1865EA] hover:bg-white/70",
                  )}
                  aria-label={copiedBookingId ? "Booking ID copied" : "Copy booking ID"}
                >
                  {copiedBookingId ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </section>

          {canComplete ? (
            <section className="rounded-2xl border border-[#C9DBFF] bg-[#EAF2FF] p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1865EA] shadow-sm">
                  <Shield className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-[#111827]">
                    Verify Completion
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4D5972]">
                    Complete the appointment and send a verification code to the user.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSendOtpOpen(true)}
                className="gradient-brand mt-4 h-12 w-full rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                Send Completion OTP
              </button>
            </section>
          ) : null}

          <section>
            <h2 className="mb-3 text-base font-semibold text-[#111827]">
              Appointment Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-[#E6EAF2] bg-white px-4 py-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#1865EA]">
                  <BookingCalendarIcon className="size-4" />
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-medium text-[#111827]">
                  <span className="truncate">{dateLabel}</span>
                  <span className="text-[#D1D5DB]">|</span>
                  <span className="inline-flex shrink-0 items-center gap-1.5">
                    <Clock3 className="size-3.5 text-[#6B7280]" />
                    {appointment.scheduledTime}
                  </span>
                </div>
              </div>

              <InfoRow icon={UserRound} label="Consultation Type">
                <ProviderVisitBadge visitType={appointment.visitType} />
              </InfoRow>

              <InfoRow icon={ClipboardList} label="Status">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    statusMeta.className,
                  )}
                >
                  {statusMeta.label}
                </span>
              </InfoRow>

              <InfoRow icon={ClipboardList} label="Reason for visit">
                <span className="text-sm font-semibold text-[#111827]">
                  {appointment.serviceName}
                </span>
              </InfoRow>
            </div>
          </section>
        </div>
      </main>

      <div className="safe-bottom shrink-0 border-t border-[#EEF2F7] bg-white">
        <div className="mx-auto flex w-full max-w-3xl gap-3 px-4 py-3 lg:px-6">
          <Link
            href={chatHref}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#E8F1FF] text-sm font-semibold text-[#1865EA] transition-colors hover:bg-[#DCE9FF]"
          >
            <MessageCircle className="size-4" />
            Chats
          </Link>
          {appointment.userPhone ? (
            <a
              href={`tel:${appointment.userPhone.replace(/\s+/g, "")}`}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#E6F7ED] text-sm font-semibold text-[#1B9E5A] transition-colors hover:bg-[#D8F2E4]"
            >
              <Phone className="size-4" />
              Call
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#E6F7ED] text-sm font-semibold text-[#1B9E5A] opacity-60"
            >
              <Phone className="size-4" />
              Call
            </button>
          )}
        </div>
      </div>

      <SendCompletionOtpModal
        open={sendOtpOpen}
        appointment={appointment}
        onClose={() => setSendOtpOpen(false)}
        onConfirm={goToOtpStep}
      />
      <OtpVerifiedModal open={successOpen} onBackHome={handleBackHome} />
    </div>
  );
}

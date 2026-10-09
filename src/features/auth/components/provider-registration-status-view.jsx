"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Clock3, FileWarning, X } from "lucide-react";

import { ProviderSuccessStamp } from "@/features/auth/components/provider-success-stamp";
import { ROUTES } from "@/constants/routes.constants";
import { PROVIDER_STATUS } from "@/constants/status.constants";
import { cn } from "@/lib/utils";

const stampClip =
  "[clip-path:polygon(50%_0%,63%_8%,75%_4%,82%_16%,94%_20%,92%_33%,100%_45%,94%_58%,96%_72%,84%_78%,78%_90%,65%_88%,50%_100%,35%_88%,22%_90%,16%_78%,4%_72%,6%_58%,0%_45%,8%_33%,6%_20%,18%_16%,25%_4%,37%_8%)]";

const DEFAULT_REJECTION_REASON =
  "Your documents are not valid. Please upload valid documents and try again.";

const STATUS_META = {
  [PROVIDER_STATUS.PENDING]: {
    label: "Pending",
    color: "text-[#1865EA]",
    badge: "bg-[#E8F1FF] text-[#1865EA]",
    stampTone: "success",
  },
  [PROVIDER_STATUS.REJECTED]: {
    label: "Rejected",
    color: "text-[#EF4444]",
    badge: "bg-[#FEECEC] text-[#EF4444]",
    stampTone: "error",
  },
  [PROVIDER_STATUS.APPROVED]: {
    label: "Approved",
    color: "text-[#16A34A]",
    badge: "bg-[#E6F7ED] text-[#16A34A]",
    stampTone: "success",
  },
};

export function ProviderRejectionReasonCard({
  reason = DEFAULT_REJECTION_REASON,
  className,
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border border-[#F2F2F2] bg-white p-4 shadow-[0_3px_10px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center bg-[#EF4444]",
          stampClip,
        )}
      >
        <X className="size-5 text-white" strokeWidth={3} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-[#0F172A]">Reason for Rejection</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">{reason}</p>
      </div>
    </div>
  );
}

export function ProviderRegistrationStatusView({
  status: statusProp,
  rejected = false,
  avatarSrc = "/images/app-icon.jpg",
  name = "Dr. Amara Reyes",
  businessName = "UrbanCare Clinic",
  category = "Gynecologist",
  requestDate = "22 Feb 2024",
  requestTime = "10:45 AM",
  requestId = "14585AB88",
  rejectionReason = DEFAULT_REJECTION_REASON,
  className,
}) {
  const status =
    statusProp || (rejected ? PROVIDER_STATUS.REJECTED : PROVIDER_STATUS.PENDING);
  const meta = STATUS_META[status] || STATUS_META[PROVIDER_STATUS.PENDING];
  const isRejected = status === PROVIDER_STATUS.REJECTED;

  return (
    <div className={cn("space-y-5 overflow-visible sm:space-y-6", className)}>
      <ProviderSuccessStamp tone={meta.stampTone} />

      <div className="rounded-2xl border border-[#E8EDF5] bg-white shadow-[0_3px_10px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="size-14 shrink-0 overflow-hidden rounded-full ring-2 ring-[#1865EA]/30">
            <Image
              src={avatarSrc}
              alt=""
              width={56}
              height={56}
              className="size-full object-cover"
              unoptimized={avatarSrc.startsWith("blob:")}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-[#0F172A]">{name}</p>
            <p className="truncate text-[13px] text-[#64748B]">{businessName}</p>
            <span className="mt-1.5 inline-flex rounded-full bg-[#EEF2FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#6366F1]">
              {category}
            </span>
          </div>
        </div>

        <div className="space-y-3 border-t border-[#EEF1F6] px-4 py-4 text-[13.5px]">
          {[
            ["Request Date", requestDate],
            ["Request Time", requestTime],
            ["Request ID", requestId],
            ["Request Status", meta.label],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-[#64748B]">{label}</span>
              <span
                className={cn(
                  "font-semibold",
                  label === "Request Status" ? meta.color : "text-[#0F172A]",
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isRejected ? <ProviderRejectionReasonCard reason={rejectionReason} /> : null}
    </div>
  );
}

/** Compact verification status card for the provider login screen */
export function ProviderLoginVerificationBanner({
  application,
  onResubmit,
  className,
}) {
  if (!application?.status) return null;

  const status = application.status;
  const meta = STATUS_META[status] || STATUS_META[PROVIDER_STATUS.PENDING];

  const copy = {
    [PROVIDER_STATUS.PENDING]: {
      title: "Document verification pending",
      body: "Your documents are under review. Admin approval usually takes up to 48 hours.",
      Icon: Clock3,
    },
    [PROVIDER_STATUS.REJECTED]: {
      title: "Documents rejected",
      body:
        application.rejectionReason ||
        "Please upload valid documents and re-submit your application.",
      Icon: FileWarning,
    },
    [PROVIDER_STATUS.APPROVED]: {
      title: "Documents verified",
      body: "Your provider account is approved. Sign in to continue to your dashboard.",
      Icon: Check,
    },
  }[status] || {
    title: "Verification status",
    body: "",
    Icon: Clock3,
  };

  const Icon = copy.Icon;

  return (
    <div
      className={cn(
        "rounded-2xl border border-[#E8EDF5] bg-white p-4 shadow-[0_3px_10px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl",
            meta.badge,
          )}
        >
          <Icon className="size-5" strokeWidth={2.25} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-bold text-[#0F172A]">{copy.title}</p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                meta.badge,
              )}
            >
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">{copy.body}</p>

          {(application.name || application.businessName) && (
            <p className="mt-2 truncate text-[12.5px] text-[#94A3B8]">
              {[application.name, application.businessName].filter(Boolean).join(" · ")}
              {application.requestId ? ` · #${application.requestId}` : ""}
            </p>
          )}

          {status === PROVIDER_STATUS.REJECTED ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onResubmit}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#1865EA] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1554C4]"
              >
                Re-submit Documents
              </button>
              <Link
                href={`${ROUTES.PROVIDER_REGISTRATION_STATUS}?status=rejected`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-4 text-[13px] font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC]"
              >
                View Details
              </Link>
            </div>
          ) : null}

          {status === PROVIDER_STATUS.PENDING ? (
            <Link
              href={ROUTES.PROVIDER_REGISTRATION_STATUS}
              className="mt-3 inline-flex text-[13px] font-semibold text-[#1865EA] hover:underline"
            >
              View request details
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

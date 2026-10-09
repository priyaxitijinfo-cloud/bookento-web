"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { ProviderSuccessStamp } from "@/features/auth/components/provider-success-stamp";
import { cn } from "@/lib/utils";

const stampClip =
  "[clip-path:polygon(50%_0%,63%_8%,75%_4%,82%_16%,94%_20%,92%_33%,100%_45%,94%_58%,96%_72%,84%_78%,78%_90%,65%_88%,50%_100%,35%_88%,22%_90%,16%_78%,4%_72%,6%_58%,0%_45%,8%_33%,6%_20%,18%_16%,25%_4%,37%_8%)]";

const DEFAULT_REJECTION_REASON =
  "Your documents are not valid. Please upload valid documents and try again.";

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
  const statusLabel = rejected ? "Rejected" : "Pending";

  return (
    <div className={cn("space-y-5 overflow-visible sm:space-y-6", className)}>
      {/* Design keeps green success stamp; rejection is shown as an extra card */}
      <ProviderSuccessStamp tone="success" />

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
            ["Request Status", statusLabel],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-[#64748B]">{label}</span>
              <span
                className={cn(
                  "font-semibold",
                  label === "Request Status"
                    ? rejected
                      ? "text-[#EF4444]"
                      : "text-[#1865EA]"
                    : "text-[#0F172A]",
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {rejected ? <ProviderRejectionReasonCard reason={rejectionReason} /> : null}
    </div>
  );
}

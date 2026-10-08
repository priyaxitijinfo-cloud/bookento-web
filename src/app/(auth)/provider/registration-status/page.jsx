"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import {
  ProviderAuthResponsive,
  ProviderContinueButton,
} from "@/features/auth/components/provider-auth-shell";
import { ROUTES } from "@/constants/routes.constants";

export default function ProviderRegistrationStatusPage() {
  const router = useRouter();

  return (
    <ProviderAuthResponsive
      title="Request Send Successfully"
      subtitle="Your provider request send successfully for admin wait 48 hours to approve request."
      headline="Application received"
      copy="Our team is reviewing your documents. You'll get an email once approved."
      footer={
        <ProviderContinueButton onClick={() => router.push(ROUTES.PROVIDER_LOGIN)}>
          Back to Login
        </ProviderContinueButton>
      }
    >
      <div className="space-y-6">
        <div className="mx-auto flex size-[5.5rem] items-center justify-center bg-[#22C55E] [clip-path:polygon(50%_0%,63%_8%,75%_4%,82%_16%,94%_20%,92%_33%,100%_45%,94%_58%,96%_72%,84%_78%,78%_90%,65%_88%,50%_100%,35%_88%,22%_90%,16%_78%,4%_72%,6%_58%,0%_45%,8%_33%,6%_20%,18%_16%,25%_4%,37%_8%)]">
          <Check className="size-9 text-white" strokeWidth={3} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E8EDF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="space-y-3 px-4 py-4 text-[13.5px]">
            {[
              ["Request Status", "Pending"],
              ["Review Window", "24–48 hours"],
              ["Next Step", "Email notification"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-[#64748B]">{label}</span>
                <span
                  className={
                    label === "Request Status"
                      ? "font-semibold text-[#1865EA]"
                      : "font-semibold text-[#0F172A]"
                  }
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[13px] text-[#64748B]">
          Need help?{" "}
          <Link
            href={ROUTES.HELP}
            className="font-semibold text-[#1865EA] hover:underline"
          >
            Contact support
          </Link>
        </p>
      </div>
    </ProviderAuthResponsive>
  );
}

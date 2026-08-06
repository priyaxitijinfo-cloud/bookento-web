"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TicketPercent } from "lucide-react";
import { toast } from "sonner";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { WALLET_ADD_MONEY_OFFERS } from "@/constants/wallet.constants";
import { cn } from "@/lib/utils";

function OfferCard({ offer, onApply }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#BFDBFE] bg-white p-3 md:p-4">
      <div className="flex items-stretch gap-3 md:gap-4">
        <div className="flex w-[72px] shrink-0 flex-col items-center justify-center gap-2 md:w-[80px]">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border/40 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <Image
              src="/images/wallet-coupon-icon.png"
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain"
            />
          </div>
          <span className="text-base font-bold text-foreground md:text-lg">{offer.discountLabel}</span>
        </div>

        <div className="flex min-w-0 flex-1 items-stretch gap-3 md:gap-4">
          <div className="min-w-0 flex-1 py-0.5">
            <p className="text-[15px] font-bold text-foreground md:text-base">{offer.code}</p>
            <p className="mt-1 text-[13px] leading-snug text-[#64748B] md:text-sm">{offer.description}</p>
            <p className="mt-2 text-xs font-medium text-[#475569] md:text-[13px]">
              Valid till {offer.validTill}
            </p>
          </div>

          <div className="flex w-[92px] shrink-0 flex-col items-center justify-between border-l border-dashed border-[#CBD5E1] py-0.5 pl-3 md:w-[100px] md:pl-4">
            <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-semibold text-primary md:text-[11px]">
              Save {offer.savePercent}%
            </span>
            <span className="text-xl font-bold text-primary md:text-[1.375rem]">
              ₹{offer.minAmount.toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              onClick={() => onApply(offer)}
              className="gradient-brand rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95 md:text-[13px]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WalletOffersPage() {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCode = () => {
    const normalized = couponCode.trim().toUpperCase();
    if (!normalized) {
      toast.error("Enter a coupon code");
      return;
    }

    const matched = WALLET_ADD_MONEY_OFFERS.find((offer) => offer.code === normalized);
    if (matched) {
      toast.success(`Coupon ${matched.code} applied`);
      router.push(ROUTES.WALLET_ADD_MONEY);
      return;
    }

    toast.error("Invalid coupon code");
  };

  const handleApplyOffer = (offer) => {
    toast.success(`Coupon ${offer.code} applied`);
    router.push(ROUTES.WALLET_ADD_MONEY);
  };

  return (
    <UserPageShell
      title="Available Offers"
      backHref={ROUTES.WALLET_ADD_MONEY}
      backLabel="Back to Add Money"
      breadcrumbTrail={[
        { label: "My Wallet", href: ROUTES.WALLET },
        { label: "Add Money", href: ROUTES.WALLET_ADD_MONEY },
      ]}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="space-y-4 md:space-y-5"
    >
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-white px-3 py-2 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:gap-3 md:px-4 md:py-2.5">
        <TicketPercent className="size-5 shrink-0 text-muted-foreground/70 md:size-[22px]" strokeWidth={2} />
        <input
          type="text"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value)}
          placeholder="Enter Coupon Code"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 md:text-[15px]"
          aria-label="Enter coupon code"
        />
        <button
          type="button"
          onClick={handleApplyCode}
          className="gradient-brand shrink-0 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95 md:px-5 md:py-2.5 md:text-sm"
        >
          Apply
        </button>
      </div>

      <div className="space-y-3 md:space-y-4">
        {WALLET_ADD_MONEY_OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onApply={handleApplyOffer} />
        ))}
      </div>
    </UserPageShell>
  );
}

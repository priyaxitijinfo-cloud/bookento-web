"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp, Copy, Gift, Share2, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatRelativeTime } from "@/utils/format.utils";

const STATUS_VARIANT = {
  pending: "warning",
  completed: "success",
};

const SHARE_PLATFORMS = [
  { id: "whatsapp", label: "WhatsApp", icon: "/images/icons/share/whatsapp.svg" },
  { id: "instagram", label: "Instagram", icon: "/images/icons/share/instagram.svg" },
  { id: "facebook", label: "Facebook", icon: "/images/icons/share/facebook.svg" },
  { id: "messenger", label: "Messenger", icon: "/images/icons/share/messenger.svg" },
  { id: "twitter", label: "Twitter", icon: "/images/icons/share/twitter.svg" },
];

const HOW_IT_WORKS_STEPS = [
  "Share your referral code and invite friends. Referral coins are credited only after you successfully complete your first service. Until then, no referral rewards will be earned.",
  "Your friends sign up with your code and complete their first booking.",
  "You both receive ₹100 credited to your wallet.",
];

export function ReferralsHeroCard() {
  return (
    <Card className="gradient-brand overflow-hidden border-0 text-white">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Gift className="size-10" />
          <div>
            <h2 className="text-xl font-bold">Invite Friends, Earn ₹100</h2>
            <p className="text-sm text-white/80">
              Both you and your friend get rewards on first booking
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReferralsStatsGrid({ totalInvited, joinedCount, totalEarned }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-5 text-center">
          <Users className="text-primary mx-auto size-6" />
          <p className="mt-2 text-2xl font-bold">{totalInvited}</p>
          <p className="text-muted-foreground text-xs">Invited</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-2xl font-bold">{joinedCount}</p>
          <p className="text-muted-foreground text-xs">Joined</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-success text-2xl font-bold">
            {formatCurrency(totalEarned)}
          </p>
          <p className="text-muted-foreground text-xs">Earned</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ReferralCodeCard({ referralCode, onCopy, onShare }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-muted-foreground text-sm">Your referral code</p>
        <div className="mt-2 flex items-center gap-3">
          <code className="bg-muted flex-1 rounded-xl px-4 py-3 text-lg font-bold tracking-widest">
            {referralCode}
          </code>
          <Button variant="outline" size="icon" onClick={onCopy}>
            <Copy />
          </Button>
        </div>
        <Button className="mt-4 w-full" onClick={onShare}>
          <Share2 className="size-4" /> Share Referral Link
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReferralsHowItWorksCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-4 font-semibold">How it works</h3>
        <ol className="space-y-4">
          {[
            "Share your unique referral code with friends",
            "They sign up and complete their first booking",
            "You both receive ₹100 in your wallet",
          ].map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function ReferralsListSection({ referrals, pendingCount }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Your Referrals</h3>
        {pendingCount > 0 ? (
          <Badge variant="warning">{pendingCount} pending</Badge>
        ) : null}
      </div>
      <div className="space-y-3">
        {referrals.map((ref) => (
          <Card key={ref.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Avatar name={ref.name} size="md" />
                <div>
                  <p className="font-medium">{ref.name}</p>
                  <p className="text-muted-foreground text-xs">{ref.email}</p>
                  <p className="text-muted-foreground text-xs">
                    Joined {formatRelativeTime(ref.joinedAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={STATUS_VARIANT[ref.status]} className="capitalize">
                  {ref.status}
                </Badge>
                {ref.reward > 0 ? (
                  <p className="text-success mt-1 text-sm font-semibold">
                    +{formatCurrency(ref.reward)}
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ReferralsContent({
  referralCode,
  referrals,
  totalInvited,
  joinedCount,
  totalEarned,
  pendingCount,
  onCopy,
  onShare,
}) {
  return (
    <div className="space-y-6">
      <ReferralsHeroCard />
      <ReferralsStatsGrid
        totalInvited={totalInvited}
        joinedCount={joinedCount}
        totalEarned={totalEarned}
      />
      <ReferralCodeCard referralCode={referralCode} onCopy={onCopy} onShare={onShare} />
      <ReferralsHowItWorksCard />
      <ReferralsListSection referrals={referrals} pendingCount={pendingCount} />
    </div>
  );
}

function shareReferral(platformId, referralCode) {
  const link = `https://bookento.app/join?ref=${referralCode}`;
  const text = `Join Bookento with my code ${referralCode} and earn rewards! ${link}`;

  if (platformId === "whatsapp") {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    return;
  }
  if (platformId === "facebook") {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      "_blank",
      "noopener,noreferrer",
    );
    return;
  }
  if (platformId === "twitter") {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    return;
  }

  navigator.clipboard?.writeText(text);
  toast.success(`Ready to share on ${platformId}`);
}

export function ReferralsMobileContent({ referralCode, onCopy }) {
  const reactId = useId().replace(/:/g, "");
  const copyGradientId = `paint_copy_referral_${reactId}`;
  const infoPaintId = `paint_info_referral_${reactId}`;
  const infoClipId = `clip_info_referral_${reactId}`;

  const [enterCode, setEnterCode] = useState("");
  const [howOpen, setHowOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitCode = () => {
    const value = enterCode.trim();
    if (!value) {
      toast.error("Please enter a referral code");
      return;
    }
    toast.success("Referral code submitted!");
    setEnterCode("");
  };

  return (
    <div className="space-y-4 pb-2">
      {/* Hero */}
      <section className="flex items-center gap-2">
        <div className="mt-[10px] min-w-0 flex-1">
          <h2 className="text-[22px] leading-tight font-bold tracking-tight text-[#111827] md:text-[26px]">
            Invite Friends,
            <br />
            <span className="text-[#1865EA]">Earn Rewards</span>
          </h2>
          <p className="mt-2 max-w-[11.5rem] text-[13px] leading-relaxed text-[#6B7280] md:max-w-none">
            <span className="md:block">Share your code and earn money</span>{" "}
            <span className="md:block">when your friends join.</span>
          </p>
        </div>
        <img
          src="/icons/credits.png?v=8"
          alt=""
          width={210}
          height={170}
          className="-mr-2 h-[170px] w-[210px] shrink-0 object-contain object-right"
          draggable={false}
          aria-hidden
        />
      </section>

      {/* Your Referral Code */}
      <section className="rounded-2xl border border-[#EEEEEE] bg-white p-4 shadow-[0_1px_8px_rgba(16,24,40,0.04)]">
        <h3 className="text-[17px] font-semibold text-[#111827]">Your Referral Code</h3>
        <p className="mt-0.5 text-[13px] text-[#9CA3AF]">
          Invite friends with your code &amp; earn rewards.
        </p>

        <div className="mt-3.5 flex items-center gap-2.5">
          <div className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-dashed border-[#93C5FD] bg-[#F8FBFF] px-3">
            <code className="text-[17px] font-bold tracking-wide text-[#1865EA]">
              {referralCode}
            </code>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="gradient-brand inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl px-4 text-[13px] font-semibold text-white"
          >
            {copied ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-[18px] shrink-0"
                aria-hidden
              >
                <path
                  d="M16.667 5.833 8.125 14.375 3.333 9.583"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-[18px] shrink-0"
                aria-hidden
              >
                <path
                  d="M5.02629 16.3056C5.0265 16.6481 5.29947 16.9273 5.63441 16.9275H12.1219C12.4568 16.9273 12.7298 16.6481 12.73 16.3056V15.6836H8.87814C7.42335 15.6836 6.24254 14.4759 6.24254 12.9879V7.3901H5.63441C5.29934 7.39032 5.02629 7.66931 5.02629 8.01208V16.3056ZM18 12.9879C18 14.4759 16.8192 15.6836 15.3644 15.6836H14.7563V16.3056C14.7561 17.7932 13.5763 18.9998 12.1219 19H5.63441C4.17994 18.9998 3.00021 17.7932 3 16.3056V8.01208C3 6.52428 4.17981 5.31664 5.63441 5.31642H6.24254V4.69444C6.24275 3.20669 7.42349 2 8.87814 2H12.597C13.0203 2.00012 13.4281 2.15067 13.7526 2.42275L13.8868 2.54666L17.4655 6.20687L17.5867 6.34293C17.8529 6.67495 17.9999 7.09303 18 7.52615V12.9879ZM8.27001 12.9879C8.27001 13.3308 8.54288 13.6099 8.87814 13.6099H15.3644C15.6997 13.6099 15.9725 13.3308 15.9725 12.9879V7.61119L12.5126 4.07246H8.87814C8.54301 4.07246 8.27023 4.35173 8.27001 4.69444V12.9879Z"
                  fill="white"
                  stroke={`url(#${copyGradientId})`}
                  strokeWidth="0.46875"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id={copyGradientId}
                    x1="10.5"
                    y1="2"
                    x2="10.5"
                    y2="19"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4B91FB" />
                    <stop offset="1" stopColor="#3F80F6" />
                  </linearGradient>
                </defs>
              </svg>
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="relative mt-5 flex items-center justify-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-[#E5E7EB]" aria-hidden />
          <span className="relative bg-white px-3 text-[11px] text-[#9CA3AF]">
            Share your code via
          </span>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-1">
          {SHARE_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => shareReferral(platform.id, referralCode)}
              className="flex flex-col items-center gap-1.5"
            >
              <img
                src={platform.icon}
                alt=""
                className="size-11 object-contain"
                draggable={false}
              />
              <span className="text-[11px] font-medium text-[#6B7280]">
                {platform.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Enter Referral Code */}
      <section className="rounded-2xl border border-[#EEEEEE] bg-white p-4 shadow-[0_1px_8px_rgba(16,24,40,0.04)]">
        <h3 className="text-[16px] font-semibold text-[#111827]">
          Enter Referral Code
        </h3>
        <p className="mt-0.5 text-[13px] text-[#9CA3AF]">
          Have a referral code? Enter it below.
        </p>

        <div className="mt-3.5 flex items-center gap-2.5">
          <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-[18px] shrink-0"
              aria-hidden
            >
              <path
                d="M2.58889 13.8175H11.0833V22.6016C11.0833 22.6986 11.0447 22.7917 10.9759 22.8604C10.9072 22.929 10.8139 22.9676 10.7167 22.9676H5.88889C5.39083 23.0385 4.88306 22.9927 4.40579 22.8339C3.92852 22.675 3.49484 22.4075 3.13909 22.0524C2.78334 21.6973 2.51529 21.2644 2.35615 20.788C2.19701 20.3115 2.15116 19.8047 2.22222 19.3075V14.1835C2.22222 14.1354 2.23171 14.0878 2.25013 14.0434C2.26856 13.999 2.29557 13.9587 2.32962 13.9247C2.36366 13.8907 2.40409 13.8637 2.44857 13.8454C2.49306 13.827 2.54074 13.8175 2.58889 13.8175ZM21.4111 13.8175H12.9167V22.6016C12.9167 22.6496 12.9262 22.6972 12.9446 22.7416C12.963 22.786 12.99 22.8264 13.0241 22.8604C13.0581 22.8944 13.0985 22.9213 13.143 22.9397C13.1875 22.9581 13.2352 22.9676 13.2833 22.9676H18.1111C18.6092 23.0385 19.1169 22.9927 19.5942 22.8339C20.0715 22.675 20.5052 22.4075 20.8609 22.0524C21.2167 21.6973 21.4847 21.2644 21.6439 20.788C21.803 20.3115 21.8488 19.8047 21.7778 19.3075V14.1835C21.7778 14.1354 21.7683 14.0878 21.7499 14.0434C21.7314 13.999 21.7044 13.9587 21.6704 13.9247C21.6363 13.8907 21.5959 13.8637 21.5514 13.8454C21.5069 13.827 21.4593 13.8175 21.4111 13.8175ZM23 7.71744V11.6215C23 11.7185 22.9614 11.8116 22.8926 11.8803C22.8238 11.9489 22.7306 11.9875 22.6333 11.9875H12.9167V7.71744H11.0833V11.9875H1.36667C1.26942 11.9875 1.17616 11.9489 1.10739 11.8803C1.03863 11.8116 1 11.7185 1 11.6215V7.71744C1 7.23209 1.19315 6.76662 1.53697 6.42343C1.88079 6.08023 2.3471 5.88743 2.83333 5.88743H4.135C3.91958 5.48706 3.79134 5.04576 3.75869 4.59247C3.72604 4.13917 3.78972 3.68411 3.94556 3.25709C4.13889 2.69398 4.4795 2.1927 4.93213 1.80515C5.38476 1.4176 5.93295 1.15786 6.51994 1.05285C7.10692 0.947833 7.71135 1.00135 8.27065 1.20786C8.82995 1.41438 9.32378 1.76637 9.701 2.2274C9.74011 2.2762 11.1151 4.10134 12 5.27742L14.2904 2.23838C14.6591 1.78351 15.1412 1.43337 15.6882 1.22307C16.2352 1.01276 16.8279 0.949674 17.4071 1.04013C17.9862 1.13059 18.5313 1.37141 18.9878 1.73845C19.4443 2.1055 19.7961 2.58588 20.008 3.13143C20.1895 3.57286 20.2707 4.04892 20.246 4.52543C20.2213 5.00194 20.0912 5.46707 19.865 5.88743H21.1667C21.6529 5.88743 22.1192 6.08023 22.463 6.42343C22.8068 6.76662 23 7.23209 23 7.71744ZM10.1667 5.88743C9.33678 4.78942 8.33333 3.46205 8.26978 3.37543C8.12906 3.20518 7.95198 3.0685 7.7515 2.97541C7.55102 2.88231 7.33221 2.83516 7.11111 2.83741C6.70592 2.83741 6.31732 2.99808 6.03081 3.28407C5.7443 3.57007 5.58333 3.95796 5.58333 4.36242C5.58333 4.76688 5.7443 5.15477 6.03081 5.44076C6.31732 5.72676 6.70592 5.88743 7.11111 5.88743H10.1667ZM18.4167 4.36242C18.416 3.95816 18.2549 3.57064 17.9685 3.28478C17.6821 2.99893 17.2939 2.83805 16.8889 2.83741C16.6637 2.83601 16.4411 2.88543 16.2377 2.98198C16.0343 3.07852 15.8554 3.2197 15.7143 3.39495L13.8333 5.88743H16.8889C17.2939 5.88678 17.6821 5.72591 17.9685 5.44005C18.2549 5.1542 18.416 4.76668 18.4167 4.36242Z"
                fill="#2D68FE"
              />
            </svg>
            <input
              type="text"
              value={enterCode}
              onChange={(event) => setEnterCode(event.target.value)}
              placeholder="Enter Code Here..."
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[#111827] outline-none placeholder:text-[#ADB3B7]"
            />
          </label>
          <button
            type="button"
            onClick={handleSubmitCode}
            className="gradient-brand inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-4 text-[13px] font-semibold text-white"
          >
            Submit
          </button>
        </div>
      </section>

      {/* Earn banner */}
      <section className="flex items-center gap-3 rounded-2xl border border-[#DEEBFF] bg-[#EDF4FE] px-3.5 py-3.5">
        <img
          src="/icons/earn.png"
          alt=""
          className="size-[4.5rem] shrink-0 object-contain"
          draggable={false}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-[16px] leading-snug font-semibold text-[#111827]">
            Earn Money On Every Referral
          </p>
          <span className="mt-2 inline-flex rounded-lg bg-[#D6E3FD] px-3.5 py-2 text-[13px] font-semibold text-[#2D68FE]">
            1 Referral = ₹ 100.00
          </span>
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-2xl border border-[#EEEEEE] bg-white shadow-[0_1px_8px_rgba(16,24,40,0.04)]">
        <button
          type="button"
          onClick={() => setHowOpen((open) => !open)}
          className="flex w-full items-center gap-2.5 px-4 py-3.5 text-left"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-7 shrink-0"
            aria-hidden
          >
            <g clipPath={`url(#${infoClipId})`}>
              <path
                d="M11.9995 0C5.37295 0 0 5.37295 0 11.9995C0 18.626 5.37295 24 11.9995 24C18.626 24 24 18.626 24 11.9995C24 5.37295 18.626 0 11.9995 0ZM14.4975 18.5976C13.8799 18.8414 13.3882 19.0263 13.0194 19.1543C12.6058 19.2894 12.1725 19.3543 11.7374 19.3463C10.9897 19.3463 10.4076 19.1634 9.99314 18.7987C9.57867 18.434 9.37244 17.9718 9.37244 17.41C9.37244 17.1916 9.38768 16.9681 9.41816 16.7406C9.45583 16.4814 9.50566 16.2241 9.56749 15.9695L10.3406 13.2389C10.4086 12.9768 10.4676 12.7279 10.5143 12.4963C10.561 12.2626 10.5834 12.0483 10.5834 11.8532C10.5834 11.5058 10.5112 11.262 10.368 11.1248C10.2227 10.9877 9.94946 10.9206 9.54209 10.9206C9.34298 10.9206 9.13778 10.9501 8.92749 11.0121C8.71924 11.0761 8.53841 11.134 8.39009 11.1909L8.59429 10.3497C9.10019 10.1435 9.58476 9.96673 10.047 9.82044C10.4697 9.67903 10.9118 9.60431 11.3575 9.59898C12.1001 9.59898 12.673 9.77981 13.0763 10.1374C13.4776 10.496 13.6797 10.9623 13.6797 11.5352C13.6797 11.6541 13.6655 11.8634 13.6381 12.162C13.6143 12.4411 13.5625 12.7171 13.4837 12.9859L12.7147 15.7084C12.6457 15.9547 12.5891 16.2042 12.545 16.4561C12.5031 16.6658 12.4783 16.8784 12.4709 17.0921C12.4709 17.4537 12.5511 17.7006 12.7137 17.8316C12.8742 17.9627 13.1556 18.0287 13.5538 18.0287C13.7417 18.0287 13.952 17.9952 14.1897 17.9302C14.4254 17.8651 14.5961 17.8072 14.7037 17.7575L14.4975 18.5976ZM14.3614 7.54692C14.0117 7.87666 13.5467 8.05611 13.0662 8.04673C12.5623 8.04673 12.1275 7.88013 11.7658 7.54692C11.5939 7.39564 11.4565 7.20909 11.363 6.99996C11.2696 6.79083 11.2223 6.56403 11.2244 6.33498C11.2244 5.8626 11.4072 5.45625 11.7658 5.12C12.1163 4.78763 12.5833 4.6063 13.0662 4.61511C13.571 4.61511 14.0038 4.78273 14.3614 5.12C14.72 5.45625 14.8998 5.8626 14.8998 6.33498C14.8998 6.8094 14.72 7.21371 14.3614 7.54692Z"
                fill={`url(#${infoPaintId})`}
              />
            </g>
            <defs>
              <linearGradient
                id={infoPaintId}
                x1="0"
                y1="0"
                x2="24"
                y2="24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#58A1FF" />
                <stop offset="1" stopColor="#1E57EA" />
              </linearGradient>
              <clipPath id={infoClipId}>
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="min-w-0 flex-1 text-[15px] font-semibold text-[#111827]">
            How It Works?
          </span>
          {howOpen ? (
            <ChevronUp className="size-5 shrink-0 text-[#9CA3AF]" strokeWidth={2} />
          ) : (
            <ChevronDown className="size-5 shrink-0 text-[#9CA3AF]" strokeWidth={2} />
          )}
        </button>

        {howOpen ? (
          <div className="border-t border-[#F1F1F1] px-4 pt-3 pb-4">
            <ol className="space-y-3">
              {HOW_IT_WORKS_STEPS.map((step, index) => (
                <li
                  key={index}
                  className="flex gap-2 text-[12px] leading-relaxed text-[#6B7280]"
                >
                  <span className="shrink-0 font-semibold text-[#6B7280]">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>
    </div>
  );
}

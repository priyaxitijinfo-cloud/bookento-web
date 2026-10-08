"use client";

import Image from "next/image";
import Link from "next/link";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { AuthWebFrame } from "@/features/auth/components/auth-shared";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

/** Soft pastel mesh used across provider auth mobile screens */
export function ProviderAuthMobileShell({
  title,
  subtitle,
  children,
  footer,
  className,
  contentClassName,
}) {
  return (
    <div className={cn("relative min-h-dvh overflow-x-hidden bg-white", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(244,114,182,0.18),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_0%,rgba(96,165,250,0.2),transparent_50%),linear-gradient(180deg,#F8F5FF_0%,#FFFFFF_70%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-10">
        {(title || subtitle) && (
          <header className="shrink-0 px-1 text-center">
            {title ? (
              <h1 className="text-[1.65rem] leading-tight font-bold tracking-tight text-[#0F172A]">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mx-auto mt-2 max-w-[20rem] text-[13.5px] leading-relaxed text-[#64748B]">
                {subtitle}
              </p>
            ) : null}
          </header>
        )}

        <div
          className={cn(
            "mt-7 flex min-h-0 flex-1 flex-col overflow-y-auto pb-4",
            contentClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          <div className="sticky bottom-0 shrink-0 bg-gradient-to-t from-white via-white to-white/90 pt-3 pb-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ProviderAuthWebShell({
  title,
  subtitle,
  children,
  footer,
  headline = "Grow with Bookento Pro",
  copy = "Manage bookings, clients, and payouts from one professional dashboard.",
  wide = false,
}) {
  return (
    <AuthWebFrame
      eyebrow="Bookento Pro"
      headline={headline}
      copy={copy}
      wide={wide}
      illustration={
        <div className="relative flex size-full items-center justify-center">
          <Image
            src="/images/app-icon.jpg"
            alt=""
            width={120}
            height={120}
            className="size-[7.5rem] rounded-[1.5rem] shadow-[0_16px_40px_rgba(24,101,234,0.25)]"
            priority
          />
        </div>
      }
    >
      <div className="flex flex-col">
        {(title || subtitle) && (
          <header className="mb-7 border-b border-[#EEF1F6] pb-5 text-center">
            {title ? (
              <h1 className="text-[1.85rem] font-bold tracking-tight text-[#0F1B2D]">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#667085]">
                {subtitle}
              </p>
            ) : null}
          </header>
        )}
        {children}
        {footer ? <div className="mt-8">{footer}</div> : null}
      </div>
    </AuthWebFrame>
  );
}

export function ProviderAuthResponsive({
  title,
  subtitle,
  children,
  footer,
  headline,
  copy,
  wide = false,
}) {
  return (
    <ResponsiveView
      mobile={
        <ProviderAuthMobileShell title={title} subtitle={subtitle} footer={footer}>
          {children}
        </ProviderAuthMobileShell>
      }
      tablet={
        <ProviderAuthWebShell
          title={title}
          subtitle={subtitle}
          footer={footer}
          headline={headline}
          copy={copy}
          wide={wide}
        >
          {children}
        </ProviderAuthWebShell>
      }
      desktop={
        <ProviderAuthWebShell
          title={title}
          subtitle={subtitle}
          footer={footer}
          headline={headline}
          copy={copy}
          wide={wide}
        >
          {children}
        </ProviderAuthWebShell>
      }
    />
  );
}

export function ProviderAuthField({ label, children, error, className }) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      {label ? (
        <span className="text-[14px] font-semibold text-[#1E293B]">{label}</span>
      ) : null}
      {children}
      {error ? <span className="text-[12.5px] text-red-500">{error}</span> : null}
    </label>
  );
}

export function providerAuthInputClass(error) {
  return cn(
    "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-[#0F172A] outline-none transition-colors",
    "placeholder:text-[#94A3B8]",
    error
      ? "border-red-300 focus:border-red-400"
      : "border-[#E2E8F0] focus:border-[#1865EA]",
  );
}

export function ProviderContinueButton({
  children = "Continue",
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "gradient-brand inline-flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-semibold text-white",
        "shadow-[0_8px_20px_rgba(30,87,234,0.28)] transition-opacity hover:opacity-95",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProviderAuthFooterLinks({ showUserLogin = true }) {
  return (
    <div className="space-y-2 text-center text-[13.5px] text-[#64748B]">
      <p>
        Already registered?{" "}
        <Link
          href={ROUTES.PROVIDER_LOGIN}
          className="font-semibold text-[#1865EA] hover:underline"
        >
          Sign in
        </Link>
      </p>
      {showUserLogin ? (
        <p>
          Looking for services?{" "}
          <Link
            href={ROUTES.USER_LOGIN}
            className="font-semibold text-[#1865EA] hover:underline"
          >
            User Login
          </Link>
        </p>
      ) : null}
    </div>
  );
}

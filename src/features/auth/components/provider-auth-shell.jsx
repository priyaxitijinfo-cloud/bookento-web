"use client";

import Link from "next/link";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { PageLoader } from "@/components/ui/skeleton";
import { AuthBrandLogo } from "@/features/auth/components/auth-illustrations";
import { AuthWebFrame } from "@/features/auth/components/auth-shared";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

/** Soft pastel mesh used across provider auth — app + webview */
export function ProviderAuthMobileShell({
  title,
  subtitle,
  children,
  footer,
  className,
  contentClassName,
}) {
  return (
    <div
      className={cn("relative flex h-dvh flex-col overflow-hidden bg-white", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(244,114,182,0.18),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_0%,rgba(96,165,250,0.2),transparent_50%),linear-gradient(180deg,#F8F5FF_0%,#FFFFFF_70%)]"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-md flex-col px-5 pt-12 sm:max-w-lg sm:px-8">
        {(title || subtitle) && (
          <header className="mt-8 shrink-0 px-1 text-center">
            {title ? (
              <h1 className="text-[1.65rem] leading-tight font-bold tracking-tight text-[#0F172A]">
                {title}
              </h1>
            ) : null}
            {subtitle ? (
              <p className="mx-auto mt-2.5 max-w-[20rem] text-[14px] leading-relaxed text-[#64748B] sm:max-w-[24rem]">
                {subtitle}
              </p>
            ) : null}
          </header>
        )}

        <div
          className={cn(
            "scrollbar-hover mt-9 flex min-h-0 flex-1 flex-col overflow-y-auto pb-6",
            contentClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 bg-gradient-to-t from-white via-white to-white/95 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
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
  wide = true,
  webIllustration,
}) {
  const illustration = webIllustration ?? (
    <div className="relative flex size-full items-center justify-center">
      <AuthBrandLogo size={144} className="size-[9rem]" />
    </div>
  );

  return (
    <AuthWebFrame
      eyebrow="Bookento Pro"
      headline={headline}
      copy={copy}
      wide={wide}
      illustration={illustration}
    >
      <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col self-stretch">
        {(title || subtitle) && (
          <header className="mb-5 shrink-0 border-b border-[#EEF1F6] pb-4 text-center">
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
        {/* Only this region scrolls — Continue stays pinned below */}
        <div className="scrollbar-hover min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-3">
          {children}
        </div>
        {footer ? (
          <div className="z-10 shrink-0 border-t border-[#EEF1F6] bg-white px-4 pt-5 pb-5">
            {footer}
          </div>
        ) : null}
      </div>
    </AuthWebFrame>
  );
}

/**
 * App (phone): mobile pastel shell.
 * Webview + desktop (≥ tablet): split AuthWebFrame — same width/layout as register.
 */
export function ProviderAuthResponsive({
  title,
  subtitle,
  children,
  footer,
  mobileFooter,
  headline,
  copy,
  wide = true,
  webIllustration,
}) {
  const resolvedMobileFooter = mobileFooter !== undefined ? mobileFooter : footer;

  const web = (
    <ProviderAuthWebShell
      title={title}
      subtitle={subtitle}
      footer={footer}
      headline={headline}
      copy={copy}
      wide={wide}
      webIllustration={webIllustration}
    >
      {children}
    </ProviderAuthWebShell>
  );

  return (
    <ResponsiveView
      fallback={<PageLoader />}
      mobile={
        <ProviderAuthMobileShell
          title={title}
          subtitle={subtitle}
          footer={resolvedMobileFooter}
        >
          {children}
        </ProviderAuthMobileShell>
      }
      tablet={web}
      desktop={web}
    />
  );
}

export function ProviderAuthField({ label, children, error, className }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2", className)}>
      {label ? (
        <span className="text-[14px] font-semibold text-[#1E293B]">{label}</span>
      ) : null}
      {children}
      {/* Error text intentionally omitted — invalid state uses field border only */}
      {error ? <span className="sr-only">{error}</span> : null}
    </label>
  );
}

export function providerAuthInputClass(error) {
  return cn(
    "h-14 w-full min-w-0 max-w-full rounded-xl border bg-[#FFFFFF] px-4 text-[15px] text-[#0F172A] outline-none transition-colors",
    "placeholder:text-[#94A3B8]",
    "border-[#F2F2F2] shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
    "min-[1200px]:border-[#E2E8F0] min-[1200px]:shadow-none",
    error
      ? "border-red-300 focus:border-red-400 min-[1200px]:border-red-300"
      : "focus:border-[#1865EA]",
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
        "gradient-brand inline-flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-medium text-white",
        // Negative spread keeps glow under the button so parents don't clip the sides
        "shadow-[0_10px_22px_-4px_rgba(30,87,234,0.35)] transition-opacity hover:opacity-95",
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

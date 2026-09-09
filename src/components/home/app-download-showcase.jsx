"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

function AppleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M16.7 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zm-2.3-6.8c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

function PlayColorIcon({ className }) {
  return (
    <img
      src="/icons/store/google-play-icon.png"
      alt=""
      width={26}
      height={26}
      className={cn("object-contain", className)}
      aria-hidden
    />
  );
}

function StoreBadge({ href, ariaLabel, eyebrow, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex h-12 items-center gap-2.5 rounded-[9px] bg-white px-3.5",
        "shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)]",
        "transition-transform duration-200 hover:-translate-y-0.5",
        "focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
      )}
    >
      {icon}
      <span className="pr-1 text-left leading-none text-black">
        <span className="block text-[9px] font-medium tracking-wide text-black/70">
          {eyebrow}
        </span>
        <span className="mt-0.5 block text-[16px] font-semibold tracking-tight text-black">
          {label}
        </span>
      </span>
    </a>
  );
}

function PhoneMockup({ src, alt, className }) {
  return (
    <div
      className={cn(
        "relative w-[10.5rem] shrink-0 overflow-hidden rounded-[2.75rem]",
        "drop-shadow-[0_22px_40px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={336}
        height={684}
        className="h-auto w-full object-contain"
        sizes="240px"
      />
    </div>
  );
}

/** Desktop-only app download — radar / signal creative banner */
export function AppDownloadShowcase({ className }) {
  return (
    <section
      aria-label="Download Bookento app"
      className={cn("hidden md:block", className)}
    >
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#07111F]">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[68%] size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[68%] size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.09]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[68%] size-[14rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1865EA]/35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[68%] size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1865EA]/20 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-[68%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#58A1FF] shadow-[0_0_24px_rgba(88,161,255,0.9)]"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(ellipse_at_70%_50%,rgba(24,101,234,0.35)_0%,transparent_70%)]"
        />

        <div className="relative z-10 grid min-h-[20rem] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center gap-8 px-9 py-10 lg:min-h-[calc(26rem-90px)] lg:px-12 lg:py-12">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#58A1FF] opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-[#58A1FF]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                Live on stores
              </span>
            </div>

            <h2 className="mt-5 text-[2.55rem] leading-[1.05] font-bold tracking-tight text-white lg:text-[3rem]">
              Catch every
              <br />
              booking signal.
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
              Bookento on your phone means faster discovery, clearer slots, and
              reminders that actually show up.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StoreBadge
                href="#"
                ariaLabel="Download on the App Store"
                eyebrow="Download on the"
                label="App Store"
                icon={<AppleIcon className="size-[34px] text-black" />}
              />
              <StoreBadge
                href="#"
                ariaLabel="Get it on Google Play"
                eyebrow="GET IT ON"
                label="Google Play"
                icon={<PlayColorIcon className="size-[26px]" />}
              />
            </div>
          </div>

          <div
            className="relative hidden h-[calc(26rem-90px)] items-center justify-center gap-5 lg:flex"
            aria-hidden
          >
            <PhoneMockup
              src="/images/app-mockups/home-phone.jpg"
              alt="Bookento home screen"
              className="z-20 w-[15rem] -translate-y-[calc(42%-60px)]"
            />
            <PhoneMockup
              src="/images/app-mockups/doctors-phone.png"
              alt="Bookento doctors screen"
              className="z-10 w-[15rem] translate-y-[calc(42%-60px)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

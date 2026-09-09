"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

/**
 * Desktop-only offer banner — bold typographic flash deal.
 */
export function FeaturePromoBanner({ className }) {
  return (
    <section
      aria-label="Limited time offer"
      className={cn("hidden md:block", className)}
    >
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#08101C]">
        {/* Atmosphere */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(24,101,234,0.35)_0%,transparent_48%),radial-gradient(ellipse_at_92%_80%,rgba(88,161,255,0.18)_0%,transparent_42%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 78%)",
          }}
        />

        {/* Diagonal flash ribbon */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 -right-16 rotate-[18deg]"
        >
          <div className="flex w-[28rem] items-center justify-center gap-6 bg-[#1865EA] py-2.5 text-[11px] font-semibold tracking-[0.22em] text-white uppercase shadow-[0_12px_40px_-12px_rgba(24,101,234,0.8)]">
            <span>Flash deal</span>
            <span className="size-1 rounded-full bg-white/70" />
            <span>Ends soon</span>
            <span className="size-1 rounded-full bg-white/70" />
            <span>Flash deal</span>
          </div>
        </div>

        <div className="relative z-10 grid min-h-[19rem] grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-6 px-9 py-10 lg:min-h-[20.5rem] lg:px-12 lg:py-11">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#58A1FF] opacity-55" />
                <span className="relative inline-flex size-2 rounded-full bg-[#58A1FF]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                Seasonal drop
              </span>
            </div>

            <h2 className="mt-5 text-[2.4rem] leading-[1.05] font-bold tracking-tight text-white lg:text-[2.85rem]">
              Book more.
              <span className="mt-1 block [background-image:linear-gradient(105deg,#FFFFFF_10%,#7EB6FF_55%,#1865EA_100%)] bg-clip-text text-transparent">
                Pay less this week.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/55">
              Salon, spa, home care and more — unlock member-style savings on everyday
              bookings before the drop ends.
            </p>

            <div className="mt-7">
              <Link
                href={ROUTES.PROVIDERS}
                className={cn(
                  "group gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5",
                  "text-sm font-semibold text-white",
                  "shadow-[0_12px_28px_-12px_rgba(24,101,234,0.85)]",
                  "transition-[filter,transform] duration-200 hover:-translate-y-0.5 hover:brightness-105",
                  "focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08101C] focus-visible:outline-none",
                )}
              >
                Grab this deal
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-200 group-hover:rotate-12">
                  <ArrowUpRight className="size-3.5" strokeWidth={2.4} />
                </span>
              </Link>
            </div>
          </div>

          {/* Deal spotlight — circular photo + glass badge */}
          <div className="relative hidden h-full min-h-[17rem] lg:block" aria-hidden>
            <div className="absolute top-1/2 left-1/2 size-[17.5rem] -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-4 rounded-full border border-[#1865EA]/35" />
              <div className="absolute inset-8 overflow-hidden rounded-full border border-white/20 shadow-[0_28px_50px_-20px_rgba(0,0,0,0.65)]">
                <Image
                  src="/images/promo-summer-spa.png"
                  alt="Spa and wellness offer"
                  fill
                  className="object-cover object-[center_28%]"
                  sizes="280px"
                />
              </div>
              <div className="absolute -top-1 -right-2 size-16 rounded-full bg-[#1865EA]/30 blur-2xl" />
              <div className="absolute -bottom-2 -left-3 size-20 rounded-full bg-[#58A1FF]/20 blur-2xl" />
            </div>

            <div className="absolute top-[12%] right-[4%] z-20 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] backdrop-blur-md">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[#7EB6FF] uppercase">
                Save up to
              </p>
              <p className="mt-0.5 text-[2.35rem] leading-none font-bold tracking-tight text-white">
                40%
              </p>
            </div>

            <div className="absolute bottom-[14%] left-[2%] z-20 rounded-full border border-white/10 bg-[#0C1628]/85 px-3.5 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-sm">
              Spa · Salon · Home
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

          {/* Right visual — full-bleed photo, no floating badges */}
          <div className="relative hidden h-full min-h-[17rem] lg:block" aria-hidden>
            <div className="absolute inset-y-0 right-0 -mr-12 w-[calc(100%+1.5rem)] overflow-hidden lg:-mr-12">
              <div className="absolute inset-0">
                <Image
                  src="/images/promo-summer-spa.png"
                  alt=""
                  fill
                  className="object-cover object-[center_22%]"
                  sizes="(min-width: 1024px) 40vw, 0px"
                  priority={false}
                />
              </div>
              {/* Blend into dark panel so photo feels part of the banner */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#08101C] via-[#08101C]/55 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08101C]/70 via-transparent to-[#08101C]/25" />
            </div>

            <p className="absolute right-2 bottom-1 z-10 text-[6.5rem] leading-none font-bold tracking-tighter text-white/[0.07] select-none lg:text-[7.5rem]">
              40%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

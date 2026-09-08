"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

/**
 * Desktop-only offer banner — promotional strip (not a pass/ticket).
 */
export function FeaturePromoBanner({ className }) {
  return (
    <section
      aria-label="Limited time offer"
      className={cn("hidden md:block", className)}
    >
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#0A1220]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(ellipse_at_70%_45%,rgba(24,101,234,0.45)_0%,rgba(24,101,234,0.12)_42%,transparent_72%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-[#1865EA]/20 blur-3xl"
        />

        <div className="relative z-10 grid min-h-[18rem] grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch lg:min-h-[19.5rem]">
          <div className="flex flex-col justify-center px-9 py-10 lg:px-12 lg:py-11">
            <span className="inline-flex w-fit items-center rounded-md bg-[#DB2777] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
              Limited time
            </span>

            <h2 className="mt-4 max-w-md text-[2.35rem] leading-[1.08] font-bold tracking-tight text-white lg:text-[2.75rem]">
              Summer Special
              <span className="mt-1 block text-[#7EB6FF]">Up to 40% OFF</span>
            </h2>

            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
              Save on salon, spa, home care, and more. Book your favourites
              before this seasonal deal ends.
            </p>

            <div className="mt-7">
              <Link
                href={ROUTES.PROVIDERS}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5",
                  "text-sm font-semibold text-[#0F1B2D]",
                  "transition-transform duration-200 hover:-translate-y-0.5",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                )}
              >
                Explore offers
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[18rem] lg:min-h-[19.5rem]">
            <Image
              src="/images/promo-summer-spa.png"
              alt="Spa and wellness offer"
              fill
              className="object-cover object-[center_30%]"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority={false}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-[#0A1220] via-[#0A1220]/35 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

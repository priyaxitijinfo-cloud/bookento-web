"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";

import { Button } from "@/components/ui/button";
import { TODAY_APPOINTMENT } from "@/constants/home-appointment";
import { appointmentDetailRoute } from "@/constants/routes.constants";
import { avatarUrl } from "@/mock/helpers";
import { cn } from "@/lib/utils";

const HERO_IMAGE = "/images/hero-spa.png";

const CUSTOMER_AVATARS = [
  avatarUrl("hero-customer-1"),
  avatarUrl("hero-customer-2"),
  avatarUrl("hero-customer-3"),
];

export function HeroSection({ className }) {
  return (
    <section
      className={cn(
        "relative aspect-[1024/312] w-full min-h-[12rem] overflow-hidden rounded-xl bg-[#F3EEFF] sm:min-h-[14rem] md:rounded-2xl",
        className,
      )}
      style={{
        backgroundImage: `url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 z-10 flex max-w-[88%] flex-col justify-center px-4 py-5 sm:max-w-[78%] sm:px-6 md:max-w-[52%] md:px-10 md:py-8 lg:px-12 lg:py-10">
        <span className="bg-primary/10 text-primary inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:px-3 sm:py-1 sm:text-xs">
          Today
        </span>

        <h1 className="text-foreground mt-2 text-[1.35rem] leading-[1.12] font-bold tracking-tight sm:text-2xl md:mt-3 md:text-[2.5rem] lg:text-[2.75rem]">
          Today, you have an
          <br />
          <span className="text-primary">appointment</span>
        </h1>

        <p className="text-foreground mt-1.5 line-clamp-2 text-sm font-semibold sm:text-base md:mt-2 md:text-lg lg:text-xl">
          {TODAY_APPOINTMENT.service}
        </p>

        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm md:text-[0.9375rem]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 sm:size-4" strokeWidth={2.5} />
            {TODAY_APPOINTMENT.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <LocationIcon className="size-3.5 sm:size-4" strokeWidth={2.5} />
            {TODAY_APPOINTMENT.visitType}
          </span>
        </div>

        <Button
          asChild
          size="lg"
          className="mt-3 h-9 w-fit rounded-full px-4 text-xs font-semibold shadow-[0_4px_14px_rgba(94,76,245,0.35)] sm:mt-4 sm:h-10 sm:px-5 sm:text-sm md:mt-6 md:h-12 md:px-7"
        >
          <Link href={appointmentDetailRoute(TODAY_APPOINTMENT.id)}>
            View Details
            <ArrowRight className="size-3.5 sm:size-4" />
          </Link>
        </Button>
      </div>

      <div className="absolute right-2 bottom-2 z-10 flex scale-90 items-center gap-2 rounded-2xl bg-background px-2.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:right-4 sm:bottom-4 sm:scale-100 sm:px-3 md:right-6 md:bottom-6 md:gap-3 md:px-4 md:py-3">
        <div className="flex -space-x-2">
          {CUSTOMER_AVATARS.map((src, i) => (
            <div
              key={src}
              className="border-card relative size-7 overflow-hidden rounded-full border-2 md:size-9"
              style={{ zIndex: 3 - i }}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="36px" />
            </div>
          ))}
        </div>
        <div>
          <p className="text-foreground text-xs leading-none font-bold sm:text-sm md:text-base">10K+</p>
          <p className="text-muted-foreground mt-0.5 text-[9px] sm:text-[10px] md:text-xs">Happy Customers</p>
        </div>
      </div>
    </section>
  );
}

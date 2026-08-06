"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TODAY_APPOINTMENT } from "@/constants/home-appointment";
import { appointmentDetailRoute } from "@/constants/routes.constants";

export function UpcomingAppointmentCard() {
  return (
    <Link
      href={appointmentDetailRoute(TODAY_APPOINTMENT.id)}
      className="group relative flex min-h-[11.5rem] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#FF9F5A] via-[#FF6B45] to-[#F03D4E] p-4 shadow-[0_12px_32px_rgba(240,61,78,0.28)]"
    >
      <div className="relative z-10 flex min-w-0 max-w-[58%] flex-1 flex-col sm:max-w-[60%]">
        <span className="inline-flex w-fit rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-[#F03D4E]">
          Today
        </span>

        <h2 className="mt-3 line-clamp-2 text-[1.25rem] leading-[1.15] font-bold tracking-tight text-white">
          {TODAY_APPOINTMENT.service}
        </h2>

        <div className="mt-3 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/35 bg-background/15 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-1">
            <img
              src="/icons/appointment-clock.svg"
              alt=""
              className="size-3.5 shrink-0"
              aria-hidden
              draggable={false}
            />
            {TODAY_APPOINTMENT.time}
          </span>
          <span className="h-3 w-px bg-background/45" aria-hidden />
          <span className="inline-flex items-center gap-1">
            <img
              src="/icons/User.svg"
              alt=""
              className="size-3.5 shrink-0"
              aria-hidden
              draggable={false}
            />
            {TODAY_APPOINTMENT.visitType}
          </span>
        </div>

        <span className="relative top-[10px] mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-background px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm transition-transform group-hover:scale-[1.02]">
          View Details
          <ArrowRight className="size-3.5" />
        </span>
      </div>

      <Image
        src="/icons/appointment-calendar.png"
        alt=""
        width={168}
        height={168}
        className="pointer-events-none absolute -right-1 -bottom-1 h-[9.5rem] w-[9.5rem] object-contain sm:-right-0.5 sm:h-[10.5rem] sm:w-[10.5rem]"
        aria-hidden
        priority
      />
    </Link>
  );
}

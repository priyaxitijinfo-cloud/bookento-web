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
      className="group relative flex min-h-[11.5rem] overflow-hidden rounded-[1.25rem] p-4 shadow-[0_12px_32px_rgba(240,61,78,0.28)] max-md:min-h-[11.75rem] max-md:p-[1.125rem] md:bg-gradient-to-br md:from-[#FF9F5A] md:via-[#FF6B45] md:to-[#F03D4E]"
    >
      <img
        src="/icons/bg01.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover md:hidden"
        aria-hidden
        draggable={false}
      />

      <div className="relative z-10 flex max-w-[58%] min-w-0 flex-1 flex-col sm:max-w-[60%]">
        <span className="bg-background inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#F03D4E] max-md:rounded-md max-md:bg-white max-md:py-[5px]">
          Today
        </span>

        <h2 className="mt-3 line-clamp-2 text-[1.25rem] leading-[1.15] font-bold tracking-tight text-white max-md:mt-2.5 max-md:line-clamp-none max-md:text-[1.375rem] max-md:leading-[1.2]">
          <span className="md:hidden">
            Hair Spa &amp;
            <br />
            Facial Combo
          </span>
          <span className="hidden md:inline">{TODAY_APPOINTMENT.service}</span>
        </h2>

        <div className="bg-background/15 mt-3 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/35 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-[2px] max-md:mt-2.5 max-md:border-white/40 max-md:bg-white/18 max-md:px-3">
          <span className="inline-flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-3.5 shrink-0 md:hidden"
              aria-hidden
            >
              <path
                d="M8.99994 2C7.61547 2 6.26209 2.41054 5.11095 3.17971C3.95981 3.94888 3.0626 5.04213 2.53279 6.32121C2.00297 7.6003 1.86435 9.00776 2.13445 10.3656C2.40454 11.7235 3.07123 12.9708 4.05019 13.9497C5.02916 14.9287 6.27644 15.5954 7.63431 15.8655C8.99217 16.1356 10.3996 15.997 11.6787 15.4672C12.9578 14.9373 14.0511 14.0401 14.8202 12.889C15.5894 11.7378 15.9999 10.3845 15.9999 9C15.9977 7.14416 15.2595 5.36495 13.9473 4.05267C12.635 2.74039 10.8558 2.00219 8.99994 2ZM11.3589 11.359C11.2396 11.4783 11.0778 11.5453 10.909 11.5453C10.7403 11.5453 10.5785 11.4783 10.4591 11.359L8.55003 9.44991C8.43068 9.33059 8.36361 9.16876 8.36358 9V5.18182C8.36358 5.01304 8.43062 4.85118 8.54996 4.73184C8.6693 4.6125 8.83117 4.54545 8.99994 4.54545C9.16871 4.54545 9.33058 4.6125 9.44992 4.73184C9.56926 4.85118 9.6363 5.01304 9.6363 5.18182V8.73654L11.3589 10.4592C11.4782 10.5785 11.5453 10.7403 11.5453 10.9091C11.5453 11.0778 11.4782 11.2397 11.3589 11.359Z"
                fill="#FFFFFF"
              />
            </svg>
            <img
              src="/icons/appointment-clock.svg"
              alt=""
              className="hidden size-3.5 shrink-0 md:block"
              aria-hidden
              draggable={false}
            />
            {TODAY_APPOINTMENT.time}
          </span>
          <span className="bg-background/45 h-3 w-px max-md:bg-white/45" aria-hidden />
          <span className="inline-flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-3.5 shrink-0 md:hidden"
              aria-hidden
            >
              <path
                d="M12.2858 11.4898C15.2766 11.4898 17.7012 9.07765 17.7012 6.10208C17.7012 3.12652 15.2766 0.714355 12.2858 0.714355C9.29498 0.714355 6.87044 3.12652 6.87044 6.10208C6.87044 9.07765 9.29498 11.4898 12.2858 11.4898Z"
                fill="#FFFFFF"
              />
              <path
                d="M15.1063 13.7348H9.4653C6.19352 13.7348 3.48584 16.4287 3.48584 19.6838C3.48584 20.4695 3.8243 21.1429 4.50122 21.4797C5.5166 22.0409 7.773 22.7144 12.2858 22.7144C16.7986 22.7144 19.055 22.0409 20.0704 21.4797C20.6345 21.1429 21.0858 20.4695 21.0858 19.6838C21.0858 16.3164 18.3781 13.7348 15.1063 13.7348Z"
                fill="#FFFFFF"
              />
            </svg>
            <img
              src="/icons/User.svg"
              alt=""
              className="hidden size-3.5 shrink-0 md:block"
              aria-hidden
              draggable={false}
            />
            {TODAY_APPOINTMENT.visitType}
          </span>
        </div>

        <span className="bg-background text-foreground relative top-[10px] mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-semibold shadow-sm transition-transform group-hover:scale-[1.02] max-md:top-0 max-md:mt-4 max-md:bg-white max-md:text-[#111827]">
          View Details
          <ArrowRight className="size-3.5" />
        </span>
      </div>

      <Image
        src="/icons/appointment-calendar.png"
        alt=""
        width={168}
        height={168}
        className="pointer-events-none absolute -right-1 -bottom-1 z-[1] h-[9.5rem] w-[9.5rem] object-contain max-md:right-[6px] max-md:bottom-[18px] max-md:h-[10.25rem] max-md:w-[10.25rem] sm:-right-0.5 sm:h-[10.5rem] sm:w-[10.5rem]"
        aria-hidden
        priority
      />
    </Link>
  );
}

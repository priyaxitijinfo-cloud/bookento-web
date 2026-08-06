"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { appointmentDetailRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format.utils";

function DesktopMetaRow({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-[18px]" strokeWidth={2} />
      </span>
      <span className="text-foreground/85 min-w-0 truncate text-[13px] leading-snug md:text-sm">
        {children}
      </span>
    </div>
  );
}

export function BookingListCard({ appointment }) {
  const dateLabel = formatDate(appointment.scheduledDate, "EEE, MMM d");
  const locationLabel = appointment.address || appointment.locationName || "Provider location";
  const serviceLine = appointment.duration
    ? `${appointment.serviceName} • ${appointment.duration} min`
    : appointment.serviceName;

  return (
    <Link
      href={appointmentDetailRoute(appointment.id)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.125rem] border border-border/60 bg-background",
        "shadow-card transition-all duration-300",
        "hover:-translate-y-[3px] hover:shadow-card-hover",
      )}
    >
      {/* Mobile layout */}
      <div className="flex items-start gap-3 p-3.5 md:hidden">
        <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={appointment.providerAvatar}
            alt={appointment.providerName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-[15px] font-bold leading-tight">
            {appointment.providerName}
          </h3>
          <p className="text-muted-foreground mt-0.5 truncate text-[13px] leading-snug">
            {serviceLine}
          </p>
        </div>

        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[#9CA3AF]"
          aria-hidden
        >
          <ChevronRight className="size-4" strokeWidth={2.25} />
        </span>
      </div>

      <div className="flex w-full items-center border-t border-[#EEF0F4] px-3.5 py-3 md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2.5">
          <img
            src="/icons/02.svg"
            alt=""
            className="size-3.5 shrink-0"
            aria-hidden
            draggable={false}
          />
          <span className="text-muted-foreground min-w-0 truncate text-[11px] leading-none">
            {locationLabel}
          </span>
        </div>

        <span className="bg-[#E5E7EB] h-4 w-px shrink-0 self-center" aria-hidden />

        <div className="flex shrink-0 items-center gap-1.5 pl-2.5">
          <img
            src="/icons/01.svg"
            alt=""
            className="size-3.5 shrink-0"
            aria-hidden
            draggable={false}
          />
          <span className="text-muted-foreground whitespace-nowrap text-[11px] leading-none">
            {dateLabel} · {appointment.scheduledTime}
          </span>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden items-start gap-3.5 p-4 md:flex md:gap-4 md:p-5">
        <div className="bg-muted ring-border/40 relative size-[4.5rem] shrink-0 overflow-hidden rounded-2xl ring-1">
          <Image
            src={appointment.providerAvatar}
            alt={appointment.providerName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="72px"
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-foreground truncate text-lg font-bold leading-tight tracking-tight">
            {appointment.providerName}
          </h3>
          <p className="text-muted-foreground mt-1 truncate text-sm leading-snug">
            {appointment.serviceName}
          </p>
          {appointment.duration ? (
            <p className="text-muted-foreground/75 mt-2 text-[13px]">
              {appointment.duration} min
            </p>
          ) : null}
        </div>

        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            "bg-primary/10 text-primary transition-all duration-300",
            "group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_4px_14px_rgba(24,101,234,0.28)]",
          )}
          aria-hidden
        >
          <ChevronRight className="size-5" strokeWidth={2.25} />
        </span>
      </div>

      <div className="mt-auto hidden space-y-3 border-t border-border/50 px-5 pb-5 pt-4 md:block">
        <DesktopMetaRow icon={LocationIcon}>{locationLabel}</DesktopMetaRow>
        <DesktopMetaRow icon={Calendar}>
          {dateLabel} · {appointment.scheduledTime}
        </DesktopMetaRow>
      </div>
    </Link>
  );
}

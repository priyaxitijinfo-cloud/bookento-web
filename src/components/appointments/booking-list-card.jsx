"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  BookingListCalendarIcon,
  BookingListLocationIcon,
} from "@/components/icons/booking-detail-icons";
import { appointmentDetailRoute } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format.utils";

function DesktopMetaRow({ icon: Icon, iconClassName, children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl">
        <Icon className={cn("size-[18px]", iconClassName)} />
      </span>
      <span className="text-foreground/85 min-w-0 truncate text-[13px] leading-snug md:text-sm">
        {children}
      </span>
    </div>
  );
}

export function BookingListCard({ appointment }) {
  const dateLabel = formatDate(appointment.scheduledDate, "EEE, MMM d");
  const locationLabel =
    appointment.address || appointment.locationName || "Provider location";
  const serviceLine = appointment.duration
    ? `${appointment.serviceName} • ${appointment.duration} min`
    : appointment.serviceName;

  return (
    <Link
      href={appointmentDetailRoute(appointment.id)}
      className={cn(
        "group bg-background flex h-full flex-col overflow-hidden rounded-[1.125rem] border",
        "border-[#F2F2F2] shadow-none",
        "transition-all duration-300 md:hover:-translate-y-[3px]",
      )}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        <div className="flex items-center gap-3 p-3.5">
          <div className="bg-muted relative size-[54px] shrink-0 overflow-hidden rounded-xl">
            <Image
              src={appointment.providerAvatar}
              alt={appointment.providerName}
              fill
              className="object-cover"
              sizes="54px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-[17px] leading-tight font-bold">
              {appointment.providerName}
            </h3>
            <p className="text-muted-foreground mt-1.5 truncate text-[13px] leading-snug">
              {serviceLine}
            </p>
          </div>

          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F2F6FC] text-[#202020]"
            aria-hidden
          >
            <ChevronRight className="size-4" strokeWidth={2.25} />
          </span>
        </div>

        <div className="border-t border-[#EEF0F4]" aria-hidden />

        <div className="flex w-full items-center px-3.5 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2.5">
            <BookingListLocationIcon className="text-primary size-4 shrink-0" />
            <span className="text-muted-foreground min-w-0 truncate text-[11px] leading-none">
              {locationLabel}
            </span>
          </div>

          <span className="h-4 w-px shrink-0 self-center bg-[#E5E7EB]" aria-hidden />

          <div className="flex shrink-0 items-center gap-1.5 pl-2.5">
            <BookingListCalendarIcon className="text-primary size-4 shrink-0" />
            <span className="text-muted-foreground text-[11px] leading-none whitespace-nowrap">
              {dateLabel} · {appointment.scheduledTime}
            </span>
          </div>
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
          <h3 className="text-foreground truncate text-lg leading-tight font-bold tracking-tight">
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
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F2F6FC] text-[#202020]"
          aria-hidden
        >
          <ChevronRight className="size-5" strokeWidth={2.25} />
        </span>
      </div>

      <div className="border-border/50 mt-auto hidden space-y-3 border-t px-5 pt-4 pb-5 md:block">
        <DesktopMetaRow icon={BookingListLocationIcon}>{locationLabel}</DesktopMetaRow>
        <DesktopMetaRow icon={BookingListCalendarIcon} iconClassName="size-4">
          {dateLabel} · {appointment.scheduledTime}
        </DesktopMetaRow>
      </div>
    </Link>
  );
}

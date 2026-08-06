"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

export function BookingEmptyState({ tab, onBrowse }) {
  const title = tab === "pending" ? "Not Booking Yet" : `No ${tab} bookings`;
  const description =
    tab === "pending"
      ? "You don't have any upcoming bookings. Let's schedule your first appointment."
      : `You don't have any ${tab} appointments right now.`;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center md:py-16">
      {/* Mobile illustration */}
      <div className="relative mb-6 flex h-44 w-full max-w-[220px] items-center justify-center md:hidden">
        <Image
          src="/icons/appointment-calendar.png"
          alt=""
          width={200}
          height={200}
          className="h-auto w-full max-w-[180px] object-contain"
          aria-hidden
          priority
        />
      </div>

      {/* Desktop illustration */}
      <div className="relative mb-6 hidden size-40 items-center justify-center rounded-[2rem] bg-[#EFF6FF] md:flex">
        <CalendarDays className="size-16 text-primary/70" strokeWidth={1.5} />
      </div>

      <h3 className="text-foreground text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">{description}</p>
      <Button
        className="gradient-brand mt-6 hidden rounded-xl px-6 md:inline-flex"
        onClick={onBrowse ?? (() => { window.location.href = ROUTES.PROVIDERS; })}
      >
        Explore providers
      </Button>
    </div>
  );
}

"use client";

import Image from "next/image";

import { IllustrationEmptyState } from "@/components/shared/illustration-empty-state";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes.constants";

const BOOKING_EMPTY_DESCRIPTION =
  "You don't have any upcoming bookings. Let's schedule your first appointment.";

export function BookingEmptyState({ onBrowse }) {
  return (
    <>
      <IllustrationEmptyState
        src="/icons/not-booking-yet.png"
        title="Not Booking Yet"
        description={BOOKING_EMPTY_DESCRIPTION}
        className="md:hidden"
      />
      <div className="hidden flex-col items-center justify-center px-4 py-16 text-center md:flex">
        <div className="relative mb-6 flex size-52 items-center justify-center">
          <Image
            src="/icons/not-booking-yet.png"
            alt=""
            width={208}
            height={208}
            className="size-full object-contain"
            aria-hidden
            priority
          />
        </div>

        <h3 className="text-foreground text-xl font-bold">Not Booking Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
          You don&apos;t have any upcoming bookings. Let&apos;s schedule your first
          appointment.
        </p>
        <Button
          className="gradient-brand mt-6 rounded-xl px-6"
          onClick={
            onBrowse ??
            (() => {
              window.location.href = ROUTES.PROVIDERS;
            })
          }
        >
          Explore providers
        </Button>
      </div>
    </>
  );
}

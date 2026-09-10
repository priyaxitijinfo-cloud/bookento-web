"use client";

import {
  Bell,
  Clock3,
  CreditCard,
  FileHeart,
  MessageCircleMore,
  Star,
  Video,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Instant Booking",
    description:
      "Book appointments in seconds with real-time availability and instant confirmation.",
    icon: Zap,
    tile: "bg-[linear-gradient(160deg,#1A6BFF_0%,#4B93FF_100%)] shadow-[0_10px_18px_-10px_rgba(26,107,255,0.7)]",
  },
  {
    title: "Real-Time Availability",
    description:
      "See live schedules and book slots that work perfectly for your calendar.",
    icon: Clock3,
    tile: "bg-[linear-gradient(160deg,#12B76A_0%,#32D583_100%)] shadow-[0_10px_18px_-10px_rgba(18,183,106,0.65)]",
  },
  {
    title: "Video Consultation",
    description: "Connect with professionals remotely through secure HD video calls.",
    icon: Video,
    tile: "bg-[linear-gradient(160deg,#7A5AF8_0%,#9B8AFB_100%)] shadow-[0_10px_18px_-10px_rgba(122,90,248,0.65)]",
  },
  {
    title: "In-App Chat",
    description: "Message your service providers directly for questions and updates.",
    icon: MessageCircleMore,
    tile: "bg-[linear-gradient(160deg,#F79009_0%,#FDB022_100%)] shadow-[0_10px_18px_-10px_rgba(247,144,9,0.65)]",
  },
  {
    title: "Online Payments",
    description:
      "Secure payment processing with multiple options and instant receipts.",
    icon: CreditCard,
    tile: "bg-[linear-gradient(160deg,#15B79E_0%,#2ED3B7_100%)] shadow-[0_10px_18px_-10px_rgba(21,183,158,0.65)]",
  },
  {
    title: "Smart Reminders",
    description: "Never miss an appointment with push notifications and SMS alerts.",
    icon: Bell,
    tile: "bg-[linear-gradient(160deg,#EE46BC_0%,#F670C7_100%)] shadow-[0_10px_18px_-10px_rgba(238,70,188,0.6)]",
  },
  {
    title: "Digital Prescriptions",
    description:
      "Receive and store digital prescriptions securely in your health vault.",
    icon: FileHeart,
    tile: "bg-[linear-gradient(160deg,#6172F3_0%,#8098F9_100%)] shadow-[0_10px_18px_-10px_rgba(97,114,243,0.65)]",
  },
  {
    title: "Ratings & Reviews",
    description: "Make informed decisions with verified reviews from real customers.",
    icon: Star,
    tile: "bg-[linear-gradient(160deg,#FDB022_0%,#FEC84B_100%)] shadow-[0_10px_18px_-10px_rgba(253,176,34,0.65)]",
  },
];

/** Desktop-only features grid for the home landing page */
export function FeaturesShowcase({ className }) {
  return (
    <section
      id="features"
      aria-label="Platform features"
      className={cn(
        "hidden scroll-mt-28 md:block",
        "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
        className,
      )}
    >
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F4F8FF_0%,#EEF4FC_48%,#F7FAFF_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(24,101,234,0.14)_0%,transparent_52%),radial-gradient(ellipse_at_12%_80%,rgba(88,161,255,0.1)_0%,transparent_42%),radial-gradient(ellipse_at_90%_70%,rgba(24,101,234,0.08)_0%,transparent_40%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(24,101,234,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(24,101,234,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at 50% 40%, black 18%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[calc(96rem-60px)] px-[4.875rem] py-14 xl:px-[5.875rem] xl:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-white/80 px-3.5 py-1 text-[12px] font-semibold text-[#1865EA] shadow-[0_1px_0_rgba(24,101,234,0.08)] ring-1 ring-[#D7E4FA]">
              Features
            </span>

            <h2 className="mt-5 text-[calc(2.15rem-4px)] leading-[1.12] font-bold tracking-tight text-[#0F1B2D] lg:text-[2.5rem]">
              Everything You Need To{" "}
              <span className="text-[#1865EA]">Manage Appointments</span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[#667085]">
              Powerful tools designed for both customers and service providers.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-5 xl:gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className={cn(
                    "rounded-2xl border border-white/80 bg-white/95 p-5 xl:p-6",
                    "shadow-[0_12px_32px_-20px_rgba(15,23,42,0.28)] backdrop-blur-sm",
                    "transition-[transform,box-shadow,border-color] duration-300",
                    "hover:-translate-y-0.5 hover:border-[#D7E4FA] hover:shadow-[0_18px_36px_-22px_rgba(24,101,234,0.28)]",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-[0.85rem] text-white",
                      feature.tile,
                    )}
                  >
                    <Icon className="size-[22px]" strokeWidth={2.2} aria-hidden />
                  </span>

                  <h3 className="mt-4 text-[15px] font-bold tracking-tight text-[#0F1B2D] xl:text-base">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#667085] xl:text-[14px]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

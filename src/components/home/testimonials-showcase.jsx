"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { DesktopSectionHeading } from "@/components/home/section-header";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    id: "t1",
    name: "Ananya Mehta",
    place: "Mumbai",
    service: "Salon & Spa",
    rating: 5,
    quote: "Booked a spa session in minutes. Premium from start to finish.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    tint: "#1FA7A0",
    tintSoft: "#E6F7F6",
    offset: "mt-10",
    tilt: "rotate-[-2.5deg]",
  },
  {
    id: "t2",
    name: "Rahul Desai",
    place: "Ahmedabad",
    service: "Home Cleaning",
    rating: 5,
    quote: "Weekly cleaning without the chase. Booking just works.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    tint: "#F08A3A",
    tintSoft: "#FFF1E6",
    offset: "mt-2",
    tilt: "rotate-[1.8deg]",
  },
  {
    id: "t3",
    name: "Sneha Kapoor",
    place: "Bangalore",
    service: "Doctor Visit",
    rating: 5,
    quote: "Found a clinic, checked reviews, booked the same day.",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
    tint: "#1865EA",
    tintSoft: "#EAF1FF",
    offset: "mt-14",
    tilt: "rotate-[-1.2deg]",
  },
  {
    id: "t4",
    name: "Vikram Shah",
    place: "Pune",
    service: "Fitness",
    rating: 5,
    quote: "Switched trainers in one evening. Clear slots, honest ratings.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
    tint: "#E07A5F",
    tintSoft: "#FCEDE8",
    offset: "mt-5",
    tilt: "rotate-[2.2deg]",
  },
  {
    id: "t5",
    name: "Meera Joshi",
    place: "Surat",
    service: "Pet Care",
    rating: 5,
    quote: "Grooming booked in seconds. My dog’s new favorite visit.",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    tint: "#0EA5C8",
    tintSoft: "#E5F7FC",
    offset: "mt-12",
    tilt: "rotate-[-1.8deg]",
  },
  {
    id: "t6",
    name: "Arjun Patel",
    place: "Delhi",
    service: "Tutoring",
    rating: 5,
    quote: "Found a great tutor nearby. Scheduling felt effortless.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    tint: "#3D9B5F",
    tintSoft: "#E8F6EE",
    offset: "mt-3",
    tilt: "rotate-[1.4deg]",
  },
];

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "size-3",
            i < rating
              ? "fill-[#F5A623] text-[#F5A623]"
              : "fill-transparent text-[#D5DBE5]",
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ item }) {
  return (
    <article
      className={cn(
        "group/card relative w-[17.5rem] shrink-0 pt-8 lg:w-[18.5rem]",
        item.offset,
      )}
    >
      {/* Floating avatar */}
      <div
        className={cn(
          "absolute top-0 left-6 z-20 size-[4.25rem] overflow-hidden rounded-full",
          "bg-white ring-[3px] ring-white",
          "transition-transform duration-300 group-hover/card:-translate-y-1",
        )}
        style={{ boxShadow: `0 10px 24px -10px ${item.tint}88` }}
      >
        <Image
          src={item.photo}
          alt={item.name}
          fill
          className="object-cover"
          sizes="68px"
        />
      </div>

      {/* Quote bubble card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-white",
          "px-5 pt-12 pb-5 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.28)]",
          "transition-transform duration-300 group-hover/card:-translate-y-1.5",
          item.tilt,
        )}
      >
        {/* Soft color wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-20"
          style={{
            background: `linear-gradient(180deg, ${item.tintSoft} 0%, transparent 100%)`,
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute top-3 right-4 select-none text-[4.5rem] leading-none font-serif"
          style={{ color: item.tint, opacity: 0.22 }}
        >
          “
        </span>

        <div className="relative z-10">
          <Stars rating={item.rating} />

          <p className="mt-3 min-h-[4.5rem] text-[14.5px] leading-snug font-semibold tracking-tight text-[#0F1B2D]">
            {item.quote}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#EEF2F7] pt-3.5">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-[#0F1B2D]">
                {item.name}
              </p>
              <p className="truncate text-[12px] text-[#66758A]">
                {item.service} · {item.place}
              </p>
            </div>
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.tint }}
              aria-hidden
            />
          </div>
        </div>

        {/* Speech notch */}
        <div
          aria-hidden
          className="absolute -bottom-2 left-10 size-4 rotate-45 bg-white"
          style={{
            boxShadow: "2px 2px 0 0 transparent",
          }}
        />
      </div>
    </article>
  );
}

/** Desktop-only testimonials — infinite staggered marquee */
export function TestimonialsShowcase({ className }) {
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      id="testimonials"
      className={cn(
        "scroll-mt-28 hidden md:block",
        "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
        "md:py-0",
        className,
      )}
    >
      <div className="md:mx-auto md:w-full md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]">
        <DesktopSectionHeading
          badge="Testimonials"
          title="Heard it from"
          highlight="the people who booked."
        />
      </div>

      <div className="group/marquee relative mt-2 overflow-hidden">
        <div className="relative z-10 py-6">
          <div className="animate-testimonial-marquee flex w-max items-start gap-6 px-6 lg:gap-7">
            {loop.map((item, index) => (
              <ReviewCard
                key={`${item.id}-${index < TESTIMONIALS.length ? "a" : "b"}`}
                item={item}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

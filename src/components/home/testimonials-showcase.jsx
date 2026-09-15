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
    quote:
      "Booked a spa session in minutes. The therapist was on time, the room felt premium, and checkout was seamless from start to finish.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    offset: "mt-10",
    tilt: "rotate-[-2.5deg]",
  },
  {
    id: "t2",
    name: "Rahul Desai",
    place: "Ahmedabad",
    service: "Home Cleaning",
    rating: 5,
    quote:
      "Weekly cleaning without chasing anyone. I pick a slot, confirm the package, and the team shows up prepared every time.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80",
    offset: "mt-2",
    tilt: "rotate-[1.8deg]",
  },
  {
    id: "t3",
    name: "Sneha Kapoor",
    place: "Bangalore",
    service: "Doctor Visit",
    rating: 5,
    quote:
      "Found a clinic nearby, checked real reviews, and booked the same day. Clear slots and no phone tag made the visit easy.",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
    offset: "mt-14",
    tilt: "rotate-[-1.2deg]",
  },
  {
    id: "t4",
    name: "Vikram Shah",
    place: "Pune",
    service: "Fitness",
    rating: 5,
    quote:
      "Switched trainers in one evening. Honest ratings, clear packages, and reminders that actually helped me stay consistent.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
    offset: "mt-5",
    tilt: "rotate-[2.2deg]",
  },
  {
    id: "t5",
    name: "Meera Joshi",
    place: "Surat",
    service: "Pet Care",
    rating: 5,
    quote:
      "Grooming booked in seconds with photos of past work. My dog’s new favorite visit — and I love the transparent pricing.",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80",
    offset: "mt-12",
    tilt: "rotate-[-1.8deg]",
  },
  {
    id: "t6",
    name: "Arjun Patel",
    place: "Delhi",
    service: "Tutoring",
    rating: 5,
    quote:
      "Found a great tutor nearby with strong reviews. Scheduling felt effortless and progress updates keep us on track.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    offset: "mt-3",
    tilt: "rotate-[1.4deg]",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
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
      <div
        className={cn(
          "absolute top-0 left-6 z-20 size-[4.25rem] overflow-hidden rounded-full",
          "bg-white ring-[3px] ring-white",
          "shadow-[0_10px_22px_-12px_rgba(24,101,234,0.35)]",
          "transition-transform duration-300 group-hover/card:-translate-y-1",
        )}
      >
        <Image
          src={item.photo}
          alt={item.name}
          fill
          className="object-cover"
          sizes="68px"
        />
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.6rem]",
          "border border-[#E6EEF8] bg-[#FBFCFE]",
          "px-5 pt-12 pb-5 shadow-[0_12px_30px_-20px_rgba(15,27,45,0.22)]",
          "transition-transform duration-300 group-hover/card:-translate-y-1.5",
          item.tilt,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#EAF2FF_0%,transparent_100%)]"
        />

        <span
          aria-hidden
          className="pointer-events-none absolute top-3 right-4 font-serif text-[4.5rem] leading-none text-[#1865EA]/15 select-none"
        >
          “
        </span>

        <div className="relative z-10">
          <Stars rating={item.rating} />

          <p className="mt-3 min-h-[4.5rem] text-[14.5px] leading-snug font-medium tracking-tight text-[#243447]">
            {item.quote}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#E8EEF6] pt-3.5">
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-semibold text-[#0F1B2D]">
                {item.name}
              </p>
              <p className="truncate text-[12px] text-[#66758A]">
                {item.service} · {item.place}
              </p>
            </div>
            <span className="size-2.5 shrink-0 rounded-full bg-[#1865EA]" aria-hidden />
          </div>
        </div>

        <div
          aria-hidden
          className="absolute -bottom-2 left-10 size-4 rotate-45 border-r border-b border-[#E6EEF8] bg-[#FBFCFE]"
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
        "hidden scroll-mt-28 md:block",
        "md:relative md:left-1/2 md:w-screen md:max-w-[100vw] md:-translate-x-1/2",
        "md:py-0",
        className,
      )}
    >
      <div className="md:mx-auto md:w-full md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]">
        <DesktopSectionHeading
          badgeKey="testimonialsBadge"
          titleKey="testimonialsTitle"
          highlightKey="testimonialsHighlight"
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

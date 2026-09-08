"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { DesktopSectionHeading } from "@/components/home/section-header";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    id: "faq-1",
    question: "What is Bookento?",
    answer:
      "Bookento is your everyday booking partner for salon, spa, home care, fitness, doctors, and more — so you can find trusted professionals and book in a few taps.",
  },
  {
    id: "faq-2",
    question: "How do I book a service?",
    answer:
      "Choose a category, pick a professional nearby, select a service and time slot, then confirm your booking. You’ll get reminders and can manage everything from your appointments.",
  },
  {
    id: "faq-3",
    question: "Can I reschedule or cancel a booking?",
    answer:
      "Yes. Open your appointment details to reschedule or cancel based on the provider’s policy. You’ll always see the applicable rules before you confirm changes.",
  },
  {
    id: "faq-4",
    question: "Are the professionals verified?",
    answer:
      "We highlight ratings, reviews, and profile details so you can book with confidence. Look for ratings and past customer feedback on each provider card.",
  },
  {
    id: "faq-5",
    question: "What payment methods are supported?",
    answer:
      "You can pay securely through supported online methods at checkout. Wallet options may also be available depending on your account and offers.",
  },
];

function FaqItem({ item, open, onToggle }) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors duration-200",
        open
          ? "border-[#C9D8F5] bg-[#F5F9FF]"
          : "border-[#E6EBF3] bg-white hover:border-[#D5DEEC]",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[15px] font-semibold text-[#0F1B2D]">
          {item.question}
        </span>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
            open ? "bg-[#1865EA] text-white" : "bg-[#EEF2F7] text-[#4A5870]",
          )}
        >
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
            strokeWidth={2.25}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pt-0 pb-4 text-[14px] leading-relaxed text-[#556578]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Desktop-only FAQs for the landing page */
export function FaqShowcase({ className }) {
  const [openId, setOpenId] = useState(FAQS[0].id);

  return (
    <section
      id="faqs"
      className={cn("scroll-mt-28 hidden md:block", className)}
    >
      <DesktopSectionHeading
        badge="FAQ's"
        title="Questions?"
        highlight="We’ve got answers."
      />

      <div className="mx-auto grid max-w-3xl gap-3">
        {FAQS.map((item) => (
          <FaqItem
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() =>
              setOpenId((current) => (current === item.id ? null : item.id))
            }
          />
        ))}
      </div>
    </section>
  );
}

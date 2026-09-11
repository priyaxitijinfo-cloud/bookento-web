"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { DesktopSectionHeading } from "@/components/home/section-header";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const FAQS = [
  { id: "faq-1", questionKey: "faq1Q", answerKey: "faq1A" },
  { id: "faq-2", questionKey: "faq2Q", answerKey: "faq2A" },
  { id: "faq-3", questionKey: "faq3Q", answerKey: "faq3A" },
  { id: "faq-4", questionKey: "faq4Q", answerKey: "faq4A" },
  { id: "faq-5", questionKey: "faq5Q", answerKey: "faq5A" },
];

function FaqItem({ item, open, onToggle, t }) {
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
          {t(item.questionKey)}
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
            {t(item.answerKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Desktop-only FAQs for the landing page */
export function FaqShowcase({ className }) {
  const { t } = useWebLocale();
  const [openId, setOpenId] = useState(FAQS[0].id);

  return (
    <section id="faqs" className={cn("hidden scroll-mt-28 md:block", className)}>
      <DesktopSectionHeading
        badgeKey="faqBadge"
        titleKey="faqTitle"
        highlightKey="faqHighlight"
      />

      <div className="mx-auto grid max-w-3xl gap-3">
        {FAQS.map((item) => (
          <FaqItem
            key={item.id}
            item={item}
            t={t}
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

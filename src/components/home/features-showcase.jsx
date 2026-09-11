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

import { DesktopSectionHeading } from "@/components/home/section-header";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    titleKey: "featureInstantTitle",
    descKey: "featureInstantDesc",
    icon: Zap,
    tile: "bg-[linear-gradient(160deg,#1865EA_0%,#4B93FF_100%)] shadow-[0_10px_18px_-10px_rgba(24,101,234,0.7)]",
  },
  {
    titleKey: "featureAvailabilityTitle",
    descKey: "featureAvailabilityDesc",
    icon: Clock3,
    tile: "bg-[linear-gradient(160deg,#039855_0%,#32D583_100%)] shadow-[0_10px_18px_-10px_rgba(3,152,85,0.65)]",
  },
  {
    titleKey: "featureVideoTitle",
    descKey: "featureVideoDesc",
    icon: Video,
    tile: "bg-[linear-gradient(160deg,#7A5AF8_0%,#9B8AFB_100%)] shadow-[0_10px_18px_-10px_rgba(122,90,248,0.65)]",
  },
  {
    titleKey: "featureChatTitle",
    descKey: "featureChatDesc",
    icon: MessageCircleMore,
    tile: "bg-[linear-gradient(160deg,#EF6820_0%,#FDB022_100%)] shadow-[0_10px_18px_-10px_rgba(239,104,32,0.65)]",
  },
  {
    titleKey: "featurePaymentsTitle",
    descKey: "featurePaymentsDesc",
    icon: CreditCard,
    tile: "bg-[linear-gradient(160deg,#0BA5EC_0%,#36BFFA_100%)] shadow-[0_10px_18px_-10px_rgba(11,165,236,0.65)]",
  },
  {
    titleKey: "featureRemindersTitle",
    descKey: "featureRemindersDesc",
    icon: Bell,
    tile: "bg-[linear-gradient(160deg,#DD2590_0%,#F670C7_100%)] shadow-[0_10px_18px_-10px_rgba(221,37,144,0.6)]",
  },
  {
    titleKey: "featureRxTitle",
    descKey: "featureRxDesc",
    icon: FileHeart,
    tile: "bg-[linear-gradient(160deg,#E11D48_0%,#FB7185_100%)] shadow-[0_10px_18px_-10px_rgba(225,29,72,0.6)]",
  },
  {
    titleKey: "featureRatingsTitle",
    descKey: "featureRatingsDesc",
    icon: Star,
    tile: "bg-[linear-gradient(160deg,#CA8A04_0%,#FACC15_100%)] shadow-[0_10px_18px_-10px_rgba(202,138,4,0.65)]",
  },
];

/** Desktop-only features grid — matches landing section heading language */
export function FeaturesShowcase({ className }) {
  const { t } = useWebLocale();

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
          <DesktopSectionHeading
            badgeKey="featuresBadge"
            titleKey="featuresTitle"
            highlightKey="featuresHighlight"
          />

          <div className="grid grid-cols-4 gap-5 xl:gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.titleKey}
                  className={cn(
                    "rounded-2xl border border-white/80 bg-white/95 p-5 xl:p-6",
                    "shadow-[0_12px_32px_-20px_rgba(15,23,42,0.28)] backdrop-blur-sm",
                    "transition-[transform,box-shadow,border-color] duration-300",
                    "hover:-translate-y-0.5 hover:border-[#D7E4FA] hover:shadow-[0_18px_36px_-22px_rgba(24,101,234,0.28)]",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-[0.55rem] text-white",
                      feature.tile,
                    )}
                  >
                    <Icon className="size-[22px]" strokeWidth={2.2} aria-hidden />
                  </span>

                  <h3 className="mt-4 text-[15px] font-bold tracking-tight text-[#0F1B2D] xl:text-base">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#667085] xl:text-[14px]">
                    {t(feature.descKey)}
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

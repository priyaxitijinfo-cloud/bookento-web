"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

function SidePromoCard({
  href,
  eyebrow,
  title,
  imageSrc,
  toneFrom,
  toneTo,
  imagePosition = "object-center",
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex min-h-[11.75rem] flex-1 overflow-hidden rounded-[1.75rem]",
        "focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:ring-offset-2 focus-visible:outline-none",
      )}
      style={{
        background: `linear-gradient(135deg, ${toneFrom} 0%, ${toneTo} 100%)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 size-40 rounded-full bg-white/35 blur-2xl"
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center py-6 pr-3 pl-6 lg:pl-7">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-[#1A2433]/60 uppercase">
          {eyebrow}
        </p>
        <h3 className="mt-2 max-w-[11rem] text-[1.25rem] leading-[1.15] font-bold tracking-tight text-[#0F1B2D] lg:text-[1.4rem]">
          {title}
        </h3>
        <span
          className="mt-5 inline-flex size-10 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_-10px_rgba(15,27,45,0.45)]"
          aria-hidden
        >
          <ArrowRight className="size-4 text-[#0F1B2D]" strokeWidth={2.5} />
        </span>
      </div>

      <div className="relative my-4 mr-4 w-[46%] shrink-0 self-stretch overflow-hidden rounded-[1.25rem] shadow-[0_14px_28px_-14px_rgba(15,27,45,0.35)] ring-1 ring-white/70 lg:w-[48%]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className={cn("object-cover", imagePosition)}
          sizes="(min-width: 768px) 16vw, 0px"
        />
      </div>
    </Link>
  );
}

/**
 * Desktop-only promo set — soft-fade main banner + two stacked side cards.
 */
export function FeaturePromoBanner({ className }) {
  const { t } = useWebLocale();

  return (
    <section
      aria-label={t("promoSectionAria")}
      className={cn("hidden md:block", className)}
    >
      <div className="mb-7 flex items-end justify-between gap-6">
        <h2 className="max-w-[28rem] text-[2.05rem] leading-[1.12] font-bold tracking-tight text-[#0F1B2D] lg:max-w-none lg:text-[2.4rem]">
          {t("promoSectionTitle")}{" "}
          <span className="text-[#1865EA]">{t("promoSectionHighlight")}</span>
        </h2>
        <p className="mb-1.5 hidden shrink-0 items-center gap-1.5 text-sm font-medium text-[#5B6B82] lg:inline-flex">
          <MapPin className="size-4 text-[#1865EA]" strokeWidth={2.2} aria-hidden />
          {t("promoSectionTagline")}
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-4 lg:gap-5">
        {/* Main — single photo + soft color wash (no stacks / no curve masks) */}
        <Link
          href={categoryListingRoute("salon")}
          className={cn(
            "relative isolate min-h-[23.5rem] overflow-hidden rounded-[1.85rem] bg-[#1865EA]",
            "focus-visible:ring-2 focus-visible:ring-[#1865EA]/45 focus-visible:ring-offset-2 focus-visible:outline-none",
            "lg:min-h-[25rem]",
          )}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/nearby-glow-salon.png"
              alt=""
              fill
              className="object-cover object-[68%_center]"
              sizes="(min-width: 768px) 55vw, 0px"
            />
          </div>

          {/* Soft left wash — fades into the photo, no hard shape */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#1865EA_0%,#1865EA_34%,rgba(24,101,234,0.82)_48%,rgba(24,101,234,0.28)_66%,transparent_82%)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,31,63,0.12)_0%,transparent_40%,rgba(11,31,63,0.2)_100%)]"
          />

          <div className="relative z-10 flex h-full max-w-[48%] flex-col justify-center px-9 py-10 lg:max-w-[46%] lg:px-11">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-white/80 uppercase">
              {t("promoMainEyebrow")}
            </p>
            <h3 className="mt-4 text-[2.2rem] leading-[1.06] font-bold tracking-tight text-white lg:text-[2.55rem]">
              {t("promoMainTitle1")}
              <span className="mt-1.5 block">{t("promoMainTitle2")}</span>
            </h3>
            <p className="mt-4 max-w-[18.5rem] text-[15px] leading-relaxed text-white/85">
              {t("promoMainBody")}
            </p>
            <span
              className={cn(
                "mt-8 inline-flex w-fit items-center gap-2.5 rounded-full bg-[#0B1628] px-5 py-3.5",
                "text-sm font-semibold text-white",
              )}
            >
              {t("promoMainCta")}
              <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
            </span>
          </div>
        </Link>

        <div className="flex min-h-[23.5rem] flex-col gap-4 lg:min-h-[25rem] lg:gap-5">
          <SidePromoCard
            href={categoryListingRoute("homecare")}
            eyebrow={t("promoSide1Eyebrow")}
            title={t("promoSide1Title")}
            imageSrc="/images/nearby-pure-home-care.png"
            toneFrom="#E4F4EC"
            toneTo="#D0EADB"
            imagePosition="object-[center_35%]"
          />
          <SidePromoCard
            href={ROUTES.PROVIDERS}
            eyebrow={t("promoSide2Eyebrow")}
            title={t("promoSide2Title")}
            imageSrc="/images/nearby-serene-spa.png"
            toneFrom="#F3EADF"
            toneTo="#E8D9C6"
            imagePosition="object-[center_30%]"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { useRequireLoginToBook } from "@/hooks/use-require-login-to-book";
import { useWebLocale } from "@/hooks/use-web-locale";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

const EXPLORE_LINKS = [
  { slug: "doctor", labelKey: "footerExploreDoctors" },
  { slug: "salon", labelKey: "footerExploreSalon" },
  { slug: "homecare", labelKey: "footerExploreHomecare" },
  { slug: "fitness", labelKey: "footerExploreFitness" },
  { slug: "tutoring", labelKey: "footerExploreTutoring" },
  { slug: "pet-care", labelKey: "footerExplorePetCare" },
];

const PRO_LINKS = [
  { href: ROUTES.PROVIDER_REGISTER, labelKey: "footerProList" },
  { href: ROUTES.PROVIDER_REGISTER, labelKey: "footerProPricing" },
  { href: ROUTES.HELP, labelKey: "footerProResources" },
  { href: "/#testimonials", labelKey: "footerProStories" },
];

const SOCIAL = [
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "YouTube", href: "#", Icon: Youtube },
  { label: "LinkedIn", href: "#", Icon: Linkedin },
];

const CONTACT_DETAILS = [
  {
    label: "+91 9909515320",
    href: "tel:+919909515320",
    Icon: Phone,
  },
  {
    label: "incodeslab@gmail.com",
    href: "mailto:incodeslab@gmail.com",
    Icon: Mail,
  },
  {
    label: "123 Health Street, New Delhi, India",
    href: null,
    Icon: MapPin,
  },
];

function FooterLink({ href, children, external }) {
  const className = "text-[14px] text-[#6B7A90] transition-colors hover:text-[#1865EA]";

  if (external || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Landing website footer — stacked on mobile, multi-column on desktop */
export function HomeFooter({ className }) {
  const { t } = useWebLocale();
  const { getBookHref } = useRequireLoginToBook();
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative isolate mt-8 overflow-hidden border-t border-[#D7E8FA] md:mt-[70px]",
        "bg-[linear-gradient(165deg,#EEF5FF_0%,#F7FAFF_42%,#F0F6FF_100%)]",
        className,
      )}
    >
      {/* Creative atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 55% 70% at 0% 100%, rgba(24,101,234,0.1), transparent 60%)",
            "radial-gradient(ellipse 45% 55% at 100% 0%, rgba(88,161,255,0.12), transparent 55%)",
            "radial-gradient(ellipse 40% 45% at 70% 100%, rgba(198,244,5,0.06), transparent 65%)",
          ].join(", "),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(24,101,234,0.22) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 25%, #000 75%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[20%] size-64 rounded-full bg-white/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-5%] bottom-[-30%] size-80 rounded-full bg-[#BFD9FF]/25 blur-3xl"
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-40"
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
      >
        <path
          d="M0 48 C240 16, 480 80, 720 48 S1200 8, 1440 48 V0 H0 Z"
          fill="rgba(255,255,255,0.55)"
        />
      </svg>

      <div
        className={cn(HOME_PAGE_CONTAINER, "relative z-10 pt-8 pb-6 md:pt-12 md:pb-8")}
      >
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 md:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_minmax(0,1.2fr)] lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5">
              <Image
                src="/images/app-icon.jpg"
                alt="Bookento"
                width={40}
                height={40}
                className="size-10 rounded-[0.7rem] shadow-sm"
              />
              <span className="text-[1.35rem] font-bold tracking-tight text-[#0F1B2D]">
                Bookento
              </span>
            </Link>

            <p className="mt-4 max-w-[16.5rem] text-[13.5px] leading-[1.65] text-[#6B7A90]">
              {t("footerTagline")}
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full",
                    "text-[#5B6B82] ring-1 ring-[#E8EDF5]",
                    "transition-colors hover:bg-white/80 hover:text-[#1865EA]",
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">
              {t("footerExplore")}
            </p>
            <ul className="mt-5 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.slug}>
                  <FooterLink href={getBookHref(categoryListingRoute(link.slug))}>
                    {t(link.labelKey)}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* For professionals */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">
              {t("footerForPros")}
            </p>
            <ul className="mt-5 space-y-3">
              {PRO_LINKS.map((link) => (
                <li key={link.labelKey}>
                  <FooterLink href={getBookHref(link.href)}>
                    {t(link.labelKey)}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us — same type scale as Explore / For professionals */}
          <div className="md:border-l md:border-dashed md:border-[#D0D5DD] md:pl-8 lg:pl-10">
            <p className="text-[15px] font-semibold text-[#0F1B2D]">
              {t("footerContact")}
            </p>
            <ul className="mt-5 space-y-3">
              {CONTACT_DETAILS.map(({ label, href, Icon }) => {
                const rowClass =
                  "flex items-start gap-2.5 text-[14px] text-[#6B7A90] transition-colors";
                const content = (
                  <>
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-[#5B6B82]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="min-w-0">{label}</span>
                  </>
                );

                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className={cn(rowClass, "hover:text-[#1865EA]")}>
                        {content}
                      </a>
                    ) : (
                      <span className={rowClass}>{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar — copyright */}
        <div className="mt-8 border-t border-[#D7E8FA] pt-4">
          <p className="text-left text-[12.5px] text-[#98A2B3] md:text-right">
            {t("footerCopyright", { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}

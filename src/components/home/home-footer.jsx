"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

const COMPANY_LINKS = [
  { href: ROUTES.HOME, labelKey: "footerAbout" },
  { href: ROUTES.SERVICES, labelKey: "footerServices" },
  { href: ROUTES.PROVIDERS, labelKey: "footerProfessionals" },
  { href: ROUTES.PROVIDER_REGISTER, labelKey: "footerBecomeProvider" },
  { href: ROUTES.HELP, labelKey: "footerHelp" },
];

const CATEGORY_LINKS = [
  { slug: "doctor", labelKey: "catDoctor" },
  { slug: "salon", labelKey: "catSalon" },
  { slug: "fitness", labelKey: "catFitness" },
  { slug: "homecare", labelKey: "catHomecare" },
  { slug: "pet-care", labelKey: "catPetCare" },
];

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: "Phone",
    content: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email",
    content: "support@bookento.com",
    href: "mailto:support@bookento.com",
  },
  {
    icon: MapPin,
    label: "Address",
    content: "Surat, Gujarat, India",
    href: null,
  },
];

/** Desktop-only landing footer — reference layout, Bookento content */
export function HomeFooter({ className }) {
  const { t } = useWebLocale();

  return (
    <footer
      className={cn(
        "mt-6 hidden border-t border-[#E8EDF5] bg-[#F5F8FC] md:mt-[70px] md:block",
        className,
      )}
    >
      <div className={cn(HOME_PAGE_CONTAINER, "pt-14 pb-8")}>
        <div className="grid grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))] gap-10 lg:gap-16">
          {/* Brand */}
          <div className="max-w-[17.5rem]">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-3">
              <Image
                src="/images/app-icon.jpg"
                alt="Bookento"
                width={52}
                height={52}
                className="size-[3.25rem] rounded-[0.8rem] shadow-sm"
              />
              <span className="text-[1.45rem] font-bold tracking-tight text-[#0F1B2D]">
                Bookento
              </span>
            </Link>
            <p className="mt-4 text-[14px] leading-[1.65] text-[#6B7A90]">
              {t("footerTagline")}
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">
              {t("footerCompany")}
            </p>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#6B7A90] transition-colors hover:text-[#1865EA]"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">
              {t("footerCategories")}
            </p>
            <ul className="mt-5 space-y-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={categoryListingRoute(link.slug)}
                    className="text-[14px] text-[#6B7A90] transition-colors hover:text-[#1865EA]"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">
              {t("footerContact")}
            </p>
            <ul className="mt-5 space-y-4">
              {CONTACT_ITEMS.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-[#1865EA]"
                      strokeWidth={2.1}
                      aria-hidden
                    />
                    <span className="text-[14px] leading-snug text-[#6B7A90]">
                      {item.content}
                    </span>
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="inline-flex items-start gap-2.5 transition-colors hover:text-[#1865EA] hover:[&_span]:text-[#1865EA]"
                        aria-label={item.label}
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="inline-flex items-start gap-2.5">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between gap-4 border-t border-[#E8EDF5] pt-6">
          <p className="text-[13px] text-[#8A96A8]">
            {t("footerCopyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-2 text-[13px] text-[#8A96A8]">
            <Link
              href={ROUTES.PRIVACY}
              className="transition-colors hover:text-[#1865EA]"
            >
              {t("footerPrivacy")}
            </Link>
            <span aria-hidden className="text-[#C0C8D4]">
              ·
            </span>
            <Link
              href={ROUTES.TERMS}
              className="transition-colors hover:text-[#1865EA]"
            >
              {t("footerTerms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

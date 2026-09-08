import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import {
  categoryListingRoute,
  ROUTES,
} from "@/constants/routes.constants";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

const COMPANY_LINKS = [
  { href: ROUTES.HOME, label: "About" },
  { href: ROUTES.SERVICES, label: "Services" },
  { href: ROUTES.PROVIDERS, label: "Professionals" },
  { href: ROUTES.PROVIDER_REGISTER, label: "Become a Provider" },
  { href: ROUTES.HELP, label: "Help Center" },
];

const CATEGORY_LINKS = [
  { slug: "doctor", label: "Doctor" },
  { slug: "salon", label: "Salon" },
  { slug: "fitness", label: "Fitness" },
  { slug: "homecare", label: "Homecare" },
  { slug: "pet-care", label: "Pet Care" },
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
  return (
    <footer
      className={cn("mt-6 hidden bg-[#F5F8FC] md:mt-[100px] md:block", className)}
    >
      <div className={cn(HOME_PAGE_CONTAINER, "pt-14 pb-8")}>
        <div className="grid grid-cols-[minmax(0,1.45fr)_repeat(3,minmax(0,1fr))] gap-10 lg:gap-16">
          {/* Brand */}
          <div className="max-w-[17.5rem]">
            <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5">
              <Image
                src="/images/app-icon.jpg"
                alt="Bookento"
                width={40}
                height={40}
                className="size-10 rounded-[0.65rem] shadow-sm"
              />
              <span className="text-[1.2rem] font-bold tracking-tight text-[#0F1B2D]">
                Bookento
              </span>
            </Link>
            <p className="mt-4 text-[14px] leading-[1.65] text-[#6B7A90]">
              Book trusted professionals for salon, spa, home care, fitness, and
              more — all in one place for your everyday needs.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">Company</p>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-[#6B7A90] transition-colors hover:text-[#1865EA]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">Categories</p>
            <ul className="mt-5 space-y-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.slug}>
                  <Link
                    href={categoryListingRoute(link.slug)}
                    className="text-[14px] text-[#6B7A90] transition-colors hover:text-[#1865EA]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[15px] font-semibold text-[#0F1B2D]">Contact Us</p>
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

        <div className="mt-14 flex items-center justify-between gap-4">
          <p className="text-[13px] text-[#8A96A8]">
            Copyright © {new Date().getFullYear()} Bookento. All Rights Reserved
          </p>
          <div className="flex items-center gap-2 text-[13px] text-[#8A96A8]">
            <Link
              href={ROUTES.PRIVACY}
              className="transition-colors hover:text-[#1865EA]"
            >
              Privacy Policy
            </Link>
            <span aria-hidden className="text-[#C0C8D4]">
              ·
            </span>
            <Link
              href={ROUTES.TERMS}
              className="transition-colors hover:text-[#1865EA]"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

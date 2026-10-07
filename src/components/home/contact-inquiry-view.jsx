"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-xl border border-[#E8EDF5] bg-white px-4 text-[15px] text-[#0F1B2D] outline-none placeholder:text-[#98A2B3] focus-visible:ring-2 focus-visible:ring-[#1865EA]/25";

const INQUIRY_TYPES = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership / business" },
  { value: "billing", label: "Billing" },
  { value: "feedback", label: "Feedback" },
];

/**
 * Web contact page — company-side inquiry form from landing footer.
 */
export function ContactInquiryView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter your message");
      return;
    }

    setSubmitting(true);
    toast.success("Inquiry sent. Our team will get back to you shortly.");
    router.push(ROUTES.HOME);
  };

  return (
    <UserPageShell
      title="Contact us"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      showBottomNav={false}
      showDesktopHeader={true}
      showBreadcrumb={true}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page md:!bg-surface-page"
      mainClassName="mx-auto max-w-lg px-4 pb-16 pt-2 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]"
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] md:items-start md:gap-10 lg:gap-14">
        <aside className="hidden space-y-6 md:block">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.16em] text-[#1865EA] uppercase">
              Company
            </p>
            <h1 className="mt-2 text-[1.85rem] leading-tight font-bold tracking-tight text-[#0F1B2D]">
              Send us an inquiry
            </h1>
            <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-[#6B7A90]">
              Questions about Bookento, partnerships, or support — share the details and
              our team will respond by email.
            </p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-[#E8EDF5]">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#1865EA]">
                <Mail className="size-4" strokeWidth={2.1} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#0F1B2D]">Email</p>
                <p className="mt-0.5 text-[13.5px] text-[#6B7A90]">
                  incodeslab@gmail.com
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-[#E8EDF5]">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#1865EA]">
                <Phone className="size-4" strokeWidth={2.1} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#0F1B2D]">Phone</p>
                <p className="mt-0.5 text-[13.5px] text-[#6B7A90]">+91 9909515320</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-[#E8EDF5]">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#1865EA]">
                <MapPin className="size-4" strokeWidth={2.1} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#0F1B2D]">Office</p>
                <p className="mt-0.5 text-[13.5px] text-[#6B7A90]">
                  123 Health Street, New Delhi, India
                </p>
              </div>
            </li>
          </ul>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.35rem] bg-white p-5 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.12)] ring-1 ring-[#E8EDF5] sm:p-6 md:p-8"
        >
          <p className="text-[15px] font-semibold text-[#0F1B2D] md:hidden">
            Contact Bookento
          </p>
          <p className="mt-1 text-[13px] text-[#6B7A90] md:mt-0 md:text-[14px]">
            Fill in your details and we’ll reply soon.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-[13px] font-semibold text-[#314158]">
                Full name
              </span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className={cn(FIELD, "h-12")}
                autoComplete="name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-[#314158]">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className={cn(FIELD, "h-12")}
                autoComplete="email"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-[#314158]">
                Phone <span className="font-normal text-[#98A2B3]">(optional)</span>
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 …"
                className={cn(FIELD, "h-12")}
                autoComplete="tel"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-[13px] font-semibold text-[#314158]">
                Inquiry type
              </span>
              <select
                value={inquiryType}
                onChange={(event) => setInquiryType(event.target.value)}
                className={cn(FIELD, "h-12 appearance-none bg-[length:1rem] pr-10")}
              >
                {INQUIRY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-[13px] font-semibold text-[#314158]">Message</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us how we can help…"
                rows={5}
                className={cn(FIELD, "resize-none py-3.5")}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "gradient-brand mt-6 flex h-12 w-full items-center justify-center rounded-xl",
              "text-[15px] font-semibold text-white transition-opacity hover:opacity-95",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {submitting ? "Sending…" : "Send inquiry"}
          </button>
        </form>
      </div>
    </UserPageShell>
  );
}

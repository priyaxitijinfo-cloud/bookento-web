"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { resolveBackNavigation } from "@/lib/navigation/back-navigation";
import { cn } from "@/lib/utils";

const FIELD_SHADOW = "shadow-[0_2px_12px_rgba(15,23,42,0.05)]";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function HelpAttachIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <g clipPath="url(#help_link_clip)">
        <path
          d="M22.6815 6.95971C22.5437 5.30843 21.7509 3.86926 20.579 2.87704C19.4071 1.88482 17.8565 1.33989 16.2055 1.47667C14.5542 1.61374 13.1151 2.40724 12.1228 3.57914L9.02121 7.24246L10.8529 8.79328L13.9545 5.12996C14.5758 4.39619 15.4458 3.94795 16.4041 3.86805C17.3624 3.78882 18.2944 4.08743 19.0282 4.7087C19.762 5.32996 20.2102 6.20004 20.2895 7.15832C20.369 8.11691 20.0707 9.04863 19.4495 9.78241L16.3478 13.4457L18.1795 14.9965L21.2811 11.3332C22.2733 10.1613 22.8183 8.61071 22.6815 6.95971ZM11.6954 18.9407C11.0738 19.6748 10.2041 20.1227 9.24547 20.2023C8.28754 20.2818 7.35546 19.9832 6.62168 19.362C5.88755 18.7404 5.43967 17.8706 5.36008 16.912C5.28054 15.9541 5.57885 15.0224 6.20042 14.2883L9.30205 10.6249L7.47039 9.07412L4.36876 12.7374C3.37654 13.9093 2.83125 15.4596 2.96839 17.1109C3.10577 18.7619 3.89896 20.2014 5.07087 21.1936C6.24277 22.1858 7.79299 22.7304 9.44438 22.594C11.095 22.457 12.5348 21.6634 13.5271 20.4915L16.6287 16.8282L14.797 15.2774L11.6954 18.9407Z"
          fill="url(#help_link_paint0)"
        />
        <path
          d="M15.7862 6.68164L17.6178 8.23246L9.86374 17.3907L8.03209 15.8399L15.7862 6.68164Z"
          fill="url(#help_link_paint1)"
        />
      </g>
      <defs>
        <linearGradient
          id="help_link_paint0"
          x1="15.9999"
          y1="-1"
          x2="24.4499"
          y2="18.7332"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="help_link_paint1"
          x1="15.7862"
          y1="6.68164"
          x2="18.7121"
          y2="10.3685"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#58A1FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <clipPath id="help_link_clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function HelpView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const backHref = useMemo(
    () => resolveBackNavigation(searchParams.get("from"), "profile").href,
    [searchParams],
  );

  useEffect(() => {
    return () => {
      if (attachment?.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(attachment.preview);
      }
    };
  }, [attachment]);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image or screenshot");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    try {
      const preview = await readFileAsDataUrl(file);
      setAttachment({
        file,
        name: file.name,
        preview,
      });
    } catch {
      toast.error("Could not attach image");
    }
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please enter your complaint or suggestion");
      return;
    }

    if (!contact.trim()) {
      toast.error("Please enter your mobile number or email");
      return;
    }

    setSubmitting(true);
    toast.success("Submitted. We'll get back to you shortly.");
    router.push(backHref);
  };

  return (
    <UserPageShell
      title="Help"
      backHref={backHref}
      backLabel="Back to Profile"
      showBottomNav={false}
      showDesktopHeader={true}
      showBreadcrumb={true}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page md:!bg-surface-page max-md:!pb-0"
      headerClassName="max-md:border-transparent"
      mainClassName="mx-auto max-w-lg px-4 pb-28 pt-2 max-md:!pt-4 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]"
    >
      <div className="space-y-7">
        <label className="flex flex-col gap-2.5 md:gap-[14px]">
          <span className="text-[16px] leading-none font-semibold text-[#111827]">
            Complaint or Suggestion
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Typing Somethings..."
            className={cn(
              "h-[225px] w-full resize-none rounded-[16px] border border-[#F0F0F0] bg-white px-4 py-4 text-[15px] leading-relaxed text-[#111827] outline-none",
              "focus-visible:ring-primary/20 placeholder:text-[#B0B0B0] focus-visible:ring-2",
              FIELD_SHADOW,
            )}
          />
        </label>

        <label className="flex flex-col gap-2.5 md:gap-[14px]">
          <span className="text-[16px] leading-none font-semibold text-[#111827]">
            Contact
          </span>
          <input
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Enter Your Mobile Number Or Email"
            className={cn(
              "h-16 w-full rounded-[14px] border border-[#F0F0F0] bg-white px-4 text-[15px] text-[#111827] outline-none",
              "focus-visible:ring-primary/20 placeholder:text-[#B0B0B0] focus-visible:ring-2",
              FIELD_SHADOW,
            )}
          />
        </label>

        <div className="flex flex-col gap-2.5 md:gap-[14px]">
          <span className="text-[16px] leading-none font-semibold text-[#111827]">
            Attach Your Image or Screenshot
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-11 items-center rounded-full border border-dashed border-[#3B82F6] bg-[#F4F8FF] pr-5 pl-3.5"
            >
              <HelpAttachIcon className="size-5 text-[#3B82F6]" />
              <span className="mx-3 h-5 w-px bg-[#D5DCE6]" aria-hidden />
              <span className="text-[15px] font-medium text-[#111827]">Browse</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />

            {attachment ? (
              <div className="flex min-w-0 items-center gap-2.5 rounded-full bg-white py-1.5 pr-3 pl-1.5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
                <img
                  src={attachment.preview}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
                <span className="max-w-[140px] truncate text-[13px] font-medium text-[#334155] md:max-w-[220px]">
                  {attachment.name}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-[13px] font-medium text-[#6B7280]"
                  aria-label="Remove attachment"
                >
                  Remove
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:border-t md:border-[#E6EAF2] md:px-6 md:py-4 md:pb-4">
        <div className="mx-auto w-full max-w-lg md:max-w-[calc(96rem-60px)]">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-[51px] w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#58A1FF] to-[#1E57EA] text-[16px] font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 md:h-[3.25rem] md:rounded-xl md:text-base"
          >
            Submit
          </button>
        </div>
      </div>
    </UserPageShell>
  );
}

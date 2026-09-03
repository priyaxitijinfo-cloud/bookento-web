"use client";

import { cn } from "@/lib/utils";

export function PrimaryButton({
  children,
  className,
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "gradient-brand text-white shadow-[0_4px_14px_rgba(24,101,234,0.3)] hover:opacity-95",
    secondary: "bg-[#F3F4F6] text-[#1A1A2E] hover:bg-[#E5E7EB]",
    outline:
      "border border-[#D1D5DB] bg-white text-[#1A1A2E] hover:border-primary hover:text-primary",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
    ghost: "bg-transparent text-[#6B7280] hover:bg-[#F7F8FC] hover:text-[#1A1A2E]",
  };

  return (
    <button
      type={type}
      className={cn(
        "focus-visible:ring-primary/40 inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:font-semibold",
        variants[variant] || variants.primary,
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

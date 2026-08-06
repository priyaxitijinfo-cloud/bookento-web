"use client";

import { cn } from "@/lib/utils";

export function ResponsiveCard({
  children,
  className,
  padding = true,
  hover = false,
  as: Comp = "div",
  ...props
}) {
  return (
    <Comp
      className={cn(
        "rounded-[0.875rem] border border-[#ECECF2] bg-white shadow-[0_1px_3px_0_rgb(0_0_0_/_0.04)]",
        padding && "p-4",
        hover &&
          "transition-shadow duration-200 hover:shadow-[0_4px_16px_0_rgb(0_0_0_/_0.06)]",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

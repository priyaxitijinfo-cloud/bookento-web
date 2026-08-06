import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function SectionHeader({ title, href, className }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-4 md:mb-4", className)}>
      <h2 className="text-foreground flex items-center gap-2 text-base font-bold tracking-tight md:text-xl">
        <span className="section-title-bar" aria-hidden />
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-primary hover:text-primary/80 flex shrink-0 items-center gap-0.5 text-xs font-semibold transition-colors md:gap-1 md:text-sm"
        >
          See all
          <ArrowRight className="size-3.5 md:size-4" />
        </Link>
      )}
    </div>
  );
}

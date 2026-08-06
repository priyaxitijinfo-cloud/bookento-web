import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Standard section header with optional "See all" link.
 */
export function SectionHeader({ title, href, action, className, linkLabel = "See all" }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-4 md:mb-4", className)}>
      <h2 className="section-title">
        <span className="section-title-bar" aria-hidden />
        {title}
      </h2>
      {action ??
        (href ? (
          <Link
            href={href}
            className="text-primary hover:text-primary/80 flex shrink-0 items-center gap-1 text-xs font-semibold transition-colors md:text-sm"
          >
            {linkLabel}
            <ArrowRight className="icon-sm" />
          </Link>
        ) : null)}
    </div>
  );
}

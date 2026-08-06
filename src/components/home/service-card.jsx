import Link from "next/link";
import { Star } from "lucide-react";

import { formatDuration } from "@/constants/popular-services";
import { categoryListingRoute, providerDetailRoute } from "@/constants/routes.constants";
import { formatCurrency } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

const IMAGE_FOCUS = [
  "object-center",
  "object-center",
  "object-[center_25%]",
  "object-[center_20%]",
];

export function ServiceCard({ service, index = 0 }) {
  const title = service.title ?? service.name;
  const duration = formatDuration(service.duration);
  const imageFocus = IMAGE_FOCUS[index] ?? "object-center";
  const href = service.categorySlug
    ? categoryListingRoute(service.categorySlug)
    : providerDetailRoute(service.providerId);

  return (
    <Link href={href} className="group block h-full">
      <article className="border-border/60 flex h-full flex-col rounded-xl border bg-background p-3 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-3.5">
        <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-xl">
          <img
            src={service.image}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]",
              imageFocus,
            )}
            loading="lazy"
            decoding="async"
          />
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-background/95 px-2 py-1 text-xs font-semibold text-foreground shadow-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {service.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-col pt-3">
          <h3 className="text-foreground line-clamp-1 text-sm font-bold">{title}</h3>

          <div className="border-border/50 mt-3 flex items-center justify-between gap-2 border-t pt-3">
            <p className="text-foreground text-base font-bold leading-none">
              {formatCurrency(service.price)}
            </p>
            {duration && (
              <span className="text-muted-foreground shrink-0 text-xs">{duration}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

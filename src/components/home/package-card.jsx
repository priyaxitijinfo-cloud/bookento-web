import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { providerDetailRoute } from "@/constants/routes.constants";
import { formatCurrency } from "@/utils/format.utils";

export function PackageCard({ pkg }) {
  return (
    <Link href={providerDetailRoute(pkg.providerId)} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden border-border/70 p-0 transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={pkg.image}
            alt={pkg.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
          <Badge className="absolute right-3 top-3 border-0 bg-background/95 text-foreground shadow-sm backdrop-blur-sm">
            {pkg.discountPercent}% off
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-foreground line-clamp-1 font-semibold">{pkg.name}</h3>
          <p className="text-muted-foreground mt-1 line-clamp-2 flex-1 text-sm">{pkg.description}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-primary text-lg font-bold">{formatCurrency(pkg.price)}</span>
            <span className="text-muted-foreground text-sm line-through">{formatCurrency(pkg.originalPrice)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

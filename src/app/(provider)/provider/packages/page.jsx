"use client";

import Image from "next/image";
import { Package } from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { packages } from "@/mock/packages";
import { formatCurrency } from "@/utils/format.utils";

export default function ProviderPackagesPage() {
  const providerPackages = packages.slice(0, 12);

  return (
    <>
      <ProviderHeader title="Packages" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">{providerPackages.length} packages available</p>
          <Button>Create Package</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providerPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <div className="relative h-44">
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                {pkg.isFeatured && (
                  <Badge className="absolute top-3 left-3" variant="success">Featured</Badge>
                )}
                <Badge className="absolute top-3 right-3" variant="destructive">
                  {pkg.discountPercent}% OFF
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-base">{pkg.name}</CardTitle>
                <p className="text-muted-foreground line-clamp-2 text-sm">{pkg.description}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{formatCurrency(pkg.price)}</span>
                  <span className="text-muted-foreground text-sm line-through">
                    {formatCurrency(pkg.originalPrice)}
                  </span>
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Package className="size-3.5" />
                    {pkg.serviceIds.length} services
                  </span>
                  <span>Valid {pkg.validityDays} days</span>
                  <span>{pkg.totalBookings} bookings</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                <Button size="sm" className="flex-1">Manage</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

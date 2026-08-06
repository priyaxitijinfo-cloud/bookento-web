"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categories } from "@/mock/categories";

export default function ProviderCategoriesPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      categories.filter(
        (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <>
      <ProviderHeader title="Categories" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>Manage Categories</Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((cat) => (
            <Card key={cat.id} className="overflow-hidden transition-shadow hover:shadow-card-hover">
              <div className="relative h-32">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                {cat.isFeatured && (
                  <Badge className="absolute top-2 right-2" variant="success">Featured</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{cat.description}</p>
                <div className="text-muted-foreground mt-3 flex justify-between text-xs">
                  <span>{cat.serviceCount} services</span>
                  <span>{cat.providerCount} providers</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

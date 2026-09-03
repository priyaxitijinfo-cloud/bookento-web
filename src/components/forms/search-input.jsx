"use client";

import { ResponsiveSearchIcon } from "@/components/icons/search-icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchInput({ className, ...props }) {
  return (
    <div className="relative">
      <ResponsiveSearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input className={cn("pl-10", className)} {...props} />
    </div>
  );
}

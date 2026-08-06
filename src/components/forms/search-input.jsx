"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchInput({ className, ...props }) {
  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
      <Input className={cn("pl-10", className)} {...props} />
    </div>
  );
}

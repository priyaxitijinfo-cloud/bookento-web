import * as AvatarPrimitive from "@radix-ui/react-avatar";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/format.utils";

export function Avatar({ className, src, alt, name, size = "md", ...props }) {
  const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base", xl: "size-20 text-xl" };
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizes[size], className)}
      {...props}
    >
      {src && (
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          fill
          className="object-cover"
          sizes="80px"
          unoptimized={typeof src === "string" && src.startsWith("data:")}
        />
      )}
      <AvatarPrimitive.Fallback className="bg-primary/10 text-primary flex size-full items-center justify-center font-medium">
        {name ? getInitials(name) : "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

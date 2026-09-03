import { cn } from "@/lib/utils";

/** App-style radio matching Language / mobile designs (works on all breakpoints) */
function AppRadioDot({ selected }) {
  if (selected) {
    return (
      <span className="gradient-brand flex size-5 items-center justify-center rounded-full p-[2px]">
        <span className="flex size-full items-center justify-center rounded-full bg-white">
          <span className="gradient-brand size-2.5 rounded-full" />
        </span>
      </span>
    );
  }

  return <span className="size-5 rounded-full border-2 border-[#CBD5E1] bg-white" />;
}

export function RadioIndicator({ selected, className, variant = "responsive" }) {
  if (variant === "app") {
    return (
      <span
        className={cn("relative inline-flex size-5 shrink-0", className)}
        aria-hidden
      >
        <AppRadioDot selected={selected} />
      </span>
    );
  }

  return (
    <span className={cn("relative inline-flex size-5 shrink-0", className)} aria-hidden>
      {selected ? (
        <span className="gradient-brand flex size-5 items-center justify-center rounded-full p-[2px] md:hidden">
          <span className="flex size-full items-center justify-center rounded-full bg-white">
            <span className="gradient-brand size-2.5 rounded-full" />
          </span>
        </span>
      ) : (
        <span className="size-5 rounded-full border-2 border-[#CBD5E1] bg-white md:hidden" />
      )}
      <span
        className={cn(
          "hidden size-5 items-center justify-center rounded-full border-2 md:flex",
          selected ? "border-primary bg-primary" : "border-border bg-background",
        )}
      >
        {selected ? <span className="bg-background size-2 rounded-full" /> : null}
      </span>
    </span>
  );
}

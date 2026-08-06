import { cn } from "@/lib/utils";

export function Input({ className, type, error, ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-11 w-full rounded-lg border px-4 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, error, ...props }) {
  return (
    <textarea
      className={cn(
        "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex min-h-[100px] w-full rounded-lg border px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus-visible:ring-destructive",
        className,
      )}
      {...props}
    />
  );
}

import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border-border text-foreground border",
  success: "bg-success/10 text-success border-success/20 border",
  warning: "bg-warning/10 text-warning-foreground border-warning/20 border",
  destructive: "bg-destructive/10 text-destructive border-destructive/20 border",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

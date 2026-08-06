import { cn } from "@/lib/utils";

export function Label({ className, required, children, ...props }) {
  return (
    <label
      className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return <p className="text-destructive mt-1.5 text-xs">{message}</p>;
}

export function FormSuccess({ message }) {
  if (!message) return null;
  return <p className="text-success mt-1.5 text-xs">{message}</p>;
}

export function FormField({ label, error, success, required, children, className }) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label required={required}>{label}</Label>}
      {children}
      <FormError message={error} />
      <FormSuccess message={success} />
    </div>
  );
}

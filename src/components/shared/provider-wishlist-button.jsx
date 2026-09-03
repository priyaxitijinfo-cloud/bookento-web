import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";
import { cn } from "@/lib/utils";

export function ProviderWishlistButton({ isSaved, onToggle, className }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle?.();
      }}
      className={cn(
        "bg-muted hover:bg-muted flex size-9 items-center justify-center rounded-full shadow-sm transition-colors",
        className,
      )}
      aria-label={isSaved ? "Remove from saved" : "Save provider"}
      aria-pressed={isSaved}
    >
      <HeroHeartIcon
        tone="dark"
        filled={isSaved}
        className="size-[18px] text-[#4D5972]"
      />
    </button>
  );
}

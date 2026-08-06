import { cn } from "@/lib/utils";

export const WISHLIST_ICONS = {
  active: "/icons/06.svg",
  inactive: "/icons/01.svg",
};

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
        "flex size-9 items-center justify-center rounded-full bg-muted shadow-sm transition-colors hover:bg-muted",
        className,
      )}
      aria-label={isSaved ? "Remove from saved" : "Save provider"}
      aria-pressed={isSaved}
    >
      <img
        src={isSaved ? WISHLIST_ICONS.active : WISHLIST_ICONS.inactive}
        alt=""
        draggable={false}
        className="size-[18px] object-contain"
        aria-hidden
      />
    </button>
  );
}

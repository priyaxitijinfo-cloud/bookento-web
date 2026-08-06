"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function CategorySearchIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.20297 16.0741C4.14759 14.9965 3.43176 13.6328 3.14429 12.152C2.85444 10.6671 3.00329 9.13002 3.57263 7.72835C4.13711 6.33455 5.10082 5.13862 6.34275 4.29072C8.86254 2.56976 12.1797 2.56976 14.6994 4.29072C15.9415 5.13862 16.9052 6.33455 17.4696 7.72835C18.039 9.13002 18.1878 10.6671 17.8979 12.152C17.6105 13.6328 16.8947 14.9965 15.8392 16.0741C14.4416 17.5084 12.5239 18.3173 10.5211 18.3173C8.51841 18.3173 6.60066 17.5084 5.20297 16.0741Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5295 5.68803C10.0269 5.74129 9.66263 6.19195 9.71584 6.69461C9.76917 7.19727 10.2198 7.56157 10.7225 7.50832L10.5295 5.68803ZM12.7888 8.72566C12.9859 9.19117 13.523 9.40876 13.9885 9.21168C14.454 9.01462 14.6716 8.47753 14.4745 8.01205L12.7888 8.72566ZM16.5968 15.309C16.2392 14.9519 15.6596 14.9524 15.3026 15.3102C14.9454 15.6679 14.946 16.2474 15.3037 16.6045L16.5968 15.309ZM19.4381 20.7316C19.7959 21.0888 20.3753 21.0883 20.7325 20.7305C21.0896 20.3727 21.0891 19.7933 20.7313 19.4361L19.4381 20.7316ZM10.7225 7.50832C11.6042 7.41489 12.4433 7.90918 12.7888 8.72566L14.4745 8.01205C13.8146 6.45333 12.2129 5.50967 10.5295 5.68803L10.7225 7.50832ZM15.3037 16.6045L19.4381 20.7316L20.7313 19.4361L16.5968 15.309L15.3037 16.6045Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CategoryFilterIcon({ className }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M7.42871 15.7144C7.9019 15.7144 8.28591 16.0977 8.28613 16.5708V22.2856C8.28605 22.7589 7.90199 23.143 7.42871 23.1431C6.95537 23.1431 6.57137 22.759 6.57129 22.2856V16.5708C6.57151 16.0976 6.95546 15.7144 7.42871 15.7144ZM16.5713 10.8569C18.4648 10.8569 20 12.3921 20 14.2856V16.5708C20 18.1684 18.9074 19.5115 17.4287 19.8921V22.2856C17.4286 22.759 17.0446 23.1431 16.5713 23.1431C16.098 23.143 15.7139 22.7589 15.7139 22.2856V19.8921C14.2353 19.5114 13.1426 18.1683 13.1426 16.5708V14.2856C13.1426 12.3921 14.6778 10.857 16.5713 10.8569ZM7.42871 0.856934C7.90203 0.857009 8.28613 1.24102 8.28613 1.71436V4.10791C9.76464 4.48865 10.8574 5.83086 10.8574 7.42822V9.71436C10.8573 11.6077 9.3221 13.143 7.42871 13.1431C5.53526 13.1431 4.00015 11.6078 4 9.71436V7.42822C4.00006 5.83076 5.09265 4.48856 6.57129 4.10791V1.71436C6.57129 1.24097 6.95532 0.856934 7.42871 0.856934ZM16.5713 0.856934C17.0447 0.856934 17.4287 1.24097 17.4287 1.71436V7.42822C17.4287 7.90161 17.0447 8.28564 16.5713 8.28564C16.098 8.28557 15.7139 7.90156 15.7139 7.42822V1.71436C15.7139 1.24101 16.098 0.857009 16.5713 0.856934Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CategoryListingHeader({
  title,
  onFilterClick,
  backHref = ROUTES.HOME,
  showFilterActive = false,
  searchOpen = false,
  onSearchOpenChange,
  searchQuery = "",
  onSearchQueryChange,
  searchPlaceholder = "Search...",
  className,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onSearchOpenChange?.(false);
        onSearchQueryChange?.("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, onSearchOpenChange, onSearchQueryChange]);

  const handleCloseSearch = () => {
    onSearchOpenChange?.(false);
    onSearchQueryChange?.("");
  };

  return (
    <header className={cn("border-border bg-card safe-top sticky top-0 z-30 border-b", className)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href={backHref}
            className="text-foreground hover:text-primary flex size-9 shrink-0 items-center justify-center rounded-full transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft className="size-5" />
          </Link>

          {searchOpen ? (
            <div className="relative min-w-0 flex-1">
              <CategorySearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "border-border/80 bg-[#FAFBFD] text-foreground placeholder:text-muted-foreground",
                  "h-10 w-full rounded-lg border px-10 text-sm",
                  "focus-visible:ring-primary/30 focus-visible:bg-background focus-visible:ring-2 focus-visible:outline-none",
                )}
              />
            </div>
          ) : (
            <h1 className="text-foreground truncate text-lg font-bold">{title}</h1>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {searchOpen ? (
            <button
              type="button"
              onClick={handleCloseSearch}
              className="text-foreground hover:text-primary flex size-9 items-center justify-center rounded-full transition-colors"
              aria-label="Close search"
            >
              <X className="size-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSearchOpenChange?.(true)}
              className="text-foreground hover:text-primary flex size-9 items-center justify-center rounded-full transition-colors"
              aria-label="Search"
            >
              <CategorySearchIcon className="size-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onFilterClick}
            className="text-foreground hover:text-primary relative flex size-9 items-center justify-center rounded-full transition-colors"
            aria-label="Filter"
          >
            <CategoryFilterIcon className="size-5" />
            {showFilterActive ? (
              <span className="bg-primary absolute top-1.5 right-1.5 size-2 rounded-full" aria-hidden />
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}

import { cn } from "@/lib/utils";

export const PROFILE_TAB_PANEL_META = {
  packages: {
    title: "Packages",
    description: "Explore bundled wellness packages and save on multiple sessions.",
  },
  about: {
    title: "About",
    description: "Professional background, experience, and care approach.",
  },
  gallery: {
    title: "Gallery",
    description: "Photos from the clinic, studio, and recent work.",
  },
  videos: {
    title: "Video",
    description: "Short videos and highlights from this provider.",
  },
};

export function TabPanelHeader({ title, description, action }) {
  return (
    <div className="border-border/50 mb-6 flex items-start justify-between gap-4 border-b pb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-4 w-1 rounded-full" aria-hidden />
          <h2 className="text-foreground text-lg font-bold tracking-tight">{title}</h2>
        </div>
        {description && (
          <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionHeading({ title, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="bg-primary h-4 w-1 rounded-full" aria-hidden />
        <h2 className="text-foreground text-base font-semibold md:text-lg md:font-bold">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function PillTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
            activeTab === tab.id
              ? "border-primary gradient-brand text-white shadow-[0_4px_14px_rgba(24,101,234,0.25)]"
              : "border-border bg-background text-foreground hover:border-primary/30",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function ProfileTabs({ tabs, activeTab, onChange, variant = "default" }) {
  const isSheet = variant === "sheet";

  return (
    <div className={cn("bg-background", !isSheet && "rounded-t-xl")}>
      <div
        className={cn(
          "scrollbar-hide overflow-x-auto",
          isSheet ? "px-4 py-5" : "px-4 py-3 md:px-6 md:py-4",
        )}
      >
        <div
          className="flex w-max min-w-full gap-2 md:w-full md:gap-2.5"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "inline-flex h-10 shrink-0 appearance-none items-center justify-center rounded-lg border px-3.5 text-sm outline-none md:h-[42px] md:flex-1 md:px-3",
                  "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out select-none",
                  "focus-visible:ring-primary/25 focus-visible:ring-2 active:scale-[0.97]",
                  isActive
                    ? cn(
                        "profile-tab-active border-transparent font-semibold text-white",
                        isSheet
                          ? "shadow-none hover:shadow-none"
                          : "shadow-[0_4px_14px_rgba(24,101,234,0.35)] hover:shadow-[0_6px_18px_rgba(24,101,234,0.4)]",
                      )
                    : isSheet
                      ? "hover:text-foreground active:text-foreground border-[#E6E8EF] bg-transparent font-medium text-[#5B6B8C] hover:border-[#D8DBE5]"
                      : "hover:text-foreground active:text-foreground border-[#E6E8EF] bg-transparent font-semibold text-[#5B6B8C] hover:border-[#D8DBE5] hover:bg-[#F4F4F8] active:bg-[#ECEEF4]",
                )}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {!isSheet ? <div className="border-border border-b" aria-hidden="true" /> : null}
    </div>
  );
}

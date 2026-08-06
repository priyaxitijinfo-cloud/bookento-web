import { cn } from "@/lib/utils";

export function TabPanelHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 border-b border-border/50 pb-5">
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-relaxed">{description}</p>
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
        <h2 className="text-foreground text-base font-bold md:text-lg">{title}</h2>
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

export function ProfileTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="rounded-t-xl bg-[#F8F9FC]/90">
      <div className="scrollbar-hide overflow-x-auto px-4 py-3 md:px-6 md:py-4">
        <div
          className="flex w-max min-w-full gap-2 md:w-full md:gap-2.5"
          role="tablist"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "inline-flex h-10 shrink-0 appearance-none items-center justify-center gap-1.5 rounded-lg border-0 px-3.5 text-sm font-semibold outline-none md:h-[42px] md:flex-1 md:gap-2 md:px-3",
                  "select-none transition-[transform,box-shadow] duration-200 ease-out",
                  "focus-visible:ring-2 focus-visible:ring-primary/25 active:scale-[0.97]",
                  isActive
                    ? "profile-tab-active text-white shadow-[0_4px_14px_rgba(24,101,234,0.35)] hover:shadow-[0_6px_18px_rgba(24,101,234,0.4)]"
                    : "bg-transparent text-muted-foreground hover:bg-background hover:text-foreground hover:shadow-sm active:bg-background active:text-foreground active:shadow-sm",
                )}
              >
                {Icon ? <Icon className="size-4 shrink-0" strokeWidth={2} /> : null}
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="border-border border-b" aria-hidden="true" />
    </div>
  );
}

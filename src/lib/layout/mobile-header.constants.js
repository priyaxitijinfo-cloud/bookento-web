/** Shared mobile header shell — white bar, safe-area, subtle separator (mobile styling). */
export const MOBILE_HEADER_CLASS =
  "user-header-mobile safe-top sticky top-0 z-30 border-b border-[#F0F0F0] bg-white";

/** Preserve existing desktop header appearance when the same node is visible on md+. */
export const MOBILE_HEADER_DESKTOP_CLASS = "md:border-border md:bg-card";

/** Inner row — matches reference spacing and height. */
export const MOBILE_HEADER_INNER_CLASS =
  "mx-auto flex h-14 w-full max-w-lg items-center gap-2 px-4 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]";

/** Shared horizontal inset — align page sections with the mobile header title. */
export const MOBILE_PAGE_INSET_CLASS =
  "mx-auto w-full max-w-lg px-4 md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem]";

/** Same left inset as header; right inset matches header action buttons (`-mr-1`). */
export const MOBILE_PAGE_INSET_ALIGN_ACTION_CLASS =
  "mx-auto w-full max-w-lg pl-4 pr-3 -mr-1 md:mx-auto md:max-w-[calc(96rem-60px)] md:px-[4.875rem] xl:px-[5.875rem] md:mr-auto";

/** 8px gap between back arrow and title on mobile headers. */
export const MOBILE_HEADER_BACK_TITLE_GAP = "gap-2";

export const MOBILE_HEADER_BACK_TITLE_GROUP_CLASS = `flex min-w-0 flex-1 items-center ${MOBILE_HEADER_BACK_TITLE_GAP}`;

export const MOBILE_HEADER_BACK_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[#F3F4F6]";

export const MOBILE_HEADER_TITLE_CLASS =
  "min-w-0 truncate text-base font-semibold text-foreground";

export const MOBILE_HEADER_TITLE_CENTERED_CLASS =
  "min-w-0 flex-1 truncate text-center text-base font-semibold text-foreground md:text-left";

/** Mobile-only wrapper — hides the entire header on desktop. */
export const MOBILE_HEADER_ONLY_CLASS = "md:hidden";

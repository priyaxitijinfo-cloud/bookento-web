import { cn } from "@/lib/utils";

const MOBILE_SCROLL_TRACK =
  "-mr-4 overflow-x-auto overscroll-x-contain scroll-smooth scrollbar-hide snap-x snap-mandatory touch-pan-x";

export function MobileScrollRow({ children, className, innerClassName, containerRef }) {
  return (
    <div ref={containerRef} className={cn(MOBILE_SCROLL_TRACK, className)}>
      <div className={cn("flex gap-3", innerClassName)}>
        {children}
        <div className="w-4 shrink-0 snap-none" aria-hidden="true" />
      </div>
    </div>
  );
}

export function HorizontalScroll({ children, className }) {
  return (
    <div className="relative -mx-4 w-[calc(100%+2rem)] max-w-[100vw] md:mx-0 md:w-auto md:max-w-none">
      <div
        className={cn(
          "scrollbar-hide flex gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 touch-pan-x md:gap-4 md:px-0",
          "snap-x snap-mandatory md:snap-none",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

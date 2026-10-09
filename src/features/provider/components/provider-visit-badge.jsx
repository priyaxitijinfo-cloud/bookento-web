import { cn } from "@/lib/utils";

export const VISIT_TYPE_META = {
  onsite: {
    label: "In-Person",
    className: "bg-[#E8F1FF] text-[#1865EA]",
    dotClassName: "bg-[#8B5CF6]",
  },
  online: {
    label: "Video Call",
    className: "bg-[#E6F7ED] text-[#1B9E5A]",
    dotClassName: "bg-[#22C55E]",
  },
  home: {
    label: "At-Home",
    className: "bg-[#FFF0E6] text-[#E67E22]",
    dotClassName: "bg-[#F97316]",
  },
};

const DOT_COLORS = ["bg-[#8B5CF6]", "bg-[#22C55E]", "bg-[#F97316]", "bg-[#3B82F6]"];

export function getVisitTypeMeta(visitType) {
  return VISIT_TYPE_META[visitType] || VISIT_TYPE_META.onsite;
}

export function getScheduleDotClass(visitType, index = 0) {
  const meta = VISIT_TYPE_META[visitType];
  if (meta) return meta.dotClassName;
  return DOT_COLORS[index % DOT_COLORS.length];
}

export function ProviderVisitBadge({ visitType, className }) {
  const meta = getVisitTypeMeta(visitType);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        meta.className,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}

import { cn } from "@/lib/utils";

function ReviewIconImage({ src, alt, className }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("size-4 shrink-0 object-contain", className)}
      draggable={false}
      aria-hidden={alt === ""}
    />
  );
}

export function ReviewMsgIcon({ className }) {
  return <ReviewIconImage src="/icons/msg.svg" alt="" className={className} />;
}

export function ReviewLikeIcon({ className }) {
  return <ReviewIconImage src="/icons/like.svg" alt="" className={className} />;
}

export function ReviewDislikeIcon({ className }) {
  return <ReviewIconImage src="/icons/dislike.svg" alt="" className={className} />;
}

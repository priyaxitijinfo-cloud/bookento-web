"use client";

import { format, isValid, parseISO } from "date-fns";

import { formatRelativeTime } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

function formatMessageTime(date) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "";
  return format(parsed, "HH:mm");
}

function RightIcon({ className, label }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-3.5", className)}
      aria-label={label}
      role="img"
    >
      <path
        d="M1.60409 11.9627C1.42075 11.7794 1.33291 11.5655 1.34055 11.3211C1.34819 11.0766 1.44367 10.8627 1.627 10.6794C1.81034 10.5114 2.02422 10.4235 2.26868 10.4159C2.51312 10.4082 2.72701 10.4961 2.91034 10.6794L6.16451 13.9336L6.48534 14.2544L6.80618 14.5752C6.98951 14.7586 7.07735 14.9725 7.06972 15.2169C7.06207 15.4614 6.96659 15.6752 6.78326 15.8586C6.59993 16.0266 6.38603 16.1145 6.14159 16.1221C5.89714 16.1297 5.68326 16.0419 5.49993 15.8586L1.60409 11.9627ZM11.3208 13.9106L19.1125 6.11898C19.2958 5.93565 19.5096 5.84781 19.7542 5.85544C19.9985 5.86308 20.2125 5.95856 20.3958 6.1419C20.5638 6.32523 20.6516 6.53912 20.6593 6.78356C20.667 7.02802 20.5792 7.2419 20.3958 7.42523L11.9624 15.8586C11.7791 16.0419 11.5652 16.1336 11.3208 16.1336C11.0763 16.1336 10.8624 16.0419 10.6791 15.8586L6.78326 11.9627C6.6152 11.7947 6.53118 11.5846 6.53118 11.3325C6.53118 11.0804 6.6152 10.8627 6.78326 10.6794C6.96659 10.4961 7.1843 10.4044 7.43639 10.4044C7.68847 10.4044 7.90618 10.4961 8.08951 10.6794L11.3208 13.9106ZM15.1937 7.44815L11.9624 10.6794C11.7944 10.8475 11.5843 10.9315 11.3322 10.9315C11.0801 10.9315 10.8624 10.8475 10.6791 10.6794C10.4958 10.4961 10.4041 10.2784 10.4041 10.0263C10.4041 9.77419 10.4958 9.55648 10.6791 9.37315L13.9103 6.1419C14.0784 5.97385 14.2885 5.88981 14.5406 5.88981C14.7926 5.88981 15.0103 5.97385 15.1937 6.1419C15.377 6.32523 15.4687 6.54294 15.4687 6.79502C15.4687 7.0471 15.377 7.26481 15.1937 7.44815Z"
        fill="#1865EA"
      />
    </svg>
  );
}

function ReadStatus({ status }) {
  if (!status || status === "sending") {
    return <span className="text-[10px] opacity-70">Sending</span>;
  }

  if (status === "seen") {
    return <RightIcon label="Seen" />;
  }

  if (status === "delivered" || status === "sent") {
    return <RightIcon label="Delivered" className="opacity-50" />;
  }

  return <RightIcon label="Sent" className="opacity-40" />;
}

function CallEventCard({ message }) {
  const duration = message.durationLabel || message.content || "00:00 min";

  return (
    <div className="flex justify-start">
      <div className="flex max-w-[85%] items-center gap-3 rounded-2xl rounded-bl-md border border-[#EEF2F7] bg-background px-4 py-3 shadow-card md:max-w-[70%]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
          <img src="/icons/call.svg" alt="" className="size-5" draggable={false} />
        </span>
        <div className="min-w-0">
          <p className="text-foreground text-sm font-semibold">Voice Call</p>
          <p className="text-muted-foreground mt-0.5 text-xs">{duration}</p>
        </div>
      </div>
    </div>
  );
}

export function MessageBubble({ message, isOwn }) {
  if (message.type === "call") {
    return <CallEventCard message={message} />;
  }

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] flex-col gap-1 md:max-w-[70%]", isOwn ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:text-[15px]",
            isOwn
              ? "rounded-br-md bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.2)]"
              : "rounded-bl-md bg-muted text-foreground",
          )}
        >
          {message.content}
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 px-1 text-[11px]">
          <span>{formatMessageTime(message.createdAt) || formatRelativeTime(message.createdAt)}</span>
          {isOwn ? <ReadStatus status={message.status} /> : null}
        </div>
      </div>
    </div>
  );
}

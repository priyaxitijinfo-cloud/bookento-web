"use client";

import { useRef } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Pin } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { useLongPress } from "@/hooks/use-long-press";
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
      width="16"
      height="16"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-3.5 max-md:size-4", className)}
      aria-label={label}
      role="img"
    >
      <path
        d="M1.60384 11.9627C1.42051 11.7794 1.33266 11.5655 1.3403 11.3211C1.34794 11.0766 1.44343 10.8627 1.62676 10.6794C1.81009 10.5114 2.02398 10.4235 2.26843 10.4159C2.51287 10.4082 2.72677 10.4961 2.9101 10.6794L6.16427 13.9336L6.4851 14.2544L6.80593 14.5752C6.98927 14.7586 7.0771 14.9725 7.06947 15.2169C7.06183 15.4614 6.96635 15.6752 6.78302 15.8586C6.59968 16.0266 6.38579 16.1145 6.14135 16.1221C5.89689 16.1297 5.68302 16.0419 5.49968 15.8586L1.60384 11.9627ZM11.3205 13.9106L19.1123 6.11898C19.2956 5.93565 19.5094 5.84781 19.7539 5.85544C19.9983 5.86308 20.2123 5.95856 20.3956 6.1419C20.5635 6.32523 20.6513 6.53912 20.659 6.78356C20.6667 7.02802 20.5789 7.2419 20.3956 7.42523L11.9622 15.8586C11.7788 16.0419 11.565 16.1336 11.3205 16.1336C11.0761 16.1336 10.8622 16.0419 10.6789 15.8586L6.78302 11.9627C6.61495 11.7947 6.53093 11.5846 6.53093 11.3325C6.53093 11.0804 6.61495 10.8627 6.78302 10.6794C6.96635 10.4961 7.18406 10.4044 7.43614 10.4044C7.68822 10.4044 7.90593 10.4961 8.08927 10.6794L11.3205 13.9106ZM15.1934 7.44815L11.9622 10.6794C11.7941 10.8475 11.5841 10.9315 11.332 10.9315C11.0799 10.9315 10.8622 10.8475 10.6789 10.6794C10.4955 10.4961 10.4038 10.2784 10.4038 10.0263C10.4038 9.77419 10.4955 9.55648 10.6789 9.37315L13.9101 6.1419C14.0781 5.97385 14.2882 5.88981 14.5403 5.88981C14.7924 5.88981 15.0101 5.97385 15.1934 6.1419C15.3768 6.32523 15.4684 6.54294 15.4684 6.79502C15.4684 7.0471 15.3768 7.26481 15.1934 7.44815Z"
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
      <div className="bg-background shadow-card flex max-w-[85%] items-center gap-3 rounded-2xl rounded-bl-md border border-[#EEF2F7] px-4 py-3 md:max-w-[70%]">
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

function AudioMessageBubble({ message, isOwn }) {
  return (
    <div
      className={cn(
        "flex max-w-[240px] min-w-[180px] items-center gap-2 px-3 py-2",
        isOwn ? "text-white" : "text-[#4D5972]",
      )}
    >
      <audio
        controls
        src={message.audioUrl}
        preload="metadata"
        className={cn(
          "h-8 min-w-0 flex-1",
          isOwn ? "max-md:[color-scheme:dark]" : "max-md:[color-scheme:light]",
        )}
      />
      <span className="shrink-0 text-[11px] opacity-80">{message.content}</span>
    </div>
  );
}

function ImageMessageBubble({ message }) {
  return (
    <a
      href={message.attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-lg"
    >
      <img
        src={message.attachmentUrl}
        alt={message.fileName || "Shared image"}
        className="max-h-52 max-w-[220px] object-cover"
      />
    </a>
  );
}

function FileMessageBubble({ message, isOwn }) {
  return (
    <a
      href={message.attachmentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex max-w-[240px] min-w-[180px] items-center gap-2 rounded-lg px-1 py-0.5 underline-offset-2 hover:underline",
        isOwn ? "text-white" : "text-[#4D5972]",
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-xs font-bold">
        DOC
      </span>
      <span className="min-w-0 truncate text-sm">
        {message.fileName || message.content}
      </span>
    </a>
  );
}

function DeletedMessageBubble({ isOwn, scope = "everyone" }) {
  const label =
    scope === "me" ? "You deleted this message" : "This message was deleted";

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-[#EEF2F7] px-4 py-2.5 text-sm leading-relaxed text-[#64748B] italic",
        isOwn
          ? "rounded-tl-lg rounded-tr-lg rounded-br-[2px] rounded-bl-lg"
          : "rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-[2px]",
      )}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-3.5 shrink-0 opacity-80"
        aria-hidden
      >
        <path
          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

export function MessageBubble({
  message,
  isOwn,
  participantAvatar,
  participantName,
  onOpenActions,
  isActionsOpen = false,
}) {
  const bubbleRef = useRef(null);
  const canOpenActions =
    Boolean(onOpenActions) && message.type !== "call" && !message.isDeleted;

  const openActions = () => {
    const target = bubbleRef.current;
    if (!target) return;
    onOpenActions?.(message, target.getBoundingClientRect());
  };

  const isDesktopViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

  const longPressHandlers = useLongPress({
    onLongPress: () => {
      if (!isDesktopViewport()) openActions();
    },
    onClick: () => {
      if (isDesktopViewport()) openActions();
    },
  });

  if (message.type === "call") {
    return <CallEventCard message={message} />;
  }

  if (message.isDeleted) {
    const deletedBubble = (
      <DeletedMessageBubble isOwn={isOwn} scope={message.deletedScope} />
    );
    const meta = (
      <div
        className={cn(
          "md:text-muted-foreground flex items-center gap-1.5 px-1 text-[11px] text-[#94A3B8] max-md:text-[11px]",
          isOwn ? "justify-end" : "pl-11 md:pl-12",
        )}
      >
        <span>
          {formatMessageTime(message.createdAt) ||
            formatRelativeTime(message.createdAt)}
        </span>
      </div>
    );

    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
        {!isOwn ? (
          <div className="flex max-w-[92%] flex-col gap-1 md:max-w-[70%]">
            <div className="flex items-end gap-2">
              <Avatar
                src={participantAvatar}
                name={participantName}
                className="size-9 shrink-0 border-2 border-[#1865EA] md:size-10"
              />
              {deletedBubble}
            </div>
            {meta}
          </div>
        ) : (
          <div className="flex max-w-[85%] flex-col items-end gap-1 md:max-w-[70%]">
            {deletedBubble}
            {meta}
          </div>
        )}
      </div>
    );
  }

  const innerContent =
    message.type === "audio" && message.audioUrl ? (
      <AudioMessageBubble message={message} isOwn={isOwn} />
    ) : message.type === "image" && message.attachmentUrl ? (
      <ImageMessageBubble message={message} />
    ) : message.type === "file" && message.attachmentUrl ? (
      <FileMessageBubble message={message} isOwn={isOwn} />
    ) : (
      message.content
    );

  const bubbleContent = (
    <>
      {message.forwardedFrom ? (
        <p
          className={cn(
            "mb-1 text-[11px] font-semibold tracking-wide uppercase opacity-80",
            isOwn ? "text-white/90" : "text-primary",
          )}
        >
          Forwarded from {message.forwardedFrom}
        </p>
      ) : null}
      {message.isPinned ? (
        <div
          className={cn(
            "mb-1 flex items-center gap-1 text-[11px] font-medium",
            isOwn ? "text-white/85" : "text-primary",
          )}
        >
          <Pin className="size-3" strokeWidth={2.25} />
          <span>Pinned</span>
        </div>
      ) : null}
      {innerContent}
      {message.isEdited ? (
        <span
          className={cn(
            "mt-1 block text-[10px] font-medium italic",
            isOwn ? "text-white/70" : "text-[#94A3B8]",
          )}
        >
          Edited
        </span>
      ) : null}
    </>
  );

  const isMediaAttachment = message.type === "image" || message.type === "file";
  const reactions = Array.isArray(message.reactions) ? message.reactions : [];

  const bubble = (
    <div
      ref={bubbleRef}
      data-message-bubble
      className={cn(
        isMediaAttachment
          ? "overflow-hidden p-1"
          : "px-4 py-2.5 text-sm leading-relaxed max-md:font-medium md:text-[15px]",
        isOwn
          ? "bg-primary text-white shadow-[0_2px_8px_rgba(24,101,234,0.2)] max-md:rounded-tl-lg max-md:rounded-tr-lg max-md:rounded-br-[2px] max-md:rounded-bl-lg md:rounded-lg md:rounded-br-[2px]"
          : "md:text-foreground rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-[2px] bg-white text-[#4D5972] shadow-[0_2px_12px_rgba(77,89,114,0.12)] md:rounded-lg md:rounded-bl-[2px] md:bg-[#FFFFFF] md:shadow-[0_2px_12px_rgba(77,89,114,0.12)]",
        isActionsOpen && "ring-offset-primary/20 ring-2 ring-white/80 ring-offset-2",
        canOpenActions &&
          "cursor-pointer touch-manipulation select-none [-webkit-touch-callout:none]",
      )}
      {...(canOpenActions
        ? {
            ...longPressHandlers,
            onContextMenu: (event) => {
              event.preventDefault();
              if (isDesktopViewport()) openActions();
            },
          }
        : {})}
    >
      {bubbleContent}
    </div>
  );

  const reactionStrip =
    reactions.length > 0 ? (
      <div
        className={cn(
          "flex flex-wrap gap-1 px-1",
          isOwn ? "justify-end" : "justify-start pl-11 md:pl-12",
        )}
      >
        {reactions.map((reaction, index) => (
          <span
            key={`${reaction.emoji}-${reaction.userId ?? index}`}
            className="rounded-full border border-[#E8EDF5] bg-white px-2 py-0.5 text-xs shadow-sm"
          >
            {reaction.emoji}
          </span>
        ))}
      </div>
    ) : null;

  const meta = (
    <div
      className={cn(
        "md:text-muted-foreground flex items-center gap-1.5 px-1 text-[11px] text-[#94A3B8] max-md:text-[11px]",
        isOwn ? "justify-end" : "pl-11 md:pl-12",
      )}
    >
      <span>
        {formatMessageTime(message.createdAt) || formatRelativeTime(message.createdAt)}
      </span>
      {isOwn ? <ReadStatus status={message.status} /> : null}
    </div>
  );

  return (
    <div
      className={cn(
        "flex",
        isOwn ? "justify-end" : "justify-start",
        isActionsOpen && "relative z-[70] opacity-0",
      )}
    >
      {!isOwn ? (
        <div className="flex max-w-[92%] flex-col gap-1 md:max-w-[70%]">
          <div className="flex items-end gap-2">
            <Avatar
              src={participantAvatar}
              name={participantName}
              className="size-9 shrink-0 border-2 border-[#1865EA] md:size-10"
            />
            {bubble}
          </div>
          {reactionStrip}
          {meta}
        </div>
      ) : (
        <div className="flex max-w-[85%] flex-col items-end gap-1 md:max-w-[70%]">
          {bubble}
          {reactionStrip}
          {meta}
        </div>
      )}
    </div>
  );
}

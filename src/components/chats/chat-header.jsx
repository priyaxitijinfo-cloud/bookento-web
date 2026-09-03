"use client";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function CallIcon({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5", className)}
      aria-hidden
    >
      <path
        d="M16.2401 23.5136C9.00445 23.7491 -4.00214 10.7422 2.03886 3.68139L3.06214 2.78635C4.14256 1.73952 5.8515 1.75523 6.90594 2.82823C6.93192 2.8544 8.57852 5.01086 8.57852 5.01086C9.59661 6.08386 9.59141 7.77449 8.57332 8.84749L7.64873 9.95713C7.33707 10.3288 7.27474 10.8574 7.48771 11.2971C8.58371 13.5216 10.3706 15.3221 12.573 16.4318C13.0093 16.6516 13.5287 16.5888 13.9027 16.2695L15.0091 15.3326C16.0739 14.3067 17.7465 14.3067 18.8165 15.3274C18.8165 15.3274 20.9566 16.9866 20.9826 17.0128C22.0526 18.0962 22.0526 19.8497 20.9826 20.9331L20.1723 21.87C19.1334 22.9273 17.7205 23.5188 16.2401 23.5136Z"
        fill="currentColor"
      />
      <path
        d="M16.858 7.09866C17.7155 8.02845 18.3179 9.13962 18.6214 10.3539C18.7332 10.8015 18.4084 11.2237 17.9515 11.286C17.4934 11.3485 17.0773 11.0245 16.9506 10.5797C16.7036 9.71282 16.2583 8.91831 15.6388 8.24936C14.9753 7.53288 14.1634 7.01069 13.2601 6.70982C12.819 6.5629 12.5101 6.13274 12.5899 5.67484C12.6699 5.21554 13.1096 4.90375 13.5567 5.03641C14.816 5.41008 15.9451 6.1128 16.858 7.09866Z"
        fill="currentColor"
      />
      <path
        d="M13.9276 0.707591C16.2369 1.27922 18.3022 2.50162 19.9444 4.27505C21.4955 5.95427 22.5412 7.99126 22.9955 10.2142C23.0879 10.6661 22.7652 11.0877 22.3083 11.15C21.8505 11.2124 21.432 10.8902 21.335 10.4383C20.9327 8.56381 20.0386 6.84411 18.7252 5.42574C17.3322 3.92553 15.5858 2.87851 13.6343 2.37226C13.1842 2.2555 12.8769 1.82251 12.9567 1.3645C13.0367 0.905375 13.4751 0.595588 13.9276 0.707591Z"
        fill="currentColor"
      />
    </svg>
  );
}

function VideoCallIcon({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-5", className)}
      aria-hidden
    >
      <path
        d="M16.7999 16.5333C16.7999 17.4528 16.389 18.3345 15.6577 18.9846C14.9263 19.6348 13.9343 20 12.8999 20H3.89994C2.86559 20 1.87361 19.6348 1.14222 18.9846C0.410831 18.3345 -6.10352e-05 17.4528 -6.10352e-05 16.5333V7.46667C-6.10352e-05 6.54725 0.410831 5.66549 1.14222 5.01536C1.87361 4.36524 2.86559 4 3.89994 4H12.8999C13.9343 4 14.9263 4.36524 15.6577 5.01536C16.389 5.66549 16.7999 6.54725 16.7999 7.46667V16.5333ZM23.7143 5.48587C23.8988 5.67883 24.0001 5.92384 23.9999 6.17707V17.8229C24 18.0266 23.9345 18.2261 23.8111 18.3977C23.6877 18.5694 23.5116 18.706 23.3036 18.7915C23.0956 18.877 22.8644 18.9077 22.6373 18.8801C22.4103 18.8525 22.1969 18.7677 22.0223 18.6357L17.9999 15.5947V8.4032L22.0223 5.36427C22.1424 5.27346 22.2814 5.20457 22.4314 5.16154C22.5815 5.1185 22.7396 5.10216 22.8967 5.11346C23.0538 5.12475 23.2069 5.16345 23.3472 5.22735C23.4875 5.29125 23.6122 5.3791 23.7143 5.48587Z"
        fill="#1865EA"
      />
    </svg>
  );
}

export function ChatHeader({
  name,
  avatar,
  isOnline,
  onCall,
  onVideoCall,
  className,
  trailing,
}) {
  return (
    <div
      className={cn(
        "bg-background flex items-center gap-3 border-b border-[#EEF2F7] px-4 py-3 md:gap-4 md:px-5 md:py-4",
        className,
      )}
    >
      <div className="relative shrink-0">
        <Avatar src={avatar} name={name} size="md" className="size-11 md:size-12" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-[15px] font-semibold md:text-base">
          {name}
        </p>
        {isOnline ? (
          <p className="flex items-center gap-1.5 text-xs text-[#22C55E] md:text-sm">
            <span className="size-1.5 shrink-0 rounded-full bg-[#22C55E]" aria-hidden />
            Online
          </p>
        ) : (
          <p className="text-muted-foreground text-xs md:text-sm">Offline</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 max-md:-mr-2 md:gap-2">
        {onCall ? (
          <button
            type="button"
            onClick={onCall}
            aria-label="Voice call"
            className="text-primary hover:border-border flex size-10 items-center justify-center rounded-full border border-transparent transition-colors max-md:text-[#4D5972] md:size-11"
          >
            <CallIcon />
          </button>
        ) : null}
        {onVideoCall ? (
          <button
            type="button"
            onClick={onVideoCall}
            aria-label="Video call"
            className="hover:border-border hidden size-10 items-center justify-center rounded-full border border-transparent transition-colors md:flex md:size-11"
          >
            <VideoCallIcon />
          </button>
        ) : null}
        {trailing}
      </div>
    </div>
  );
}

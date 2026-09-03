"use client";

import { useEffect, useState, useId } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

/** From icons/New folder/Photo & Video.svg */
function PhotoVideoIcon({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M14.9998 6.6665C14.9998 7.58698 14.2536 8.33317 13.3332 8.33317C12.4127 8.33317 11.6665 7.58698 11.6665 6.6665C11.6665 5.74603 12.4127 4.99984 13.3332 4.99984C14.2536 4.99984 14.9998 5.74603 14.9998 6.6665Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0477 1.0415H9.95202C8.02837 1.04149 6.52083 1.04149 5.34459 1.19963C4.14065 1.36149 3.19063 1.69928 2.44495 2.44495C1.69928 3.19063 1.36149 4.14065 1.19963 5.34459C1.04149 6.52083 1.04149 8.02835 1.0415 9.95201V10.0477C1.04149 11.9713 1.04149 13.4788 1.19963 14.6551C1.36149 15.859 1.69928 16.809 2.44495 17.5547C3.19063 18.3004 4.14065 18.6382 5.34459 18.8C6.52083 18.9582 8.02836 18.9582 9.95203 18.9582H10.0476C11.9713 18.9582 13.4788 18.9582 14.6551 18.8C15.859 18.6382 16.809 18.3004 17.5547 17.5547C18.3004 16.809 18.6382 15.859 18.8 14.6551C18.9582 13.4788 18.9582 11.9713 18.9582 10.0476V9.95203C18.9582 8.02836 18.9582 6.52083 18.8 5.34459C18.6382 4.14065 18.3004 3.19063 17.5547 2.44495C16.809 1.69928 15.859 1.36149 14.6551 1.19963C13.4788 1.04149 11.9713 1.04149 10.0477 1.0415ZM3.32883 3.32883C3.80355 2.85412 4.44582 2.58171 5.51115 2.43848C6.59447 2.29283 8.01798 2.2915 9.99984 2.2915C11.9817 2.2915 13.4052 2.29283 14.4885 2.43848C15.5539 2.58171 16.1961 2.85412 16.6708 3.32883C17.1456 3.80355 17.418 4.44582 17.5612 5.51115C17.7068 6.59447 17.7082 8.01798 17.7082 9.99984C17.7082 10.375 17.7081 10.7302 17.7071 11.0669L17.522 11.0412C15.1522 10.7131 12.9836 11.9451 11.8793 13.802C10.4547 10.1978 6.6902 7.73989 2.48378 8.34389L2.29564 8.37102C2.30511 7.19977 2.33624 6.27163 2.43848 5.51115C2.58171 4.44582 2.85412 3.80355 3.32883 3.32883Z"
        fill="white"
      />
    </svg>
  );
}

/** From icons/New folder/Camera.svg */
function CameraIcon({ className }) {
  const clipId = useId().replace(/:/g, "");

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.2872 18.3332H12.5465C15.5374 18.3332 17.0329 18.3332 18.1072 17.6522C18.5723 17.3575 18.9716 16.9787 19.2823 16.5375C20.0002 15.5184 20.0002 14.0998 20.0002 11.2625C20.0002 8.42517 20.0002 7.00652 19.2823 5.98743C18.9716 5.54626 18.5723 5.16747 18.1072 4.87269C17.4169 4.43515 16.5527 4.27875 15.2296 4.22285C14.5982 4.22285 14.0545 3.76899 13.9307 3.18166C13.745 2.30066 12.9295 1.6665 11.9824 1.6665H8.85124C7.90413 1.6665 7.08868 2.30066 6.90294 3.18166C6.77911 3.76899 6.23548 4.22285 5.60408 4.22285C4.28094 4.27875 3.41673 4.43515 2.72644 4.87269C2.26137 5.16747 1.86206 5.54626 1.55131 5.98743C0.833496 7.00652 0.833496 8.42517 0.833496 11.2625C0.833496 14.0998 0.833496 15.5184 1.55131 16.5375C1.86206 16.9787 2.26137 17.3575 2.72644 17.6522C3.80072 18.3332 5.29622 18.3332 8.2872 18.3332ZM10.4168 7.47458C8.21153 7.47458 6.42377 9.17048 6.42377 11.2625C6.42377 13.3545 8.21153 15.0503 10.4168 15.0503C12.6221 15.0503 14.4099 13.3545 14.4099 11.2625C14.4099 9.17048 12.6221 7.47458 10.4168 7.47458ZM10.4168 8.98974C9.09365 8.98974 8.021 10.0073 8.021 11.2625C8.021 12.5177 9.09365 13.5352 10.4168 13.5352C11.74 13.5352 12.8127 12.5177 12.8127 11.2625C12.8127 10.0073 11.74 8.98974 10.4168 8.98974ZM14.9423 8.23216C14.9423 7.81376 15.2998 7.47458 15.7409 7.47458H16.8057C17.2468 7.47458 17.6043 7.81376 17.6043 8.23216C17.6043 8.65056 17.2468 8.98974 16.8057 8.98974H15.7409C15.2998 8.98974 14.9423 8.65056 14.9423 8.23216Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/** From icons/New folder/Document.svg */
function DocumentIcon({ className }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        d="M5.70703 1.5C6.0357 1.5 6.20047 1.49988 6.3584 1.51465C7.03905 1.57835 7.68457 1.84602 8.21094 2.28223C8.33306 2.38346 8.45021 2.50002 8.68262 2.73242L9.14941 3.2002C9.84281 3.89359 10.1903 4.23972 10.6055 4.4707C10.8335 4.59756 11.0752 4.698 11.3262 4.76953C11.7831 4.89976 12.2733 4.90039 13.2539 4.90039H13.5713C15.8088 4.90039 16.9281 4.89968 17.6553 5.55371C17.7221 5.61385 17.7856 5.67825 17.8457 5.74512C18.4995 6.4723 18.5 7.59094 18.5 9.82813V11.7002C18.5 14.9054 18.4997 16.5081 17.5039 17.5039C16.5081 18.4997 14.9054 18.5 11.7002 18.5H8.2998C5.09454 18.5 3.49192 18.4996 2.49609 17.5039C1.50032 16.5081 1.5 14.9054 1.5 11.7002V5.70703C1.5 4.95703 1.49966 4.58193 1.55859 4.26953C1.81809 2.89419 2.89419 1.81809 4.26953 1.55859C4.58193 1.49966 4.95703 1.5 5.70703 1.5ZM10.8506 7.66309C10.7625 7.66309 10.6779 7.68057 10.6016 7.71289C10.3731 7.80972 10.2131 8.03607 10.2129 8.2998C10.2129 8.47585 10.284 8.63561 10.3994 8.75098C10.486 8.83741 10.5972 8.89941 10.7217 8.9248C10.7632 8.93329 10.8066 8.9375 10.8506 8.9375H15.0996C15.1878 8.9375 15.2723 8.92004 15.3486 8.8877C15.3865 8.87166 15.4224 8.85181 15.4561 8.8291C15.5242 8.78315 15.5829 8.72438 15.6289 8.65625C15.6746 8.58857 15.7076 8.51148 15.7246 8.42871C15.7331 8.3872 15.7373 8.34383 15.7373 8.2998C15.7371 7.94791 15.4516 7.66309 15.0996 7.66309H10.8506ZM13.6406 2.34961C13.9514 2.34961 14.1068 2.35039 14.2373 2.36816C15.1031 2.48624 15.7924 3.16851 15.9502 4.0498C15.8245 4.02075 15.6932 3.99812 15.5576 3.98047C15.0142 3.90973 14.3274 3.91014 13.4756 3.91016H13.1914C12.3908 3.91016 12.0872 3.90493 11.8105 3.82324C11.6501 3.77586 11.4954 3.70996 11.3496 3.62598C11.0982 3.48112 10.8804 3.26201 10.3145 2.67578L10 2.34961H13.6406Z"
        fill="white"
      />
    </svg>
  );
}

const ATTACHMENT_OPTIONS = [
  {
    id: "gallery",
    label: "Photo & Video",
    icon: PhotoVideoIcon,
    gradientClass: "bg-gradient-to-br from-[#FF7BB8] to-[#FF2F8F]",
  },
  {
    id: "camera",
    label: "Camera",
    icon: CameraIcon,
    gradientClass: "bg-gradient-to-br from-[#C16CFF] to-[#5E21CA]",
  },
  {
    id: "document",
    label: "Document",
    icon: DocumentIcon,
    gradientClass: "bg-gradient-to-br from-[#FDA769] to-[#FC5B7D]",
  },
];

function AttachmentOptionRow({ option, onClick, variant = "mobile" }) {
  const Icon = option.icon;
  const isMobile = variant === "mobile";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 text-left transition-opacity hover:opacity-95",
        isMobile
          ? "min-w-[11.5rem] rounded-xl bg-white px-3 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          : "w-full rounded-xl border border-[#EEF2F7] bg-[#F8FAFC] px-4 py-3 hover:bg-[#F1F5F9]",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[0.65rem]",
          option.gradientClass,
        )}
      >
        <Icon />
      </span>
      <span className="text-[15px] font-medium text-[#111827]">{option.label}</span>
    </button>
  );
}

export function ChatAttachmentMenu({
  open,
  onClose,
  onPhotoVideo,
  onCamera,
  onDocument,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const handlers = {
    gallery: onPhotoVideo,
    camera: onCamera,
    document: onDocument,
  };

  const handleSelect = (id) => {
    onClose?.();
    handlers[id]?.();
  };

  const modal = (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] md:bg-black/40 md:backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close attachment menu"
      />

      {/* Mobile — Figma stacked menu above input */}
      <div
        role="menu"
        aria-label="Attachment options"
        className="absolute bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] left-4 flex flex-col gap-2 md:hidden"
      >
        {ATTACHMENT_OPTIONS.map((option) => (
          <AttachmentOptionRow
            key={option.id}
            option={option}
            variant="mobile"
            onClick={() => handleSelect(option.id)}
          />
        ))}
      </div>

      {/* Web — centered webview modal */}
      <div className="hidden md:flex md:h-full md:items-center md:justify-center md:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-attachment-title"
          className="relative w-full max-w-[22rem] rounded-[1.25rem] bg-white px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
        >
          <h2
            id="chat-attachment-title"
            className="text-center text-lg font-bold text-[#111827]"
          >
            Add attachment
          </h2>
          <p className="mt-1.5 text-center text-sm text-[#64748B]">
            Choose what you want to share
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            {ATTACHMENT_OPTIONS.map((option) => (
              <AttachmentOptionRow
                key={option.id}
                option={option}
                variant="desktop"
                onClick={() => handleSelect(option.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

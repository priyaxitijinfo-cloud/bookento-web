"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { ChatAttachmentMenu } from "@/components/chats/chat-attachment-menu";
import { SendIcon } from "@/components/icons/send-icon";
import { cn } from "@/lib/utils";

function formatRecordingDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatRecordingTimer(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function isMobileViewport() {
  return (
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
  );
}

function VoiceIcon({ className, recording = false }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-[30px]", className)}
      aria-hidden
    >
      <path
        d="M13.4166 12.0418C13.4166 10.8263 13.8995 9.66047 14.759 8.80092C15.6185 7.94138 16.7843 7.4585 17.9999 7.4585C19.2155 7.4585 20.3813 7.94138 21.2408 8.80092C22.1003 9.66047 22.5832 10.8263 22.5832 12.0418V17.0835C22.5832 18.2991 22.1003 19.4649 21.2408 20.3244C20.3813 21.1839 19.2155 21.6668 17.9999 21.6668C16.7843 21.6668 15.6185 21.1839 14.759 20.3244C13.8995 19.4649 13.4166 18.2991 13.4166 17.0835V12.0418Z"
        fill={recording ? "#EF4444" : "#4D5972"}
      />
      <path
        d="M18.0054 23.4999H17.9944C16.717 23.4988 15.4689 23.1166 14.41 22.4021C13.351 21.6877 12.5292 20.6736 12.0499 19.4895C11.9576 19.2658 11.7805 19.0876 11.5574 18.9939C11.3342 18.9002 11.083 18.8985 10.8587 18.9893C10.6343 19.08 10.4549 19.2558 10.3597 19.4784C10.2645 19.7009 10.2611 19.952 10.3504 20.177C10.9087 21.5556 11.8291 22.7577 13.0142 23.6564C14.1993 24.5551 15.6052 25.1171 17.0833 25.2828V28.0833C17.0833 28.3264 17.1798 28.5595 17.3518 28.7314C17.5237 28.9034 17.7568 28.9999 17.9999 28.9999C18.2431 28.9999 18.4762 28.9034 18.6481 28.7314C18.82 28.5595 18.9166 28.3264 18.9166 28.0833V25.2828C20.3948 25.1172 21.8009 24.5554 22.9862 23.6566C24.1715 22.7579 25.092 21.5557 25.6504 20.177C25.7397 19.952 25.7363 19.7009 25.6411 19.4784C25.5459 19.2558 25.3665 19.08 25.1421 18.9893C24.9177 18.8985 24.6666 18.9002 24.4434 18.9939C24.2203 19.0876 24.0432 19.2658 23.9509 19.4895C23.4716 20.6738 22.6497 21.6881 21.5905 22.4026C20.5314 23.117 19.2831 23.4991 18.0054 23.4999Z"
        fill={recording ? "#EF4444" : "#4D5972"}
      />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      aria-hidden
    >
      <path
        d="M14.2999 7.30047H8.70002V1.70044C8.70002 1.31414 8.38637 1.00049 7.99993 1.00049C7.61363 1.00049 7.29998 1.31414 7.29998 1.70044V7.30047H1.69995C1.31365 7.30047 1 7.61412 1 8.00042C1 8.38685 1.31365 8.70051 1.69995 8.70051H7.29998V14.3004C7.29998 14.6868 7.61363 15.0005 7.99993 15.0005C8.38637 15.0005 8.70002 14.6868 8.70002 14.3004V8.70051H14.2999C14.6863 8.70051 15 8.38685 15 8.00042C15 7.61412 14.6863 7.30047 14.2999 7.30047Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.875"
      />
    </svg>
  );
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export function MessageInput({
  onSend,
  onSendVoice,
  onSendAttachment,
  disabled = false,
  className,
  replyTo = null,
  onCancelReply,
  editingMessage = null,
  onCancelEdit,
}) {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMs, setRecordingMs] = useState(0);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const shouldSendRecordingRef = useRef(true);
  const onSendVoiceRef = useRef(onSendVoice);
  const onSendAttachmentRef = useRef(onSendAttachment);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const textInputRef = useRef(null);

  useEffect(() => {
    if (!editingMessage) return;
    setValue(editingMessage.content || "");
    window.requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }, [editingMessage]);

  useEffect(() => {
    onSendVoiceRef.current = onSendVoice;
  }, [onSendVoice]);

  useEffect(() => {
    onSendAttachmentRef.current = onSendAttachment;
  }, [onSendAttachment]);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const clearRecordingTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetRecordingState = useCallback(() => {
    clearRecordingTimer();
    setIsRecording(false);
    setRecordingMs(0);
    cleanupStream();
    recorderRef.current = null;
    chunksRef.current = [];
    shouldSendRecordingRef.current = true;
  }, [cleanupStream, clearRecordingTimer]);

  useEffect(() => {
    return () => {
      clearRecordingTimer();
      if (recorderRef.current?.state === "recording") {
        shouldSendRecordingRef.current = false;
        recorderRef.current.stop();
      }
      cleanupStream();
    };
  }, [cleanupStream, clearRecordingTimer]);

  const finishRecording = useCallback(
    (shouldSend) => {
      shouldSendRecordingRef.current = shouldSend;
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
        return;
      }
      resetRecordingState();
    },
    [resetRecordingState],
  );

  const startRecording = useCallback(async () => {
    if (disabled || isRecording) return;

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error("Voice recording is not supported on this device.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      shouldSendRecordingRef.current = true;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const shouldSend = shouldSendRecordingRef.current;
        const durationMs = Math.max(0, Date.now() - recordingStartedAtRef.current);
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        });

        resetRecordingState();

        if (!shouldSend) return;

        if (durationMs < 500 || blob.size === 0) {
          toast.message("Record for at least 1 second.");
          return;
        }

        onSendVoiceRef.current?.({
          blob,
          durationMs,
          durationLabel: formatRecordingDuration(durationMs),
        });
      };

      recorder.onerror = () => {
        toast.error("Could not record voice message.");
        finishRecording(false);
      };

      recordingStartedAtRef.current = Date.now();
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setRecordingMs(0);

      timerRef.current = setInterval(() => {
        setRecordingMs(Date.now() - recordingStartedAtRef.current);
      }, 200);
    } catch {
      cleanupStream();
      toast.error("Microphone access is required to send voice messages.");
    }
  }, [cleanupStream, disabled, finishRecording, isRecording, resetRecordingState]);

  const handleVoiceClick = () => {
    if (!isMobileViewport()) {
      toast.message("Voice messages coming soon");
      return;
    }

    if (isRecording) return;
    startRecording();
  };

  const handleConfirmRecording = () => {
    finishRecording(true);
  };

  const handleCancelRecording = () => {
    finishRecording(false);
  };

  const handleAttachmentClick = () => {
    if (disabled || isRecording) return;
    setAttachmentMenuOpen(true);
  };

  const handleGalleryPick = () => {
    galleryInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleDocumentPick = () => {
    documentInputRef.current?.click();
  };

  const sendAttachmentFile = (file, { allowDocuments = false } = {}) => {
    if (!file) return;

    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast.error("File must be 10 MB or smaller.");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo && !allowDocuments) {
      toast.error("Please choose a photo or video file.");
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    onSendAttachmentRef.current?.({
      file,
      fileUrl,
      fileName: file.name,
      mimeType: file.type,
      attachmentKind: isImage ? "image" : "file",
    });
  };

  const handleMediaSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    sendAttachmentFile(file);
  };

  const handleDocumentSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    sendAttachmentFile(file, { allowDocuments: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = value.trim();
    if (!text || disabled || isRecording) return;
    setValue("");
    if (editingMessage) {
      await onSend?.(text, { editMessageId: editingMessage.id });
      onCancelEdit?.();
      return;
    }
    await onSend?.(text, { replyToId: replyTo?.id ?? null });
    onCancelReply?.();
  };

  return (
    <>
      <ChatAttachmentMenu
        open={attachmentMenuOpen}
        onClose={() => setAttachmentMenuOpen(false)}
        onPhotoVideo={handleGalleryPick}
        onCamera={handleTakePhoto}
        onDocument={handleDocumentPick}
      />

      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full shrink-0 bg-white",
          "border-t border-[#F0F0F0] px-4 pt-3 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]",
          "md:bg-background md:border-[#EEF2F7] md:p-5 md:pb-5",
          className,
        )}
      >
        {editingMessage ? (
          <div className="mx-auto mb-3 flex w-full max-w-3xl items-start gap-3 rounded-xl border border-[#E8EDF5] bg-[#F8FAFC] px-3 py-2.5 md:max-w-full">
            <div className="border-primary min-w-0 flex-1 border-l-2 pl-3">
              <p className="text-primary text-xs font-semibold">Editing message</p>
              <p className="text-muted-foreground mt-0.5 truncate text-sm">
                {editingMessage.content}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setValue("");
                onCancelEdit?.();
              }}
              className="text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#EEF2F7]"
              aria-label="Cancel edit"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : replyTo ? (
          <div className="mx-auto mb-3 flex w-full max-w-3xl items-start gap-3 rounded-xl border border-[#E8EDF5] bg-[#F8FAFC] px-3 py-2.5 md:max-w-full">
            <div className="border-primary min-w-0 flex-1 border-l-2 pl-3">
              <p className="text-primary text-xs font-semibold">Replying to message</p>
              <p className="text-muted-foreground mt-0.5 truncate text-sm">
                {replyTo.content}
              </p>
            </div>
            <button
              type="button"
              onClick={onCancelReply}
              className="text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#EEF2F7]"
              aria-label="Cancel reply"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 md:max-w-full">
          <button
            type="button"
            aria-label="Add attachment"
            onClick={handleAttachmentClick}
            disabled={disabled || isRecording}
            className="bg-primary hidden size-11 shrink-0 items-center justify-center rounded-full text-white shadow-[0_2px_8px_rgba(24,101,234,0.25)] transition-opacity hover:opacity-95 disabled:opacity-50 md:flex"
          >
            <PlusIcon className="size-[18px]" />
          </button>

          {isRecording ? (
            <div className="flex min-w-0 flex-1 items-center gap-3 max-md:flex md:hidden">
              <div className="flex h-11 min-w-0 flex-1 items-center justify-between rounded-full bg-[#EEF0F4] px-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full bg-[#EF4444]"
                    aria-hidden
                  />
                  <span className="truncate text-sm font-medium text-[#EF4444]">
                    Recording... {formatRecordingTimer(recordingMs)}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Delete recording"
                  onClick={handleCancelRecording}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-black/5"
                >
                  <Trash2 className="size-[18px]" strokeWidth={2} />
                </button>
              </div>
              <button
                type="button"
                aria-label="Send voice message"
                onClick={handleConfirmRecording}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_2px_8px_rgba(34,197,94,0.35)] transition-opacity hover:opacity-95"
              >
                <Check className="size-5" strokeWidth={2.5} />
              </button>
            </div>
          ) : null}

          <div
            className={cn("relative min-w-0 flex-1", isRecording && "max-md:hidden")}
          >
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaSelected}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleMediaSelected}
            />
            <input
              ref={documentInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={handleDocumentSelected}
            />
            <button
              type="button"
              aria-label="Add attachment"
              onClick={handleAttachmentClick}
              disabled={isRecording}
              className="absolute top-1/2 left-1.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#1865EA] text-white transition-opacity hover:opacity-95 disabled:opacity-50 md:hidden"
            >
              <PlusIcon />
            </button>

            <input
              ref={textInputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type a message..."
              disabled={disabled || isRecording}
              className={cn(
                "text-foreground h-11 w-full rounded-full bg-[#EEF0F4] py-0 pr-12 text-sm outline-none",
                "border-0 pl-12 placeholder:text-[#94A3B8]",
                "focus-visible:ring-2 focus-visible:ring-[#1865EA]/20",
                "md:border-border/70 md:focus-visible:ring-primary/20 md:h-12 md:border md:bg-[#F8FAFC] md:pr-11 md:pl-4 md:text-[15px]",
              )}
            />
            <button
              type="button"
              aria-label="Voice message"
              onClick={handleVoiceClick}
              disabled={disabled}
              className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-black/5 md:right-2 md:hover:bg-[#E2E8F0]"
            >
              <VoiceIcon />
            </button>
          </div>

          {!isRecording ? (
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              aria-label="Send message"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-95",
                "gradient-brand shadow-[0_2px_8px_rgba(24,101,234,0.25)]",
                "disabled:cursor-not-allowed disabled:opacity-45",
                "md:bg-primary md:[background-image:none] md:shadow-[0_2px_8px_rgba(24,101,234,0.25)] md:disabled:opacity-40",
              )}
            >
              <SendIcon />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Stop recording"
              onClick={handleConfirmRecording}
              className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white shadow-[0_2px_8px_rgba(34,197,94,0.35)] md:flex"
            >
              <Check className="size-5" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </form>
    </>
  );
}

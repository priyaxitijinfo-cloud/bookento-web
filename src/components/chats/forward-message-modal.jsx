"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Search, X } from "lucide-react";

import { SendIcon } from "@/components/icons/send-icon";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function SelectionCheckbox({ checked }) {
  return (
    <span
      className={cn(
        "flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors",
        checked
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-[#CBD5E1] bg-white",
      )}
      aria-hidden
    >
      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </span>
  );
}

function ForwardSendButton({
  selectedCount,
  isSubmitting,
  onClick,
  variant = "mobile",
}) {
  const enabled = selectedCount > 0 && !isSubmitting;
  const isMobile = variant === "mobile";

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className={cn(
        "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold transition-all",
        enabled
          ? isMobile
            ? "bg-primary hover:bg-primary/90 text-white"
            : "gradient-brand md:bg-primary md:hover:bg-primary/90 text-white shadow-[0_4px_14px_rgba(24,101,234,0.28)] hover:opacity-95 md:[background-image:none] md:shadow-none"
          : "cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]",
      )}
    >
      {isSubmitting ? (
        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : isMobile ? (
        <span>Send</span>
      ) : (
        <>
          <SendIcon className="size-4" />
          <span>
            {selectedCount > 1
              ? `Send to ${selectedCount} chats`
              : selectedCount === 1
                ? "Send"
                : "Select chats"}
          </span>
        </>
      )}
    </button>
  );
}

function ConversationList({
  conversations,
  selectedIds,
  isSubmitting,
  onToggle,
  variant = "mobile",
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center px-6 py-10 text-center">
        <p className="text-sm font-medium text-[#111827]">No chats found</p>
        <p className="mt-1 text-[13px] text-[#94A3B8]">Try a different search</p>
      </div>
    );
  }

  const isMobile = variant === "mobile";

  return (
    <ul className={cn(isMobile ? "py-1" : "space-y-2.5 px-5 py-3")}>
      {conversations.map((conversation) => {
        const isSelected = selectedIds.includes(conversation.id);

        return (
          <li key={conversation.id}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onToggle(conversation.id)}
              className={cn(
                "flex w-full items-center gap-3 text-left transition-colors",
                isMobile
                  ? cn(
                      "px-5 py-3.5",
                      isSelected ? "bg-[#F7FFFB]" : "bg-white hover:bg-[#FAFAFA]",
                    )
                  : cn(
                      "rounded-xl border p-3.5",
                      isSelected
                        ? "border-[#C3F4DC] bg-[#F7FFFB]"
                        : "border-[#E8EDF5] bg-white hover:border-[#D7DEE8]",
                    ),
                isSubmitting && "pointer-events-none opacity-50",
              )}
            >
              <Avatar
                src={conversation.participantAvatar}
                name={conversation.participantName}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#111827]">
                  {conversation.participantName}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#94A3B8]">
                  {conversation.lastMessage}
                </p>
              </div>
              <SelectionCheckbox checked={isSelected} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function SearchField({ query, onChange, onClear, variant = "mobile" }) {
  const isMobile = variant === "mobile";

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
      <input
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search chats"
        className={cn(
          "h-11 w-full pr-9 pl-10 text-sm text-[#111827] outline-none placeholder:text-[#94A3B8]",
          isMobile
            ? "focus:ring-primary/10 rounded-full border-0 bg-[#F3F4F6] focus:bg-[#EEF0F4] focus:ring-2"
            : "focus:border-primary/30 focus:ring-primary/10 rounded-lg border border-[#E8EDF5] bg-white focus:ring-2",
        )}
      />
      {query ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[#94A3B8] hover:bg-[#F5F5F5]"
          aria-label="Clear search"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function ForwardMessageModal({
  open,
  onOpenChange,
  message,
  conversations,
  currentConversationId,
  onForward,
  isSubmitting = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const wasOpenRef = useRef(false);

  const availableConversations = useMemo(
    () =>
      conversations.filter((conversation) => conversation.id !== currentConversationId),
    [conversations, currentConversationId],
  );

  const filteredConversations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return availableConversations;

    return availableConversations.filter((conversation) =>
      conversation.participantName.toLowerCase().includes(normalized),
    );
  }, [availableConversations, query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      setQuery("");
      setSelectedIds([]);
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onOpenChange?.(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const toggleConversation = (conversationId) => {
    setSelectedIds((current) =>
      current.includes(conversationId)
        ? current.filter((id) => id !== conversationId)
        : [...current, conversationId],
    );
  };

  const handleSend = async () => {
    if (!selectedIds.length || !onForward) return;
    await onForward(selectedIds);
  };

  const handleClose = () => onOpenChange?.(false);

  if (!open || !mounted) return null;

  const modal = (
    <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] md:bg-black/40 md:backdrop-blur-none"
        onClick={handleClose}
        aria-label="Close forward dialog"
      />

      {/* Mobile — Figma bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="forward-message-title-mobile"
        className="relative flex max-h-[min(88dvh,680px)] min-h-0 w-full flex-col overflow-hidden rounded-t-[1.375rem] bg-white shadow-[0_-10px_40px_rgba(15,23,42,0.14)] md:hidden"
      >
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <span className="h-1 w-9 rounded-full bg-[#E2E8F0]" aria-hidden />
        </div>

        <div className="shrink-0 px-5 pt-1 pb-3">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="forward-message-title-mobile"
              className="text-[18px] font-bold text-[#111827]"
            >
              Forward message
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-9 items-center justify-center rounded-full bg-[#F2F4F7] text-[#64748B] transition-colors hover:bg-[#E8EBF0]"
              aria-label="Close"
            >
              <X className="size-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="shrink-0 px-5 pb-3">
          <SearchField
            variant="mobile"
            query={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
          />
        </div>

        <div className="scrollbar-hide min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain">
          <ConversationList
            variant="mobile"
            conversations={filteredConversations}
            selectedIds={selectedIds}
            isSubmitting={isSubmitting}
            onToggle={toggleConversation}
          />
        </div>

        <div className="shrink-0 bg-white px-5 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <ForwardSendButton
            variant="mobile"
            selectedCount={selectedIds.length}
            isSubmitting={isSubmitting}
            onClick={handleSend}
          />
        </div>
      </div>

      {/* Desktop / webview — centered modal with card selection */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="forward-message-title-desktop"
        className="relative hidden h-[min(560px,86vh)] w-full max-w-[420px] min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.2)] md:flex"
      >
        <div className="shrink-0 border-b border-[#F0F0F0] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="forward-message-title-desktop"
              className="text-[16px] font-bold text-[#111827]"
            >
              Forward message
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="flex size-8 items-center justify-center rounded-full bg-[#F2F4F7] text-[#64748B] transition-colors hover:bg-[#E8EBF0]"
              aria-label="Close"
            >
              <X className="size-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-b border-[#F0F0F0] px-5 py-3">
          <SearchField
            variant="desktop"
            query={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
          />
        </div>

        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <ConversationList
            variant="desktop"
            conversations={filteredConversations}
            selectedIds={selectedIds}
            isSubmitting={isSubmitting}
            onToggle={toggleConversation}
          />
        </div>

        <div className="shrink-0 border-t border-[#F0F0F0] px-5 py-4">
          <ForwardSendButton
            variant="desktop"
            selectedCount={selectedIds.length}
            isSubmitting={isSubmitting}
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

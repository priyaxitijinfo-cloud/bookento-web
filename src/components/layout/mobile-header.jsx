"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  MOBILE_HEADER_BACK_CLASS,
  MOBILE_HEADER_BACK_TITLE_GROUP_CLASS,
  MOBILE_HEADER_CLASS,
  MOBILE_HEADER_DESKTOP_CLASS,
  MOBILE_HEADER_INNER_CLASS,
  MOBILE_HEADER_ONLY_CLASS,
  MOBILE_HEADER_TITLE_CLASS,
} from "@/lib/layout/mobile-header.constants";
import { cn } from "@/lib/utils";

function MobileHeaderBackButton({ backHref, onBack, showBack, backLabel = "Go back" }) {
  const router = useRouter();
  const showBackButton = Boolean(backHref || showBack || onBack);

  if (!showBackButton) {
    return null;
  }

  if (onBack) {
    return (
      <button
        type="button"
        onClick={onBack}
        className={MOBILE_HEADER_BACK_CLASS}
        aria-label={backLabel}
      >
        <ArrowLeft className="size-5" strokeWidth={2.25} />
      </button>
    );
  }

  if (backHref) {
    return (
      <Link href={backHref} className={MOBILE_HEADER_BACK_CLASS} aria-label={backLabel}>
        <ArrowLeft className="size-5" strokeWidth={2.25} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={MOBILE_HEADER_BACK_CLASS}
      aria-label={backLabel}
    >
      <ArrowLeft className="size-5" strokeWidth={2.25} />
    </button>
  );
}

export function MobileHeaderBar({
  title,
  backHref,
  showBack = false,
  onBack,
  backLabel,
  rightAction,
  titleCentered = false,
  hideBackPlaceholder = false,
  innerClassName,
  children,
}) {
  const showBackButton = Boolean(backHref || showBack || onBack);
  const backControl = (
    <MobileHeaderBackButton
      backHref={backHref}
      onBack={onBack}
      showBack={showBack}
      backLabel={backLabel}
    />
  );

  if (children) {
    return (
      <div className={cn(MOBILE_HEADER_INNER_CLASS, innerClassName)}>{children}</div>
    );
  }

  if (titleCentered) {
    return (
      <div className={cn(MOBILE_HEADER_INNER_CLASS, "justify-between", innerClassName)}>
        <div className={MOBILE_HEADER_BACK_TITLE_GROUP_CLASS}>
          {showBackButton ? (
            backControl
          ) : hideBackPlaceholder ? null : (
            <span className="size-9 shrink-0" aria-hidden />
          )}
          <h1 className={MOBILE_HEADER_TITLE_CLASS}>{title}</h1>
        </div>
        {rightAction ? (
          <div className="flex shrink-0 items-center">{rightAction}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn(MOBILE_HEADER_INNER_CLASS, "justify-between", innerClassName)}>
      <div className={MOBILE_HEADER_BACK_TITLE_GROUP_CLASS}>
        {backControl}
        <h1 className={MOBILE_HEADER_TITLE_CLASS}>{title || "Bookento"}</h1>
      </div>
      {rightAction ? (
        <div className="flex shrink-0 items-center gap-1">{rightAction}</div>
      ) : null}
    </div>
  );
}

export function MobileHeader({
  title,
  backHref,
  showBack = false,
  onBack,
  backLabel,
  rightAction,
  titleCentered = false,
  mobileOnly = true,
  className,
  innerClassName,
  children,
}) {
  return (
    <header
      className={cn(
        MOBILE_HEADER_CLASS,
        mobileOnly ? MOBILE_HEADER_ONLY_CLASS : MOBILE_HEADER_DESKTOP_CLASS,
        className,
      )}
    >
      {children ?? (
        <MobileHeaderBar
          title={title}
          backHref={backHref}
          showBack={showBack}
          onBack={onBack}
          backLabel={backLabel}
          rightAction={rightAction}
          titleCentered={titleCentered}
          innerClassName={innerClassName}
        />
      )}
    </header>
  );
}

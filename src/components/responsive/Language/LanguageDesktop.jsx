"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";

import { LanguageMobileOptionsList } from "./language-parts";

/** Web / desktop — Help-style webview layout with same language cards as mobile */
export function LanguageDesktop({ backHref, selectedCode, onSelect, onSave, saving }) {
  return (
    <UserPageShell
      title="Language"
      backHref={backHref}
      backLabel="Back to Profile"
      showBottomNav={false}
      showDesktopHeader={true}
      showBreadcrumb={true}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page md:!bg-surface-page hidden md:block"
      mainClassName="mx-auto max-w-lg px-4 pb-28 md:max-w-7xl md:px-6"
    >
      <div className="mx-auto w-full max-w-2xl space-y-3 md:max-w-none">
        <LanguageMobileOptionsList selectedCode={selectedCode} onSelect={onSelect} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E6EAF2] bg-white px-4 py-4 md:px-6">
        <div className="mx-auto w-full max-w-lg md:max-w-7xl">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex h-[3.25rem] w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#58A1FF] to-[#1E57EA] text-base font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </UserPageShell>
  );
}

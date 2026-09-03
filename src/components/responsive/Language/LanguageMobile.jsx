"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";

import { LanguageMobileOptionsList } from "./language-parts";

export function LanguageMobile({ backHref, selectedCode, onSelect, onSave, saving }) {
  return (
    <UserPageShell
      title="Language"
      backHref={backHref}
      backLabel="Back to Profile"
      showBottomNav={false}
      showDesktopHeader={false}
      showBreadcrumb={false}
      containerVariant="browse"
      className="bg-surface-page max-md:!pb-0 md:hidden"
      headerClassName="max-md:border-transparent"
      mainClassName="space-y-3 pb-28 max-md:!pt-4"
    >
      <LanguageMobileOptionsList selectedCode={selectedCode} onSelect={onSelect} />

      <div className="fixed inset-x-0 bottom-0 z-20 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex h-[51px] w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#58A1FF] to-[#1E57EA] text-[16px] font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </UserPageShell>
  );
}

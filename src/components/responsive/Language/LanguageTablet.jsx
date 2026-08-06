"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";

import { LanguageOptionsList } from "./language-parts";

export function LanguageTablet({ backHref, selectedCode, onSelect, onSave, saving }) {
  return (
    <UserPageShell
      title="Languages"
      backHref={backHref}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="mx-auto max-w-2xl space-y-6 pb-28"
    >
      <LanguageOptionsList selectedCode={selectedCode} onSelect={onSelect} />

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm md:bottom-0">
        <div className="mx-auto max-w-2xl">
          <PrimaryButton fullWidth onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </UserPageShell>
  );
}

"use client";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";

import { LanguageOptionsList } from "./language-parts";

export function LanguageMobile({ backHref, selectedCode, onSelect, onSave, saving }) {
  return (
    <UserPageShell
      title="Languages"
      backHref={backHref}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="space-y-6 pb-28"
    >
      <LanguageOptionsList selectedCode={selectedCode} onSelect={onSelect} />

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <PrimaryButton fullWidth onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </PrimaryButton>
      </div>
    </UserPageShell>
  );
}

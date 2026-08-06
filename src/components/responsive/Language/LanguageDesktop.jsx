"use client";

import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { PrimaryButton } from "@/components/responsive/primitives/PrimaryButton";
import { ROUTES } from "@/constants/routes.constants";

import { LanguageOptionsList } from "./language-parts";

export function LanguageDesktop({ backHref, selectedCode, onSelect, onSave, saving }) {
  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={backHref ?? ROUTES.PROFILE}
          backLabel="Back to Profile"
          currentLabel="Languages"
        />
      )}
    >
      <ResponsiveCard className="space-y-6">
        <LanguageOptionsList selectedCode={selectedCode} onSelect={onSelect} />
        <PrimaryButton fullWidth onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </PrimaryButton>
      </ResponsiveCard>
    </DesktopLayout>
  );
}

"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { LanguageOptionsList } from "@/components/profile/language-options";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { Button } from "@/components/ui/button";
import { resolveBackNavigation } from "@/lib/navigation/back-navigation";
import { useUserProfileStore } from "@/store";

function LanguagePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, updateProfile } = useUserProfileStore();
  const [selectedCode, setSelectedCode] = useState(profile.preferences?.language ?? "en");
  const [saving, setSaving] = useState(false);

  const backHref = useMemo(
    () => resolveBackNavigation(searchParams.get("from"), "profile").href,
    [searchParams],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({
        preferences: {
          ...profile.preferences,
          language: selectedCode,
        },
      });

      if (result?.success === false) {
        toast.error("Could not save language preference");
        return;
      }

      toast.success("Language updated");
      router.push(backHref);
    } catch {
      toast.error("Could not save language preference");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserPageShell
      title="Languages"
      backHref={backHref}
      backLabel="Back to Profile"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      mainClassName="space-y-6 pb-28"
    >
      <LanguageOptionsList selectedCode={selectedCode} onSelect={setSelectedCode} />

      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm md:bottom-6 md:left-auto md:right-auto md:mx-auto md:max-w-3xl">
        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </UserPageShell>
  );
}

export default function LanguagePage() {
  return (
    <Suspense fallback={null}>
      <LanguagePageContent />
    </Suspense>
  );
}

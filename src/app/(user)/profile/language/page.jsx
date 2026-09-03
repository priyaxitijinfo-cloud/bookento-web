"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { LanguageDesktop } from "@/components/responsive/Language/LanguageDesktop";
import { LanguageMobile } from "@/components/responsive/Language/LanguageMobile";
import { resolveBackNavigation } from "@/lib/navigation/back-navigation";
import { useUserProfileStore } from "@/store";

function LanguagePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, updateProfile } = useUserProfileStore();
  const [selectedCode, setSelectedCode] = useState(
    profile.preferences?.language ?? "en",
  );
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

  const sharedProps = {
    backHref,
    selectedCode,
    onSelect: setSelectedCode,
    onSave: handleSave,
    saving,
  };

  return (
    <>
      <LanguageMobile {...sharedProps} />
      <LanguageDesktop {...sharedProps} />
    </>
  );
}

export default function LanguagePage() {
  return (
    <Suspense fallback={null}>
      <LanguagePageContent />
    </Suspense>
  );
}

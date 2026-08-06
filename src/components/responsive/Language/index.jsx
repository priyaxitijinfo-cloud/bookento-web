"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { resolveBackNavigation } from "@/lib/navigation/back-navigation";
import { useUserProfileStore } from "@/store";

import { LanguageDesktop } from "./LanguageDesktop";
import { LanguageMobile } from "./LanguageMobile";
import { LanguageTablet } from "./LanguageTablet";

export function LanguageResponsive() {
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

  const sharedProps = {
    backHref,
    selectedCode,
    onSelect: setSelectedCode,
    onSave: handleSave,
    saving,
  };

  return (
    <ResponsiveView
      mobile={<LanguageMobile {...sharedProps} />}
      tablet={<LanguageTablet {...sharedProps} />}
      desktop={<LanguageDesktop {...sharedProps} />}
    />
  );
}

export default LanguageResponsive;

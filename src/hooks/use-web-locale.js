"use client";

import { useEffect, useMemo } from "react";

import { formatMessage, getWebMessages } from "@/lib/i18n/web-messages";
import { useProfileStore } from "@/store";

/** Desktop web locale from profile language preference */
export function useWebLocale() {
  const language = useProfileStore(
    (state) => state.profile?.preferences?.language ?? "en",
  );
  const messages = useMemo(() => getWebMessages(language), [language]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = (key, vars) => {
    const template = messages[key] || getWebMessages("en")[key] || key;
    return vars ? formatMessage(template, vars) : template;
  };

  return { language, messages, t };
}

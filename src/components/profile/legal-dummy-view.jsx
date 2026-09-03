"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { resolveBackNavigation } from "@/lib/navigation/back-navigation";

export function LegalDummyView({ title, sections }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const backHref = useMemo(
    () => resolveBackNavigation(searchParams.get("from"), "profile").href,
    [searchParams],
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const redirectDesktop = () => {
      if (media.matches) router.replace(ROUTES.PROFILE);
    };
    redirectDesktop();
    media.addEventListener("change", redirectDesktop);
    return () => media.removeEventListener("change", redirectDesktop);
  }, [router]);

  return (
    <UserPageShell
      title={title}
      backHref={backHref}
      backLabel="Back to Profile"
      showBottomNav={false}
      showDesktopHeader={false}
      showBreadcrumb={false}
      containerVariant="browse"
      className="bg-surface-page max-md:!pb-6 md:hidden"
      headerClassName="max-md:border-transparent"
      mainClassName="space-y-4 pb-8 max-md:!pt-4"
    >
      <div className="rounded-2xl border border-[#EEEEEE] bg-white p-4 shadow-[0_1px_8px_rgba(16,24,40,0.04)]">
        <p className="text-[13px] leading-relaxed text-[#9CA3AF]">
          This is a placeholder page for demo purposes. Final content will be added
          later.
        </p>

        <div className="mt-4 space-y-4">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-[15px] font-semibold text-[#111827]">
                {section.heading}
              </h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#64748B]">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </UserPageShell>
  );
}

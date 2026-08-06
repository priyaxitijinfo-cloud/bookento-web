"use client";

import { ProviderBottomNav, ProviderSidebar } from "@/components/layout/provider-nav";

export default function ProviderLayout({ children }) {
  return (
    <div className="bg-background flex min-h-dvh">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-hidden pb-20 lg:pb-0">
        {children}
        <ProviderBottomNav />
      </div>
    </div>
  );
}

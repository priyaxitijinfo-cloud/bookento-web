"use client";

import { Suspense } from "react";

import { LegalDummyView } from "@/components/profile/legal-dummy-view";

const TERMS_SECTIONS = [
  {
    heading: "Using Bookento",
    body: "By using Bookento you agree to book services responsibly, provide accurate details, and follow applicable laws.",
  },
  {
    heading: "Bookings & payments",
    body: "Service availability, pricing, and cancellation rules may vary by provider. Please review booking details before confirming.",
  },
  {
    heading: "Account responsibility",
    body: "Keep your login details secure and notify us if you notice unauthorized activity on your account.",
  },
];

function TermsContent() {
  return <LegalDummyView title="Terms & conditions" sections={TERMS_SECTIONS} />;
}

export default function TermsPage() {
  return (
    <Suspense fallback={null}>
      <TermsContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";

import { LegalDummyView } from "@/components/profile/legal-dummy-view";

const PRIVACY_SECTIONS = [
  {
    heading: "Information we collect",
    body: "We may collect account details, booking history, device info, and usage data to improve Bookento services.",
  },
  {
    heading: "How we use your data",
    body: "Your data helps us process bookings, send updates, personalize recommendations, and keep your account secure.",
  },
  {
    heading: "Your choices",
    body: "You can update profile preferences, manage notifications, and request account-related changes from settings.",
  },
];

function PrivacyContent() {
  return <LegalDummyView title="Privacy & data" sections={PRIVACY_SECTIONS} />;
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={null}>
      <PrivacyContent />
    </Suspense>
  );
}

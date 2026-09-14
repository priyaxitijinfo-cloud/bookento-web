"use client";

/**
 * Compact vector doctor for the side promo card.
 */
export function DoctorIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 180 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="docCoat"
          x1="40"
          y1="90"
          x2="140"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#E8F7EF" />
        </linearGradient>
        <linearGradient
          id="docSkin"
          x1="70"
          y1="20"
          x2="110"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F6D2B4" />
          <stop offset="1" stopColor="#E8B896" />
        </linearGradient>
      </defs>

      <circle cx="118" cy="48" r="34" fill="#C8F0D4" opacity="0.85" />
      <circle cx="42" cy="150" r="22" fill="#B8E8C8" opacity="0.55" />

      {/* Shoulders / coat */}
      <path d="M38 188c6-46 28-68 52-68s46 22 52 68" fill="url(#docCoat)" />
      <path d="M78 128v60h24v-60" fill="#1865EA" opacity="0.9" />
      <path d="M78 128c4 8 10 12 12 12s8-4 12-12" fill="#DCEBFF" />

      {/* Head */}
      <ellipse cx="90" cy="72" rx="28" ry="32" fill="url(#docSkin)" />
      {/* Hair */}
      <path
        d="M62 68c2-28 18-42 28-42 14 0 28 12 30 36-8-6-16-8-28-6-8 1-18 6-30 12z"
        fill="#2C3A4A"
      />
      {/* Eyes / smile */}
      <circle cx="80" cy="74" r="2.2" fill="#1A2433" />
      <circle cx="100" cy="74" r="2.2" fill="#1A2433" />
      <path
        d="M82 88c4 5 12 5 16 0"
        stroke="#C4846A"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Stethoscope */}
      <path
        d="M62 132c-10 8-14 22-12 34"
        stroke="#5EB12D"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M118 132c10 8 14 22 12 34"
        stroke="#5EB12D"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="62" cy="132" r="5" fill="#5EB12D" />
      <circle cx="118" cy="132" r="5" fill="#5EB12D" />
      <circle cx="50" cy="168" r="7" fill="#37B8FF" stroke="#1865EA" strokeWidth="2" />

      {/* Plus marks */}
      <path
        d="M148 36v12M142 42h12"
        stroke="#5EB12D"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M28 56v8M24 60h8"
        stroke="#37B8FF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

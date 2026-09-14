"use client";

/**
 * Compact vector salon stylist for the side promo card.
 */
export function SalonIllustration({ className }) {
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
          id="salonSkin"
          x1="70"
          y1="24"
          x2="120"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F3C4A8" />
          <stop offset="1" stopColor="#E0A888" />
        </linearGradient>
        <linearGradient
          id="salonHair"
          x1="50"
          y1="10"
          x2="130"
          y2="110"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5C2A2A" />
          <stop offset="1" stopColor="#2A1212" />
        </linearGradient>
        <linearGradient
          id="salonTop"
          x1="50"
          y1="120"
          x2="130"
          y2="190"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF7A93" />
          <stop offset="1" stopColor="#FF4766" />
        </linearGradient>
      </defs>

      <circle cx="130" cy="52" r="36" fill="#FFD6DE" opacity="0.9" />
      <circle cx="36" cy="148" r="20" fill="#FFE0E6" opacity="0.7" />

      {/* Body */}
      <path d="M42 192c8-48 28-70 48-70s40 22 48 70" fill="url(#salonTop)" />
      <ellipse cx="90" cy="128" rx="22" ry="10" fill="#FF9AAD" />

      {/* Head */}
      <ellipse cx="90" cy="74" rx="26" ry="30" fill="url(#salonSkin)" />

      {/* Hair volume */}
      <path
        d="M54 78c-4-36 18-58 36-58 22 0 40 18 42 48-10-14-22-18-36-14-12 4-26 12-42 24z"
        fill="url(#salonHair)"
      />
      <path
        d="M52 90c8 18 14 34 12 52M128 88c-6 18-10 34-6 52"
        stroke="url(#salonHair)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Face */}
      <circle cx="80" cy="76" r="2.1" fill="#1A2433" />
      <circle cx="100" cy="76" r="2.1" fill="#1A2433" />
      <path
        d="M84 90c3 4 9 4 12 0"
        stroke="#C4846A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="74" cy="84" r="3.5" fill="#FF8FA3" opacity="0.45" />
      <circle cx="106" cy="84" r="3.5" fill="#FF8FA3" opacity="0.45" />

      {/* Hair dryer */}
      <g transform="translate(118 108) rotate(-18)">
        <rect x="0" y="8" width="34" height="14" rx="7" fill="#2C3A4A" />
        <path d="M34 10h16c6 0 10 3 10 7s-4 7-10 7H34" fill="#58A1FF" />
        <rect x="10" y="22" width="8" height="22" rx="4" fill="#1A2433" />
      </g>

      {/* Sparkles */}
      <path
        d="M148 28l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"
        fill="#FF4766"
        opacity="0.75"
      />
      <circle cx="28" cy="44" r="3" fill="#FFAF2A" opacity="0.7" />
    </svg>
  );
}

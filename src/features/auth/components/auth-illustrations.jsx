export function LoginIllustration({ className = "h-[168px] w-[200px]" }) {
  return (
    <svg
      viewBox="0 0 220 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M38 158c18 12 126 12 144 0 8-5 10-14 4-18-18 10-116 10-148 0-6 4-4 13 0 18Z"
        fill="#DCE8FF"
      />
      <rect x="34" y="38" width="152" height="112" rx="22" fill="url(#login-card)" />
      <rect x="34" y="38" width="152" height="28" rx="14" fill="url(#login-bar)" />
      <circle cx="52" cy="52" r="4" fill="#FF8A80" />
      <circle cx="66" cy="52" r="4" fill="#FFD54F" />
      <circle cx="80" cy="52" r="4" fill="#81C784" />
      <circle cx="110" cy="102" r="28" fill="url(#login-avatar)" />
      <circle cx="110" cy="92" r="11" fill="white" />
      <path d="M90 120c3-12 13-18 20-18s17 6 20 18" fill="white" />
      <rect x="78" y="128" width="64" height="8" rx="4" fill="#E3EEFF" />
      <circle cx="86" cy="132" r="2.2" fill="#9BB8F0" />
      <circle cx="96" cy="132" r="2.2" fill="#9BB8F0" />
      <circle cx="106" cy="132" r="2.2" fill="#9BB8F0" />
      <circle cx="116" cy="132" r="2.2" fill="#9BB8F0" />
      <circle cx="126" cy="132" r="2.2" fill="#9BB8F0" />
      <g transform="translate(148 28)">
        <circle cx="22" cy="22" r="20" fill="url(#login-lock)" />
        <rect x="14" y="20" width="16" height="13" rx="3" fill="white" />
        <path
          d="M18 20v-3.5a6 6 0 0 1 12 0V20"
          stroke="white"
          strokeWidth="2.4"
          fill="none"
        />
      </g>
      <path d="M28 64l7-3 3 7-7 3-3-7Z" fill="#5AA0FF" />
      <path d="M186 78l6 2 2 6-6 2-2-6Z" fill="#FFD54F" />
      <path
        d="M48 24l1.6 4.2L54 30l-4.4 1.8L48 36l-1.6-4.2L42 30l4.4-1.8L48 24Z"
        fill="#5AA0FF"
      />
      <path
        d="M176 18l1.4 3.6L181 23l-3.6 1.4L176 28l-1.4-3.6L171 23l3.6-1.4L176 18Z"
        fill="#FFD54F"
      />
      <defs>
        <linearGradient
          id="login-card"
          x1="34"
          y1="38"
          x2="186"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F4F8FF" />
          <stop offset="1" stopColor="#E4EEFF" />
        </linearGradient>
        <linearGradient
          id="login-bar"
          x1="34"
          y1="38"
          x2="186"
          y2="66"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7CB4FF" />
          <stop offset="1" stopColor="#2F6FF0" />
        </linearGradient>
        <linearGradient
          id="login-avatar"
          x1="82"
          y1="74"
          x2="138"
          y2="130"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7CB4FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="login-lock"
          x1="2"
          y1="2"
          x2="42"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7CB4FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OtpIllustration({ className = "h-[168px] w-[200px]" }) {
  return (
    <svg
      viewBox="0 0 220 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M40 158c18 12 122 12 140 0 8-5 10-14 4-18-18 10-112 10-144 0-6 4-4 13 0 18Z"
        fill="#DCE8FF"
      />
      <path
        d="M48 46c0-16 14-30 42-30h40c28 0 42 14 42 30v48c0 16-14 30-42 30H96l-22 18 6-18c-18-4-32-16-32-30V46Z"
        fill="url(#otp-bubble)"
      />
      <circle cx="92" cy="78" r="8" fill="white" />
      <circle cx="116" cy="78" r="8" fill="white" />
      <circle cx="140" cy="78" r="8" fill="white" />
      <g transform="translate(132 96)">
        <path
          d="M18 10c0-12 8-22 22-22s22 10 22 22c0 18-10 28-22 46C28 38 18 28 18 10Z"
          fill="url(#otp-bell)"
        />
        <ellipse cx="40" cy="10" rx="18" ry="16" fill="#FFE27A" />
        <rect x="36" y="48" width="8" height="8" rx="4" fill="#F5C542" />
        <circle cx="40" cy="6" r="5" fill="#FFF6C2" />
      </g>
      <path d="M36 58l7-3 3 7-7 3-3-7Z" fill="#5AA0FF" />
      <path
        d="M168 28l1.6 4.2L174 34l-4.4 1.8L168 40l-1.6-4.2L162 34l4.4-1.8L168 28Z"
        fill="#FFD54F"
      />
      <path
        d="M52 24l1.4 3.6L57 29l-3.6 1.4L52 34l-1.4-3.6L47 29l3.6-1.4L52 24Z"
        fill="#5AA0FF"
      />
      <defs>
        <linearGradient
          id="otp-bubble"
          x1="48"
          y1="16"
          x2="172"
          y2="130"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7CB4FF" />
          <stop offset="1" stopColor="#1E57EA" />
        </linearGradient>
        <linearGradient
          id="otp-bell"
          x1="18"
          y1="-12"
          x2="62"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFE27A" />
          <stop offset="1" stopColor="#F5B400" />
        </linearGradient>
      </defs>
    </svg>
  );
}

"use client";

import { FloatingCategoryIcon } from "@/components/home/feature-promo/floating-category-icon";

/**
 * Multi-professional vector scene for the main hero card.
 * Stylized characters only — no raster images.
 */
export function ServiceIllustration({ className }) {
  return (
    <div className={className} aria-hidden>
      <div className="relative mx-auto aspect-[1.05/1] w-full max-w-[26rem]">
        {/* Soft abstract blobs */}
        <span className="absolute top-[8%] right-[6%] size-40 rounded-full bg-[#E8DDFF]/70 blur-2xl" />
        <span className="absolute bottom-[10%] left-[4%] size-36 rounded-full bg-[#D7ECFF]/80 blur-2xl" />
        <span className="absolute top-[42%] left-[18%] size-24 rounded-full bg-[#FFE0EC]/60 blur-xl" />

        {/* Decorative rings */}
        <span className="absolute top-[14%] left-[12%] size-16 rounded-full border border-[#B8D4FF]/60" />
        <span className="absolute right-[18%] bottom-[22%] size-10 rounded-full border border-[#E8B4FF]/50" />

        {/* Stars / dots */}
        <svg
          className="absolute top-[10%] right-[28%] size-5 text-[#FF4766]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 1.5l1.8 5.4H17l-4.2 3.2 1.6 5.4L10 12.6 5.6 15.5l1.6-5.4L3 6.9h5.2L10 1.5z" />
        </svg>
        <span className="absolute top-[28%] left-[8%] size-2 rounded-full bg-[#1865EA]/50" />
        <span className="absolute top-[38%] right-[10%] size-1.5 rounded-full bg-[#E046FF]/55" />
        <span className="absolute bottom-[18%] left-[28%] size-2 rounded-full bg-[#5EB12D]/45" />

        {/* Character composition */}
        <svg
          viewBox="0 0 420 400"
          className="absolute inset-0 h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skinA" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#F6D2B4" />
              <stop offset="1" stopColor="#E8B896" />
            </linearGradient>
            <linearGradient id="skinB" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#C98B63" />
              <stop offset="1" stopColor="#A86B45" />
            </linearGradient>
            <linearGradient id="skinC" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#F0C4A8" />
              <stop offset="1" stopColor="#DEB08F" />
            </linearGradient>
            <linearGradient
              id="fitTop"
              x1="160"
              y1="200"
              x2="260"
              y2="360"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#58A1FF" />
              <stop offset="1" stopColor="#1865EA" />
            </linearGradient>
            <linearGradient
              id="docCoatMain"
              x1="40"
              y1="180"
              x2="120"
              y2="340"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#EAF4FF" />
            </linearGradient>
            <linearGradient
              id="salonDress"
              x1="300"
              y1="190"
              x2="380"
              y2="340"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF8FA3" />
              <stop offset="1" stopColor="#FF4766" />
            </linearGradient>
          </defs>

          {/* Platform shadow */}
          <ellipse cx="210" cy="362" rx="120" ry="16" fill="#1865EA" opacity="0.1" />

          {/* Doctor — back left */}
          <g transform="translate(28 110)">
            <path d="M18 170c4-42 22-62 42-62s38 20 42 62" fill="url(#docCoatMain)" />
            <path d="M48 116v54h24v-54" fill="#1865EA" />
            <ellipse cx="60" cy="68" rx="24" ry="28" fill="url(#skinA)" />
            <path
              d="M36 62c2-24 14-34 24-34 12 0 24 10 26 30-8-6-14-8-24-6-8 2-16 6-26 10z"
              fill="#1F2A37"
            />
            <circle cx="52" cy="70" r="1.8" fill="#1A2433" />
            <circle cx="68" cy="70" r="1.8" fill="#1A2433" />
            <path
              d="M54 82c3 3.5 9 3.5 12 0"
              stroke="#C4846A"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M28 120c-8 6-12 18-10 28"
              stroke="#37B8FF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="18" cy="150" r="5" fill="#37B8FF" />
          </g>

          {/* Tutor — mid-back */}
          <g transform="translate(118 88) scale(0.86)">
            <path d="M30 180c6-48 24-70 44-70s38 22 44 70" fill="#FFAF2A" />
            <path d="M48 118h52l-6 28H54z" fill="#FFF4DF" />
            <ellipse cx="74" cy="70" rx="24" ry="27" fill="url(#skinC)" />
            <path
              d="M50 64c4-26 16-38 24-38 14 0 26 14 28 36-10-8-18-10-28-8s-16 6-24 10z"
              fill="#6B3E26"
            />
            <circle cx="66" cy="72" r="1.8" fill="#1A2433" />
            <circle cx="82" cy="72" r="1.8" fill="#1A2433" />
            <rect
              x="98"
              y="108"
              width="28"
              height="34"
              rx="3"
              fill="#FFF8EC"
              stroke="#E8C98A"
              strokeWidth="2"
            />
            <path
              d="M102 118h20M102 126h16"
              stroke="#D4A84B"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Homecare — far right back */}
          <g transform="translate(286 126) scale(0.82)">
            <path
              d="M20 160c5-40 20-58 40-58s35 18 40 58"
              fill="#E046FF"
              opacity="0.92"
            />
            <ellipse cx="60" cy="62" rx="22" ry="25" fill="url(#skinB)" />
            <path
              d="M38 58c2-20 12-30 22-30 12 0 22 10 24 28-8-4-14-6-22-4-8 2-16 4-24 6z"
              fill="#1A1A1A"
            />
            <circle cx="52" cy="64" r="1.6" fill="#1A2433" />
            <circle cx="68" cy="64" r="1.6" fill="#1A2433" />
            <rect
              x="78"
              y="100"
              width="16"
              height="36"
              rx="4"
              fill="#FBE8FF"
              stroke="#E046FF"
              strokeWidth="2"
            />
          </g>

          {/* Salon stylist — mid right */}
          <g transform="translate(258 96)">
            <path d="M22 180c6-48 24-70 44-70s38 22 44 70" fill="url(#salonDress)" />
            <ellipse cx="66" cy="68" rx="24" ry="28" fill="url(#skinC)" />
            <path
              d="M38 72c-2-30 14-48 28-48 18 0 32 16 34 42-8-12-18-16-30-12-10 4-20 10-32 18z"
              fill="#3A1C1C"
            />
            <path
              d="M36 86c6 16 10 30 8 44M96 84c-4 16-8 30-4 44"
              stroke="#3A1C1C"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="58" cy="70" r="1.8" fill="#1A2433" />
            <circle cx="74" cy="70" r="1.8" fill="#1A2433" />
            <path
              d="M60 84c3 3.5 9 3.5 12 0"
              stroke="#C4846A"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* Central fitness pro */}
          <g transform="translate(148 78)">
            <path d="M24 250c8-70 30-100 62-100s54 30 62 100" fill="url(#fitTop)" />
            <path
              d="M48 168h76c4 18 4 36 0 54H48c-4-18-4-36 0-54z"
              fill="#0B1F3F"
              opacity="0.18"
            />
            {/* Arms */}
            <path
              d="M28 168c-18 8-28 28-24 46"
              stroke="#1865EA"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M128 168c18 8 28 28 24 46"
              stroke="#1865EA"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Dumbbell */}
            <g transform="translate(-8 198)">
              <rect x="0" y="8" width="54" height="10" rx="5" fill="#2C3A4A" />
              <rect x="-6" y="2" width="12" height="22" rx="3" fill="#1A2433" />
              <rect x="48" y="2" width="12" height="22" rx="3" fill="#1A2433" />
            </g>
            <ellipse cx="86" cy="72" rx="30" ry="34" fill="url(#skinB)" />
            <path
              d="M56 68c4-30 18-44 30-44 16 0 30 14 32 40-10-8-18-10-30-8-10 2-22 6-32 12z"
              fill="#1A1A1A"
            />
            <circle cx="76" cy="74" r="2.2" fill="#1A2433" />
            <circle cx="96" cy="74" r="2.2" fill="#1A2433" />
            <path
              d="M78 90c5 5 15 5 20 0"
              stroke="#8B5A3C"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* Floating category icons */}
        <FloatingCategoryIcon
          slug="doctor"
          size={50}
          delay="0s"
          className="top-[6%] left-[2%] max-sm:hidden"
        />
        <FloatingCategoryIcon
          slug="salon"
          size={46}
          delay="0.4s"
          className="top-[2%] right-[8%] max-sm:hidden"
        />
        <FloatingCategoryIcon
          slug="fitness"
          size={48}
          delay="0.8s"
          className="top-[34%] right-[-2%] max-sm:hidden"
        />
        <FloatingCategoryIcon
          slug="tutoring"
          size={44}
          delay="1.1s"
          className="bottom-[28%] left-[-4%] max-sm:hidden"
        />
        <FloatingCategoryIcon
          slug="pet-care"
          size={46}
          delay="0.6s"
          className="right-[4%] bottom-[12%] max-sm:hidden"
        />
        <FloatingCategoryIcon
          slug="homecare"
          size={44}
          delay="1.3s"
          className="bottom-[6%] left-[18%] max-sm:hidden"
        />
      </div>
    </div>
  );
}

import Image from "next/image";

import { cn } from "@/lib/utils";

/** App logo used as the web / webview auth panel mark */
export function AuthBrandLogo({ className, size = 120 }) {
  return (
    <Image
      src="/images/app-icon.jpg"
      alt="Bookento"
      width={size}
      height={size}
      className={cn(
        "rounded-[1.5rem] object-cover shadow-[0_14px_32px_rgba(24,101,234,0.22)] ring-1 ring-[#E5EAF3]",
        className,
      )}
      priority
    />
  );
}

export function LoginIllustration({ className }) {
  return (
    <Image
      src="/images/auth/login-illustration.png?v=12"
      alt=""
      width={1274}
      height={907}
      className={cn("h-auto w-[16.5rem] object-contain", className)}
      aria-hidden
      priority
      unoptimized
      quality={100}
    />
  );
}

export function OtpIllustration({ className }) {
  return (
    <Image
      src="/images/auth/otp-illustration.png?v=1"
      alt=""
      width={1200}
      height={794}
      className={cn("h-auto w-[16.5rem] object-contain", className)}
      aria-hidden
      priority
      unoptimized
      quality={100}
    />
  );
}

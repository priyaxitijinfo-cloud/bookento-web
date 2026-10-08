import Image from "next/image";

import { cn } from "@/lib/utils";

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

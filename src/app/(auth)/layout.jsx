import { AuthLayoutShell } from "@/features/auth/components/auth-layout-shell";

export default function AuthLayout({ children }) {
  return <AuthLayoutShell>{children}</AuthLayoutShell>;
}

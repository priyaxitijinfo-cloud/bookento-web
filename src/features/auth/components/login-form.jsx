"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes.constants";
import { USER_ROLES } from "@/constants/status.constants";
import { useUserAuthStore, useProviderAuthStore } from "@/store";

export function LoginForm({ role = USER_ROLES.USER }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userAuth = useUserAuthStore();
  const providerAuth = useProviderAuthStore();
  const isProvider = role === USER_ROLES.PROVIDER;
  const { login, loginAsGuest, isLoading } = isProvider ? providerAuth : userAuth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});

  const redirect = searchParams.get("redirect");
  const homeRoute = isProvider ? ROUTES.PROVIDER_HOME : ROUTES.HOME;

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(email);
    if (result.success) {
      toast.success("Welcome back!");
      router.push(redirect || homeRoute);
    }
  };

  const handleGuest = async () => {
    if (isProvider) return;
    await loginAsGuest();
    toast.success("Continuing as guest");
    router.push(ROUTES.HOME);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-primary text-3xl font-bold">{isProvider ? "Bookento Pro" : "Bookento"}</h1>
        <p className="text-muted-foreground mt-2">
          {isProvider ? "Sign in to your provider account" : "Welcome back! Sign in to continue"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" required error={errors.email}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
        </FormField>

        <FormField label="Password" required error={errors.password}>
          <PasswordInput
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </FormField>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded" />
            Remember me
          </label>
          <Link href={isProvider ? ROUTES.PROVIDER_FORGOT_PASSWORD : ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="border-border w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background text-muted-foreground px-2">Or continue with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" onClick={() => toast.info("Google sign-in coming soon")}>
          Google
        </Button>
        <Button variant="outline" type="button" onClick={() => toast.info("Apple sign-in coming soon")}>
          Apple
        </Button>
      </div>

      {!isProvider && (
        <Button variant="ghost" className="w-full" onClick={handleGuest}>
          Continue as Guest
        </Button>
      )}

      <p className="text-muted-foreground text-center text-sm">
        {isProvider ? (
          <>New provider? <Link href={ROUTES.PROVIDER_REGISTER} className="text-primary font-medium hover:underline">Register here</Link></>
        ) : (
          <>Don&apos;t have an account? <Link href={ROUTES.PROVIDER_REGISTER} className="text-primary font-medium hover:underline">Become a Provider</Link></>
        )}
      </p>

      {isProvider ? (
        <p className="text-muted-foreground text-center text-sm">
          Looking for services? <Link href={ROUTES.USER_LOGIN} className="text-primary font-medium hover:underline">User Login</Link>
        </p>
      ) : (
        <p className="text-muted-foreground text-center text-sm">
          Are you a provider? <Link href={ROUTES.PROVIDER_LOGIN} className="text-primary font-medium hover:underline">Provider Login</Link>
        </p>
      )}
    </div>
  );
}

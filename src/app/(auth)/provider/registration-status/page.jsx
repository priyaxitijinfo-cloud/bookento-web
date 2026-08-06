"use client";

import Link from "next/link";
import { Clock, Mail, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes.constants";

export default function ProviderRegistrationStatusPage() {
  return (
    <div className="w-full max-w-lg space-y-6 text-center">
      <div>
        <h1 className="gradient-brand-text text-3xl font-bold">Bookento Pro</h1>
        <p className="text-muted-foreground mt-2">Provider Registration</p>
      </div>

      <Card>
        <CardHeader>
          <div className="bg-warning/10 text-warning mx-auto mb-2 flex size-16 items-center justify-center rounded-full">
            <Clock className="size-8" />
          </div>
          <CardTitle>Application Under Review</CardTitle>
          <CardDescription>
            Thank you for registering! Our team is reviewing your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-xl border bg-muted/30 p-4 text-left text-sm">
            <p className="font-medium">What happens next?</p>
            <ul className="text-muted-foreground mt-2 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-primary mt-1 size-1.5 shrink-0 rounded-full" />
                Document verification (24-48 hours)
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary mt-1 size-1.5 shrink-0 rounded-full" />
                Business profile review by our team
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary mt-1 size-1.5 shrink-0 rounded-full" />
                Email notification upon approval
              </li>
            </ul>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <Mail className="size-4" />
            Updates sent to your registered email
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" asChild>
              <Link href={ROUTES.PROVIDER_LOGIN}>Back to Login</Link>
            </Button>
            <Button variant="ghost">
              <RefreshCw className="size-4" /> Check Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

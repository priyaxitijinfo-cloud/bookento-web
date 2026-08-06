"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft, ArrowRight, Building2, CheckCircle2, FileText,
  Landmark, MapPin, Shield, Upload,
} from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes.constants";
import { categories } from "@/mock/categories";
import { providerTypes } from "@/mock/settings";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Account", icon: Shield },
  { id: 2, title: "Verify OTP", icon: Shield },
  { id: 3, title: "Business", icon: Building2 },
  { id: 4, title: "Location", icon: MapPin },
  { id: 5, title: "Type", icon: Building2 },
  { id: 6, title: "Category", icon: FileText },
  { id: 7, title: "Bank", icon: Landmark },
  { id: 8, title: "Documents", icon: Upload },
  { id: 9, title: "Preview", icon: FileText },
  { id: 10, title: "Complete", icon: CheckCircle2 },
];

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  otp: "",
  businessName: "",
  ownerName: "",
  phone: "",
  description: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  providerType: "",
  categoryId: "",
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  ifsc: "",
  upi: "",
  documents: { idProof: false, businessProof: false, addressProof: false },
};

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.email) e.email = "Email is required";
      if (!form.password) e.password = "Password is required";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    }
    if (step === 2 && form.otp.length !== 6) e.otp = "Enter 6-digit OTP";
    if (step === 3) {
      if (!form.businessName) e.businessName = "Required";
      if (!form.ownerName) e.ownerName = "Required";
      if (!form.phone) e.phone = "Required";
    }
    if (step === 4) {
      if (!form.address) e.address = "Required";
      if (!form.city) e.city = "Required";
      if (!form.pincode) e.pincode = "Required";
    }
    if (step === 5 && !form.providerType) e.providerType = "Select provider type";
    if (step === 6 && !form.categoryId) e.categoryId = "Select category";
    if (step === 7) {
      if (!form.bankName) e.bankName = "Required";
      if (!form.accountNumber) e.accountNumber = "Required";
      if (!form.ifsc) e.ifsc = "Required";
    }
    if (step === 8) {
      const docs = form.documents;
      if (!docs.idProof || !docs.businessProof) e.documents = "Upload required documents";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 2) toast.success("OTP verified");
    if (step < 10) setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    toast.success("Registration submitted for review!");
    router.push(ROUTES.PROVIDER_REGISTRATION_STATUS);
  };

  const categoryOptions = categories.slice(0, 15).map((c) => ({ value: c.id, label: c.name }));
  const typeOptions = providerTypes.map((t) => ({ value: t.id, label: t.name }));

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <Link href={ROUTES.PROVIDER_LOGIN} className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="size-4" /> Back to login
        </Link>
        <h1 className="gradient-brand-text text-3xl font-bold">Become a Provider</h1>
        <p className="text-muted-foreground mt-2">Join Bookento and grow your business</p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {STEPS.map(({ id, title }) => (
          <div
            key={id}
            className={cn(
              "shrink-0 rounded-lg px-2 py-1 text-[10px] font-medium sm:text-xs",
              step === id ? "gradient-brand text-white" : step > id ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
            )}
          >
            {id}. {title}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {step}: {STEPS[step - 1].title}</CardTitle>
          <CardDescription>
            {step === 1 && "Create your provider account credentials"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Tell us about your business"}
            {step === 4 && "Where is your business located?"}
            {step === 5 && "What type of provider are you?"}
            {step === 6 && "Select your primary service category"}
            {step === 7 && "Bank details for payouts"}
            {step === 8 && "Upload verification documents"}
            {step === 9 && "Review your registration details"}
            {step === 10 && "You're all set!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <FormField label="Email" required error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@business.com" />
              </FormField>
              <FormField label="Password" required error={errors.password}>
                <PasswordInput value={form.password} onChange={(e) => update("password", e.target.value)} />
              </FormField>
              <FormField label="Confirm Password" required error={errors.confirmPassword}>
                <PasswordInput value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
              </FormField>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-muted-foreground text-sm">We sent a code to <strong>{form.email || "your email"}</strong></p>
              <FormField label="OTP Code" required error={errors.otp}>
                <Input
                  value={form.otp}
                  onChange={(e) => update("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-[0.5em]"
                  maxLength={6}
                />
              </FormField>
              <Button variant="link" type="button" onClick={() => toast.info("OTP resent")}>Resend OTP</Button>
            </>
          )}

          {step === 3 && (
            <>
              <FormField label="Business Name" required error={errors.businessName}>
                <Input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
              </FormField>
              <FormField label="Owner Name" required error={errors.ownerName}>
                <Input value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
              </FormField>
              <FormField label="Phone" required error={errors.phone}>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
              </FormField>
              <FormField label="Description">
                <Input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Brief about your business" />
              </FormField>
            </>
          )}

          {step === 4 && (
            <>
              <FormField label="Address" required error={errors.address}>
                <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="City" required error={errors.city}>
                  <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
                </FormField>
                <FormField label="State">
                  <Input value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Maharashtra" />
                </FormField>
              </div>
              <FormField label="Pincode" required error={errors.pincode}>
                <Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
              </FormField>
            </>
          )}

          {step === 5 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {providerTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => update("providerType", type.id)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all hover:border-primary",
                    form.providerType === type.id && "border-primary bg-primary/5 ring-2 ring-primary/20",
                  )}
                >
                  <Building2 className="text-primary mb-2 size-5" />
                  <p className="font-medium">{type.name}</p>
                </button>
              ))}
              {errors.providerType && <p className="text-destructive text-sm sm:col-span-2">{errors.providerType}</p>}
            </div>
          )}

          {step === 6 && (
            <FormField label="Primary Category" required error={errors.categoryId}>
              <Select
                value={form.categoryId}
                onValueChange={(v) => update("categoryId", v)}
                options={categoryOptions}
                placeholder="Select category"
              />
            </FormField>
          )}

          {step === 7 && (
            <>
              <FormField label="Bank Name" required error={errors.bankName}>
                <Input value={form.bankName} onChange={(e) => update("bankName", e.target.value)} />
              </FormField>
              <FormField label="Account Holder" required>
                <Input value={form.accountHolder} onChange={(e) => update("accountHolder", e.target.value)} />
              </FormField>
              <FormField label="Account Number" required error={errors.accountNumber}>
                <Input value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="IFSC" required error={errors.ifsc}>
                  <Input value={form.ifsc} onChange={(e) => update("ifsc", e.target.value)} />
                </FormField>
                <FormField label="UPI ID">
                  <Input value={form.upi} onChange={(e) => update("upi", e.target.value)} />
                </FormField>
              </div>
            </>
          )}

          {step === 8 && (
            <>
              {[
                { key: "idProof", label: "Government ID (Aadhaar/PAN)" },
                { key: "businessProof", label: "Business Registration / GST" },
                { key: "addressProof", label: "Address Proof (optional)" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-xl border border-dashed p-4">
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground text-xs">PDF, JPG or PNG — max 5MB</p>
                  </div>
                  <Button
                    variant={form.documents[key] ? "secondary" : "outline"}
                    size="sm"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        documents: { ...p.documents, [key]: true },
                      }))
                    }
                  >
                    <Upload className="size-3.5" />
                    {form.documents[key] ? "Uploaded" : "Upload"}
                  </Button>
                </div>
              ))}
              {errors.documents && <p className="text-destructive text-sm">{errors.documents}</p>}
            </>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border p-4">
                <Avatar name={form.businessName || "Business"} size="lg" />
                <div>
                  <p className="font-bold">{form.businessName}</p>
                  <p className="text-muted-foreground text-sm">{form.ownerName} · {form.email}</p>
                  <Badge className="mt-1">{categories.find((c) => c.id === form.categoryId)?.name || "Category"}</Badge>
                </div>
              </div>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                {[
                  ["Phone", form.phone],
                  ["Location", `${form.city}, ${form.state}`],
                  ["Address", form.address],
                  ["Bank", form.bankName],
                  ["Account", `****${form.accountNumber.slice(-4)}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-muted/50 p-3">
                    <dt className="text-muted-foreground text-xs">{k}</dt>
                    <dd className="font-medium">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {step === 10 && (
            <div className="py-8 text-center">
              <div className="bg-success/10 text-success mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-xl font-bold">Registration Submitted!</h3>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">
                Our team will review your application within 24-48 hours. You&apos;ll receive an email once approved.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && step < 10 && (
              <Button variant="outline" onClick={back}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            )}
            <div className="ml-auto">
              {step < 9 && (
                <Button onClick={next}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              )}
              {step === 9 && (
                <Button onClick={next}>
                  Submit Application <ArrowRight className="size-4" />
                </Button>
              )}
              {step === 10 && (
                <Button onClick={finish}>Go to Status Page</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-sm">
        Already registered? <Link href={ROUTES.PROVIDER_LOGIN} className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

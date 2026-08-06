"use client";

import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

import { UserHeader } from "@/components/layout/user-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { timeSlots } from "@/mock/appointments";
import { formatCurrency, formatDate } from "@/utils/format.utils";

import { BOOKING_PAYMENT_OPTIONS, BOOKING_STEPS } from "./booking-constants";

export function BookingStepIndicator({ currentStep, className }) {
  return (
    <div className={cn("border-border border-b px-4 py-4", className)}>
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        {BOOKING_STEPS.slice(0, 5).map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-1">
            <div className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
              i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}>
              {i < currentStep ? <Check className="size-4" /> : i + 1}
            </div>
            <span className="text-muted-foreground hidden text-xs sm:block">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BookingProviderBar({ displayProvider }) {
  return (
    <div className="border-border border-b px-4 py-4">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="relative size-12 overflow-hidden rounded-xl">
          <Image src={displayProvider.avatar} alt={displayProvider.businessName} fill className="object-cover" />
        </div>
        <div>
          <p className="font-semibold">{displayProvider.businessName}</p>
          <p className="text-muted-foreground text-sm">{displayProvider.specialty}</p>
        </div>
      </div>
    </div>
  );
}

export function BookingStepContent({
  currentStep,
  draft,
  availableVisitTypes,
  setVisitType,
  addresses,
  setAddressId,
  services,
  toggleService,
  packages,
  setPackageId,
  dates,
  setScheduledDate,
  setScheduledTime,
  selectedServices,
  selectedPackage,
  totalAmount,
  profile,
  setPaymentMethod,
}) {
  return (
    <>
      {currentStep === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">How would you like to visit?</h2>
          <div className="grid gap-3">
            {availableVisitTypes.map(({ value, label, icon: Icon, desc }) => (
              <Card
                key={value}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-card-hover",
                  draft.visitType === value && "border-primary ring-primary ring-1",
                )}
                onClick={() => setVisitType(value)}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                    <Icon className="text-primary size-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-muted-foreground text-sm">{desc}</p>
                  </div>
                  {draft.visitType === value && <Check className="text-primary ml-auto size-5" />}
                </CardContent>
              </Card>
            ))}
          </div>
          {draft.visitType === "home_visit" && (
            <FormField label="Delivery Address">
              <Select
                value={draft.addressId || ""}
                onValueChange={setAddressId}
                placeholder="Select address"
                options={addresses.map((a) => ({
                  value: a.id,
                  label: `${a.label} - ${a.addressLine1}, ${a.city}`,
                }))}
              />
            </FormField>
          )}
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Select Services</h2>
            <div className="mt-4 space-y-3">
              {services.map((svc) => {
                const selected = draft.serviceIds.includes(svc.id);
                return (
                  <Card
                    key={svc.id}
                    className={cn("cursor-pointer", selected && "border-primary ring-primary ring-1")}
                    onClick={() => toggleService(svc.id)}
                  >
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium">{svc.name}</p>
                        <p className="text-muted-foreground text-sm">{svc.duration} min</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-bold">{formatCurrency(svc.price)}</span>
                        {selected && <Check className="text-primary size-5" />}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {packages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">Or Choose a Package</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {packages.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={cn("cursor-pointer overflow-hidden", draft.packageId === pkg.id && "border-primary ring-primary ring-1")}
                    onClick={() => setPackageId(pkg.id)}
                  >
                    <div className="relative aspect-video">
                      <Image src={pkg.image} alt={pkg.name} fill className="object-cover" />
                      <Badge className="absolute right-2 top-2">{pkg.discountPercent}% OFF</Badge>
                    </div>
                    <CardContent className="pt-3">
                      <p className="font-medium">{pkg.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-primary font-bold">{formatCurrency(pkg.price)}</span>
                        <span className="text-muted-foreground text-sm line-through">{formatCurrency(pkg.originalPrice)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-semibold">Select Date</h2>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
              {dates.map((date) => {
                const d = new Date(date);
                const isSelected = draft.scheduledDate === date;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setScheduledDate(date)}
                    className={cn(
                      "flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-colors",
                      isSelected ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted",
                    )}
                  >
                    <span className="text-xs uppercase">{d.toLocaleDateString("en", { weekday: "short" })}</span>
                    <span className="text-lg font-bold">{d.getDate()}</span>
                    <span className="text-xs">{d.toLocaleDateString("en", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Select Time</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setScheduledTime(slot.time)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-medium transition-colors",
                    !slot.available && "cursor-not-allowed opacity-40",
                    draft.scheduledTime === slot.time
                      ? "border-primary gradient-brand text-primary-foreground hover:opacity-95"
                      : "hover:bg-muted",
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Booking Summary</h2>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Visit Type</span>
                <span className="font-medium capitalize">{draft.visitType?.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">
                  {formatDate(draft.scheduledDate, "dd MMM yyyy")} · {draft.scheduledTime}
                </span>
              </div>
              <div className="border-t pt-4">
                <p className="mb-2 text-sm font-medium">Services</p>
                {selectedPackage ? (
                  <div className="flex justify-between text-sm">
                    <span>{selectedPackage.name}</span>
                    <span>{formatCurrency(selectedPackage.price)}</span>
                  </div>
                ) : (
                  selectedServices.map((svc) => (
                    <div key={svc.id} className="flex justify-between text-sm">
                      <span>{svc.name}</span>
                      <span>{formatCurrency(svc.price)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <p className="text-muted-foreground text-sm">
            Wallet balance: {formatCurrency(profile.walletBalance)}
          </p>
          <div className="grid gap-3">
            {BOOKING_PAYMENT_OPTIONS.map(({ value, label, icon: Icon }) => (
              <Card
                key={value}
                className={cn("cursor-pointer", draft.paymentMethod === value && "border-primary ring-primary ring-1")}
                onClick={() => setPaymentMethod(value)}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  <Icon className="text-primary size-6" />
                  <span className="font-medium">{label}</span>
                  {draft.paymentMethod === value && <Check className="text-primary ml-auto size-5" />}
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-muted/50">
            <CardContent className="flex items-center justify-between py-4">
              <span className="font-medium">Amount to pay</span>
              <span className="text-primary text-xl font-bold">{formatCurrency(totalAmount)}</span>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export function BookingWizardFooter({
  currentStep,
  totalAmount,
  processing,
  onBack,
  onNext,
}) {
  return (
    <div className="border-border bg-background/95 safe-bottom fixed inset-x-0 bottom-0 border-t p-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft /> {currentStep === 0 ? "Back" : "Previous"}
        </Button>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Total</p>
          <p className="text-primary font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <Button onClick={onNext} loading={processing}>
          {currentStep === 4 ? "Pay & Confirm" : "Continue"} <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function BookingMobileHeader() {
  return (
    <div className="md:hidden">
      <UserHeader title="Book Appointment" />
    </div>
  );
}

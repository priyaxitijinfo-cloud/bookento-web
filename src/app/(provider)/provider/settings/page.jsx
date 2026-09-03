"use client";

import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { providerSettings as defaultProviderSettings } from "@/mock/settings";
import { useProviderSettingsStore } from "@/store";

function mergeProviderSettings(settings) {
  return {
    notifications: {
      ...defaultProviderSettings.notifications,
      ...settings?.notifications,
    },
    business: {
      ...defaultProviderSettings.business,
      ...settings?.business,
    },
    payment: {
      ...defaultProviderSettings.payment,
      ...settings?.payment,
    },
  };
}

export default function ProviderSettingsPage() {
  const { settings, updateSettings, isLoading } = useProviderSettingsStore();
  const providerSettings = mergeProviderSettings(settings);
  const { notifications, business, payment } = providerSettings;

  const handleSave = async (section, data) => {
    await updateSettings({ [section]: { ...providerSettings[section], ...data } });
    toast.success("Settings saved");
  };

  return (
    <>
      <ProviderHeader title="Settings" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <Tabs defaultValue="notifications" className="mx-auto max-w-3xl">
          <TabsList className="mb-2 w-full flex-wrap">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        handleSave("notifications", { [key]: e.target.checked })
                      }
                      className="size-4 rounded"
                    />
                  </label>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>
                  Configure booking and scheduling rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between rounded-xl border p-4">
                  <span className="text-sm font-medium">Auto-accept bookings</span>
                  <input
                    type="checkbox"
                    checked={business.autoAcceptBookings}
                    onChange={(e) =>
                      handleSave("business", { autoAcceptBookings: e.target.checked })
                    }
                    className="size-4 rounded"
                  />
                </label>
                <FormField label="Buffer time (minutes)">
                  <Input
                    type="number"
                    defaultValue={business.bufferTime}
                    onBlur={(e) =>
                      handleSave("business", { bufferTime: Number(e.target.value) })
                    }
                  />
                </FormField>
                <FormField label="Max daily bookings">
                  <Input
                    type="number"
                    defaultValue={business.maxDailyBookings}
                    onBlur={(e) =>
                      handleSave("business", {
                        maxDailyBookings: Number(e.target.value),
                      })
                    }
                  />
                </FormField>
                <FormField label="Cancellation policy">
                  <Select
                    value={business.cancellationPolicy}
                    onValueChange={(v) =>
                      handleSave("business", { cancellationPolicy: v })
                    }
                    options={[
                      { value: "24_hours", label: "24 hours before" },
                      { value: "12_hours", label: "12 hours before" },
                      { value: "flexible", label: "Flexible" },
                    ]}
                  />
                </FormField>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Bank account for payouts</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField label="Bank Name">
                  <Input defaultValue={payment.bankName} readOnly />
                </FormField>
                <FormField label="Account Holder">
                  <Input defaultValue={payment.accountHolder} readOnly />
                </FormField>
                <FormField label="Account Number">
                  <Input defaultValue={payment.accountNumber} readOnly />
                </FormField>
                <FormField label="IFSC Code">
                  <Input defaultValue={payment.ifsc} readOnly />
                </FormField>
                <FormField label="UPI ID" className="sm:col-span-2">
                  <Input defaultValue={payment.upi} readOnly />
                </FormField>
                <Button variant="outline" className="sm:col-span-2">
                  Update Payment Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage password and account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Current Password">
                  <Input type="password" placeholder="••••••••" />
                </FormField>
                <FormField label="New Password">
                  <Input type="password" placeholder="••••••••" />
                </FormField>
                <FormField label="Confirm Password">
                  <Input type="password" placeholder="••••••••" />
                </FormField>
                <Button
                  loading={isLoading}
                  onClick={() => toast.success("Password updated")}
                >
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

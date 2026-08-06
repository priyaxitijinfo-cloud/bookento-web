"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { currentProvider } from "@/mock/providers";
import { categories } from "@/mock/categories";

export default function ProviderProfilePage() {
  const [form, setForm] = useState({
    businessName: currentProvider.businessName,
    ownerName: currentProvider.ownerName,
    email: currentProvider.email,
    phone: currentProvider.phone,
    specialty: currentProvider.specialty,
    categoryId: currentProvider.categoryId,
    description: currentProvider.description,
    address: currentProvider.address,
    city: currentProvider.city,
    pincode: currentProvider.pincode,
    yearsOfExperience: String(currentProvider.yearsOfExperience),
  });

  const categoryOptions = categories.slice(0, 10).map((c) => ({ value: c.id, label: c.name }));

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  return (
    <>
      <ProviderHeader title="Profile" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative">
                  <Avatar src={currentProvider.avatar} name={form.businessName} size="xl" />
                  <button type="button" className="gradient-brand absolute right-0 bottom-0 rounded-full p-2 text-white">
                    <Camera className="size-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold">{form.businessName}</h2>
                  <p className="text-muted-foreground text-sm">{form.ownerName}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {currentProvider.isVerified && <Badge variant="success">Verified</Badge>}
                    <Badge variant="secondary">{form.specialty}</Badge>
                  </div>
                </div>
              </div>
              <div className="relative mt-6 h-32 overflow-hidden rounded-xl">
                <Image src={currentProvider.coverImage} alt="Cover" fill className="object-cover" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your public profile details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Business Name" required>
                <Input value={form.businessName} onChange={handleChange("businessName")} />
              </FormField>
              <FormField label="Owner Name" required>
                <Input value={form.ownerName} onChange={handleChange("ownerName")} />
              </FormField>
              <FormField label="Email" required>
                <Input type="email" value={form.email} onChange={handleChange("email")} />
              </FormField>
              <FormField label="Phone" required>
                <Input value={form.phone} onChange={handleChange("phone")} />
              </FormField>
              <FormField label="Specialty">
                <Input value={form.specialty} onChange={handleChange("specialty")} />
              </FormField>
              <FormField label="Category">
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}
                  options={categoryOptions}
                  placeholder="Select category"
                />
              </FormField>
              <FormField label="Years of Experience" className="sm:col-span-2">
                <Input type="number" value={form.yearsOfExperience} onChange={handleChange("yearsOfExperience")} />
              </FormField>
              <FormField label="Description" className="sm:col-span-2">
                <Textarea value={form.description} onChange={handleChange("description")} rows={4} />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Address" className="sm:col-span-2">
                <Input value={form.address} onChange={handleChange("address")} />
              </FormField>
              <FormField label="City">
                <Input value={form.city} onChange={handleChange("city")} />
              </FormField>
              <FormField label="Pincode">
                <Input value={form.pincode} onChange={handleChange("pincode")} />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">
              <Save className="size-4" /> Save Changes
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}

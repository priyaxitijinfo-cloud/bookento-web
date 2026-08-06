"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { services as mockServices } from "@/mock/services";
import { currentProvider } from "@/mock/providers";
import { formatCurrency, formatDuration } from "@/utils/format.utils";

export default function ProviderServicesPage() {
  const [items, setItems] = useState(() => mockServices.slice(0, 18));
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "", description: "" });

  const filtered = useMemo(
    () => items.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase())),
    [items, search],
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", price: "", duration: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      name: service.name,
      price: String(service.price),
      duration: String(service.duration),
      description: service.description,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (editing) {
      setItems((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? { ...s, ...form, price: Number(form.price), duration: Number(form.duration) || 30 }
            : s,
        ),
      );
      toast.success("Service updated");
    } else {
      const newService = {
        id: `svc_${Date.now()}`,
        providerId: currentProvider.id,
        providerName: currentProvider.businessName,
        name: form.name,
        description: form.description || "Professional service",
        image: mockServices[0].image,
        duration: Number(form.duration) || 30,
        price: Number(form.price),
        isActive: true,
        isPopular: false,
        totalBookings: 0,
        visitTypes: ["onsite"],
        rating: currentProvider.rating,
      };
      setItems((prev) => [newService, ...prev]);
      toast.success("Service created");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };

  return (
    <>
      <ProviderHeader title="Services" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Add Service
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative h-40">
                <Image src={service.image} alt={service.name} fill className="object-cover" />
                {service.isPopular && (
                  <Badge className="absolute top-3 left-3" variant="success">Popular</Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1 text-base">{service.name}</CardTitle>
                <p className="text-muted-foreground line-clamp-2 text-sm">{service.description}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between pb-2">
                <span className="text-lg font-bold">{formatCurrency(service.price)}</span>
                <span className="text-muted-foreground text-sm">{formatDuration(service.duration)}</span>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(service)}>
                  <Edit className="size-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <FormField label="Service Name" required>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price (INR)" required>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </FormField>
                <FormField label="Duration (min)">
                  <Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </FormField>
              </div>
              <FormField label="Description">
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FormField>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}

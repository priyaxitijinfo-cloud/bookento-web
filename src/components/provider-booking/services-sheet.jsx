"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import { ServiceSelectCard } from "@/components/provider-booking/service-select-card";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store";
import { formatCurrency, formatDuration } from "@/utils/format.utils";

export function ServicesSheet({ open, onClose, services }) {
  const { draft, toggleService } = useBookingStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filteredServices = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) => service.name.toLowerCase().includes(term));
  }, [query, services]);

  if (!open) return null;

  const selectedServices = services.filter((service) => draft.serviceIds.includes(service.id));
  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalMinutes = selectedServices.reduce((sum, service) => sum + service.duration, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-xl bg-background shadow-2xl md:rounded-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-bold">Services</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-full p-2">
            <X className="size-5" />
          </button>
        </div>

        <div className="border-b px-5 py-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search services"
              className="border-border w-full rounded-lg border bg-[#FAFBFD] py-2.5 pl-10 pr-4 text-sm outline-none ring-primary/20 focus:bg-background focus:ring-2"
            />
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
          {filteredServices.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No services found</p>
          ) : (
            filteredServices.map((service) => {
              const selected = draft.serviceIds.includes(service.id);
              return (
                <ServiceSelectCard
                  key={service.id}
                  service={service}
                  selected={selected}
                  onToggle={() => toggleService(service.id)}
                />
              );
            })
          )}
        </div>

        <div className="border-t p-5">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {selectedServices.length} services · {formatDuration(totalMinutes)}
            </span>
            <span className="text-primary font-bold">{formatCurrency(totalAmount)}</span>
          </div>
          <Button className="w-full rounded-lg" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { useAppointmentStore } from "@/store";
import { formatCurrency, formatDate } from "@/utils/format.utils";

const statusVariant = {
  pending: "warning",
  confirmed: "success",
  upcoming: "default",
  completed: "secondary",
  cancelled: "destructive",
  rejected: "destructive",
};

const statusOptions = [
  { value: "all", label: "All Status" },
  ...Object.values(APPOINTMENT_STATUS).map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
];

export default function ProviderAppointmentsPage() {
  const { providerAppointments, updateStatus } = useAppointmentStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return providerAppointments.filter((apt) => {
      const matchSearch =
        !search ||
        apt.userName.toLowerCase().includes(search.toLowerCase()) ||
        apt.serviceName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || apt.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [providerAppointments, search, statusFilter]);

  const handleAccept = (id) => {
    updateStatus(id, APPOINTMENT_STATUS.CONFIRMED);
    toast.success("Appointment accepted");
  };

  const handleReject = (id) => {
    updateStatus(id, APPOINTMENT_STATUS.REJECTED);
    toast.success("Appointment rejected");
  };

  return (
    <>
      <ProviderHeader title="Appointments" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Appointments ({filtered.length})</CardTitle>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search customer or service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 sm:w-64"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statusOptions}
                  className="w-full sm:w-40"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="text-muted-foreground px-6 py-3 font-medium">Customer</th>
                  <th className="text-muted-foreground px-6 py-3 font-medium">Service</th>
                  <th className="text-muted-foreground px-6 py-3 font-medium">Date & Time</th>
                  <th className="text-muted-foreground px-6 py-3 font-medium">Visit</th>
                  <th className="text-muted-foreground px-6 py-3 font-medium">Amount</th>
                  <th className="text-muted-foreground px-6 py-3 font-medium">Status</th>
                  <th className="text-muted-foreground px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/30 border-b transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={apt.userAvatar} name={apt.userName} size="sm" />
                        <div>
                          <p className="font-medium">{apt.userName}</p>
                          <p className="text-muted-foreground text-xs">{apt.userPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{apt.serviceName}</td>
                    <td className="px-6 py-4">
                      <p>{formatDate(apt.scheduledDate)}</p>
                      <p className="text-muted-foreground text-xs">{apt.scheduledTime}</p>
                    </td>
                    <td className="px-6 py-4 capitalize">{apt.visitType}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(apt.amount)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[apt.status] || "secondary"}>{apt.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {apt.status === APPOINTMENT_STATUS.PENDING ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAccept(apt.id)}>
                            <Check className="size-3.5" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleReject(apt.id)}>
                            <X className="size-3.5" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

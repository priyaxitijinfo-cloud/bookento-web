"use client";

import Link from "next/link";
import {
  ArrowUpRight, Calendar, Clock, DollarSign, MessageCircle,
  Plus, Star, TrendingUp, Users, Wallet,
} from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes.constants";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { providerDashboard } from "@/mock/dashboard";
import { getPendingAppointments } from "@/mock/appointments";
import { currentProvider } from "@/mock/providers";
import { formatCurrency, formatDate } from "@/utils/format.utils";

function BarChart({ data, valueKey, labelKey, color = "gradient-brand" }) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="flex h-44 items-end gap-2">
      {data.map((item) => (
        <div key={item[labelKey]} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-muted-foreground text-[10px] font-medium">
            {typeof item[valueKey] === "number" && item[valueKey] > 999
              ? `${(item[valueKey] / 1000).toFixed(1)}k`
              : item[valueKey]}
          </span>
          <div
            className={`${color} w-full rounded-t-lg transition-all duration-500`}
            style={{ height: `${Math.max((item[valueKey] / max) * 100, 4)}%` }}
          />
          <span className="text-muted-foreground text-[10px]">{item[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

const statusVariant = {
  [APPOINTMENT_STATUS.PENDING]: "warning",
  [APPOINTMENT_STATUS.CONFIRMED]: "success",
  [APPOINTMENT_STATUS.UPCOMING]: "default",
  [APPOINTMENT_STATUS.COMPLETED]: "secondary",
  [APPOINTMENT_STATUS.CANCELLED]: "destructive",
};

export default function ProviderDashboardPage() {
  const pending = getPendingAppointments();
  const stats = providerDashboard;

  return (
    <>
      <ProviderHeader title="Dashboard" />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-6">
        <div className="from-primary/5 via-background to-background rounded-2xl border bg-gradient-to-br p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Welcome back,</p>
              <h2 className="text-2xl font-bold">{currentProvider.ownerName}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{currentProvider.businessName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Verified</Badge>
              <div className="flex items-center gap-1 text-sm">
                <Star className="text-warning size-4 fill-current" />
                <span className="font-semibold">{stats.averageRating}</span>
                <span className="text-muted-foreground">({stats.totalCustomers} customers)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Today's Earnings", value: formatCurrency(stats.todayEarnings), icon: DollarSign, trend: stats.earningsTrend, color: "text-success" },
            { label: "Monthly Earnings", value: formatCurrency(stats.monthlyEarnings), icon: Wallet, trend: stats.earningsTrend, color: "text-primary" },
            { label: "Pending Bookings", value: stats.pendingAppointments, icon: Calendar, trend: stats.appointmentsTrend, color: "text-warning" },
            { label: "Completed", value: stats.completedAppointments, icon: TrendingUp, trend: 5.2, color: "text-chart-2" },
          ].map(({ label, value, icon: Icon, trend, color }) => (
            <Card key={label} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl bg-muted p-2.5 ${color}`}>
                    <Icon className="size-5" />
                  </div>
                  <span className="text-success flex items-center gap-0.5 text-xs font-medium">
                    <ArrowUpRight className="size-3" />+{trend}%
                  </span>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Earnings</CardTitle>
              <CardDescription>Revenue performance this week</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={stats.earningsTrend ? require("@/mock/earnings").earningsSummary.weeklyEarnings : []} valueKey="value" labelKey="day" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your business</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {[
                { href: ROUTES.PROVIDER_APPOINTMENTS, label: "View Appointments", icon: Calendar },
                { href: ROUTES.PROVIDER_SERVICES, label: "Add Service", icon: Plus },
                { href: ROUTES.PROVIDER_CHATS, label: "Messages", icon: MessageCircle },
                { href: ROUTES.PROVIDER_EARNINGS, label: "Withdraw Earnings", icon: Wallet },
              ].map(({ href, label, icon: Icon }) => (
                <Button key={href} variant="outline" className="justify-start" asChild>
                  <Link href={href}>
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>{stats.todaySchedule.length} appointments today</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.PROVIDER_APPOINTMENTS}>View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.todaySchedule.map((apt) => (
                <div key={apt.id} className="hover:bg-muted/50 flex items-center gap-4 rounded-xl border p-3 transition-colors">
                  <Avatar src={apt.userAvatar} name={apt.userName} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{apt.userName}</p>
                    <p className="text-muted-foreground truncate text-sm">{apt.serviceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-sm font-medium">
                      <Clock className="size-3.5" />
                      {apt.scheduledTime}
                    </p>
                    <Badge variant={statusVariant[apt.status] || "secondary"} className="mt-1">
                      {apt.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pending Bookings</CardTitle>
                <CardDescription>Requests awaiting your response</CardDescription>
              </div>
              <Badge variant="warning">{pending.length} new</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {pending.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 rounded-xl border p-3">
                  <Avatar src={apt.userAvatar} name={apt.userName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{apt.userName}</p>
                    <p className="text-muted-foreground truncate text-xs">{apt.serviceName}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatDate(apt.scheduledDate)} · {apt.scheduledTime}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(apt.amount)}</p>
                </div>
              ))}
              {pending.length === 0 && (
                <p className="text-muted-foreground py-8 text-center text-sm">No pending bookings</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.quickStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="bg-primary/10 text-primary rounded-xl p-3">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold">{stat.value}</span>
                    <span className="text-success text-xs">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

"use client";

import { BarChart3, Clock, TrendingUp, Users } from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analytics } from "@/mock/analytics";
import { formatCurrency } from "@/utils/format.utils";

function DualBarChart({ data }) {
  const maxViews = Math.max(...data.map((d) => d.views));
  const maxBookings = Math.max(...data.map((d) => d.bookings));
  return (
    <div className="flex h-52 items-end gap-3">
      {data.map((item) => (
        <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full items-end gap-1" style={{ height: "160px" }}>
            <div
              className="bg-primary/80 flex-1 rounded-t-md"
              style={{ height: `${Math.max((item.views / maxViews) * 100, 4)}%` }}
              title={`${item.views} views`}
            />
            <div
              className="bg-chart-2 flex-1 rounded-t-md"
              style={{ height: `${Math.max((item.bookings / maxBookings) * 100, 4)}%` }}
              title={`${item.bookings} bookings`}
            />
          </div>
          <span className="text-muted-foreground text-[10px]">{item.date}</span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBar({ label, value, max, color = "gradient-brand" }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div className={`${color} h-full rounded-full`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export default function ProviderAnalyticsPage() {
  const { overview, viewsChart, topServices, customerDemographics, peakHours } = analytics;
  const maxDemo = Math.max(...customerDemographics.map((d) => d.percentage));
  const maxPeak = Math.max(...peakHours.map((h) => h.bookings));

  return (
    <>
      <ProviderHeader title="Analytics" />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total Views", value: overview.totalViews.toLocaleString(), icon: BarChart3 },
            { label: "Profile Views", value: overview.profileViews.toLocaleString(), icon: Users },
            { label: "Conversion", value: `${overview.bookingConversion}%`, icon: TrendingUp },
            { label: "Response Time", value: overview.avgResponseTime, icon: Clock },
            { label: "Retention", value: `${overview.customerRetention}%`, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <Icon className="text-primary mb-2 size-5" />
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Views vs Bookings</CardTitle>
            <CardDescription>Weekly performance — blue: views, green: bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <DualBarChart data={viewsChart} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topServices.map((svc) => (
                <div key={svc.name} className="flex items-center justify-between rounded-xl border p-3">
                  <div>
                    <p className="font-medium">{svc.name}</p>
                    <p className="text-muted-foreground text-sm">{svc.bookings} bookings</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(svc.revenue)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerDemographics.map((demo) => (
                <HorizontalBar
                  key={demo.age}
                  label={`Age ${demo.age}`}
                  value={demo.percentage}
                  max={maxDemo}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Peak Booking Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-4">
              {peakHours.map((h) => (
                <div key={h.hour} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-muted-foreground text-xs">{h.bookings}</span>
                  <div
                    className="gradient-brand w-full rounded-t-lg"
                    style={{ height: `${Math.max((h.bookings / maxPeak) * 100, 4)}%` }}
                  />
                  <span className="text-muted-foreground text-[10px]">{h.hour}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

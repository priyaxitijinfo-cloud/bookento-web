"use client";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { PROVIDER_PAGE_SHELL } from "@/lib/layout/page-layout.constants";
import { branches } from "@/mock/branches";
import { cn } from "@/lib/utils";

export default function ProviderBranchesPage() {
  return (
    <>
      <ProviderHeader title="Branches" />
      <main className="flex-1 overflow-y-auto">
        <div className={cn(PROVIDER_PAGE_SHELL, "py-4 lg:py-6")}>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {branches.length} branch locations
            </p>
            <Button>Add Branch</Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {branches.map((branch) => (
              <Card key={branch.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={PROVIDER_ICONS.building}
                        alt=""
                        className="size-5 object-contain"
                        draggable={false}
                      />
                      <CardTitle className="text-base">{branch.name}</CardTitle>
                    </div>
                    {branch.isMain && (
                      <Badge className="mt-2" variant="success">
                        Main Branch
                      </Badge>
                    )}
                  </div>
                  <Badge variant={branch.isActive ? "success" : "secondary"}>
                    {branch.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-muted-foreground flex items-start gap-2 text-sm">
                    <img
                      src={PROVIDER_ICONS.location}
                      alt=""
                      className="mt-0.5 size-4 shrink-0 object-contain opacity-70"
                      draggable={false}
                    />
                    <span>
                      {branch.address}, {branch.city} - {branch.pincode}
                    </span>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <img
                      src={PROVIDER_ICONS.phone}
                      alt=""
                      className="size-4 shrink-0 object-contain opacity-70"
                      draggable={false}
                    />
                    {branch.phone}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <img
                      src={PROVIDER_ICONS.mail}
                      alt=""
                      className="size-4 shrink-0 object-contain opacity-70"
                      draggable={false}
                    />
                    {branch.email}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <img
                      src={PROVIDER_ICONS.clock}
                      alt=""
                      className="size-4 shrink-0 object-contain opacity-70"
                      draggable={false}
                    />
                    Mon-Fri: {branch.businessHours.weekdays}
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground flex items-center gap-1 text-sm">
                      <img
                        src={PROVIDER_ICONS.star}
                        alt=""
                        className="size-3.5 object-contain opacity-70"
                        draggable={false}
                      />
                      {branch.staffCount} staff members
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Map
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

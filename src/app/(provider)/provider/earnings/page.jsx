"use client";

import { useState } from "react";
import { ArrowDownToLine, Banknote, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { earningsSummary } from "@/mock/earnings";
import { transactions } from "@/mock/transactions";
import { payouts } from "@/mock/payouts";
import { formatCurrency, formatDate, formatRelativeTime } from "@/utils/format.utils";

function BarChart({ data, valueKey, labelKey }) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((item) => (
        <div key={item[labelKey]} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-muted-foreground text-[10px]">
            {formatCurrency(item[valueKey]).replace(".00", "")}
          </span>
          <div
            className="gradient-brand w-full rounded-t-lg"
            style={{ height: `${Math.max((item[valueKey] / max) * 100, 4)}%` }}
          />
          <span className="text-muted-foreground text-xs">{item[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

const payoutStatusVariant = {
  completed: "success",
  processing: "warning",
  pending: "secondary",
  failed: "destructive",
};

export default function ProviderEarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const summary = earningsSummary;

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (amount > summary.availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }
    toast.success(`Withdrawal of ${formatCurrency(amount)} initiated`);
    setWithdrawAmount("");
  };

  return (
    <>
      <ProviderHeader title="Earnings" />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Earnings", value: formatCurrency(summary.totalEarnings), icon: TrendingUp },
            { label: "Available Balance", value: formatCurrency(summary.availableBalance), icon: Wallet },
            { label: "Pending Settlement", value: formatCurrency(summary.pendingSettlement), icon: Banknote },
            { label: "This Month", value: formatCurrency(summary.monthlyEarnings), icon: ArrowDownToLine },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <div className="bg-primary/10 text-primary mb-3 w-fit rounded-xl p-2.5">
                  <Icon className="size-5" />
                </div>
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
            <CardDescription>Last 7 months performance</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={summary.monthlyEarningsChart} valueKey="value" labelKey="month" />
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardContent className="overflow-x-auto p-0 pt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="text-muted-foreground px-6 py-3 font-medium">Customer</th>
                      <th className="text-muted-foreground px-6 py-3 font-medium">Service</th>
                      <th className="text-muted-foreground px-6 py-3 font-medium">Gross</th>
                      <th className="text-muted-foreground px-6 py-3 font-medium">Commission</th>
                      <th className="text-muted-foreground px-6 py-3 font-medium">Net</th>
                      <th className="text-muted-foreground px-6 py-3 font-medium">Status</th>
                      <th className="text-muted-foreground px-6 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 15).map((txn) => (
                      <tr key={txn.id} className="hover:bg-muted/30 border-b">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Avatar src={txn.userAvatar} name={txn.userName} size="sm" />
                            <span>{txn.userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{txn.serviceName}</td>
                        <td className="px-6 py-4">{formatCurrency(txn.grossAmount)}</td>
                        <td className="text-destructive px-6 py-4">-{formatCurrency(txn.commission)}</td>
                        <td className="px-6 py-4 font-medium text-success">{formatCurrency(txn.netEarnings)}</td>
                        <td className="px-6 py-4">
                          <Badge variant={txn.status === "completed" ? "success" : "warning"}>{txn.status}</Badge>
                        </td>
                        <td className="text-muted-foreground px-6 py-4">{formatRelativeTime(txn.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardContent className="space-y-3 pt-4">
                {payouts.map((pay) => (
                  <div key={pay.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
                    <div>
                      <p className="font-semibold">{formatCurrency(pay.amount)}</p>
                      <p className="text-muted-foreground text-sm capitalize">
                        {pay.method.replace("_", " ")} · {pay.bankAccount || pay.upiId}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={payoutStatusVariant[pay.status]}>{pay.status}</Badge>
                      <p className="text-muted-foreground mt-1 text-xs">{formatDate(pay.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Available: {formatCurrency(summary.availableBalance)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="max-w-md space-y-4">
                  <FormField label="Amount (INR)" required>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min={1}
                      max={summary.availableBalance}
                    />
                  </FormField>
                  <FormField label="Bank Account">
                    <Input defaultValue="HDFC Bank ****7890" disabled />
                  </FormField>
                  <Button type="submit" className="w-full sm:w-auto">
                    <ArrowDownToLine className="size-4" />
                    Request Withdrawal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

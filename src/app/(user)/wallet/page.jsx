"use client";

import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from "lucide-react";
import { toast } from "sonner";

import { UserBottomNav, UserHeader } from "@/components/layout/user-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { walletTransactions } from "@/mock/users";
import { useProfileStore } from "@/store";
import { formatCurrency, formatRelativeTime } from "@/utils/format.utils";

export default function WalletPage() {
  const { profile } = useProfileStore();

  const credits = walletTransactions.filter((t) => t.type === "credit");
  const debits = walletTransactions.filter((t) => t.type === "debit");
  const totalCredited = credits.reduce((s, t) => s + t.amount, 0);
  const totalDebited = debits.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <UserHeader title="Wallet" />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {/* Balance card */}
        <Card className="gradient-brand overflow-hidden border-0 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 text-sm">Available Balance</p>
                <p className="mt-1 text-4xl font-bold">{formatCurrency(profile.walletBalance)}</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20">
                <Wallet className="size-6" />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1 bg-white/20 text-white hover:bg-white/30"
                onClick={() => toast.info("Add money coming soon")}
              >
                <Plus className="size-4" /> Add Money
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-white/20 text-white hover:bg-white/30"
                onClick={() => toast.info("Withdraw coming soon")}
              >
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="text-success size-5" />
                <span className="text-muted-foreground text-sm">Total Credited</span>
              </div>
              <p className="text-success mt-1 text-xl font-bold">{formatCurrency(totalCredited)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="text-destructive size-5" />
                <span className="text-muted-foreground text-sm">Total Spent</span>
              </div>
              <p className="text-destructive mt-1 text-xl font-bold">{formatCurrency(totalDebited)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="mb-4 font-semibold">Recent Transactions</h3>
          <div className="space-y-3">
            {walletTransactions.map((txn) => (
              <Card key={txn.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex size-10 items-center justify-center rounded-xl ${txn.type === "credit" ? "bg-success/10" : "bg-destructive/10"}`}>
                      {txn.type === "credit" ? (
                        <ArrowDownLeft className="text-success size-5" />
                      ) : (
                        <ArrowUpRight className="text-destructive size-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.description}</p>
                      <p className="text-muted-foreground text-xs">{formatRelativeTime(txn.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${txn.type === "credit" ? "text-success" : "text-destructive"}`}>
                      {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </p>
                    <Badge variant={txn.status === "completed" ? "success" : "secondary"} className="mt-1 capitalize">
                      {txn.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <UserBottomNav />
    </div>
  );
}

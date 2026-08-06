"use client";

import { Copy, Gift, Share2, Users } from "lucide-react";
import { toast } from "sonner";

import { UserBottomNav, UserHeader } from "@/components/layout/user-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { currentUser, referrals } from "@/mock/users";
import { formatCurrency, formatDate, formatRelativeTime } from "@/utils/format.utils";

const STATUS_VARIANT = {
  pending: "warning",
  completed: "success",
};

export default function ReferralsPage() {
  const completedReferrals = referrals.filter((r) => r.status === "completed");
  const totalEarned = completedReferrals.reduce((s, r) => s + r.reward, 0);
  const pendingCount = referrals.filter((r) => r.status === "pending").length;

  const copyCode = () => {
    navigator.clipboard?.writeText(currentUser.referralCode);
    toast.success("Referral code copied!");
  };

  const shareLink = () => {
    const link = `https://bookento.app/join?ref=${currentUser.referralCode}`;
    navigator.clipboard?.writeText(link);
    toast.success("Referral link copied!");
  };

  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <UserHeader title="Refer & Earn" />
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {/* Hero */}
        <Card className="gradient-brand overflow-hidden border-0 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Gift className="size-10" />
              <div>
                <h2 className="text-xl font-bold">Invite Friends, Earn ₹100</h2>
                <p className="text-white/80 text-sm">Both you and your friend get rewards on first booking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5 text-center">
              <Users className="text-primary mx-auto size-6" />
              <p className="mt-2 text-2xl font-bold">{referrals.length}</p>
              <p className="text-muted-foreground text-xs">Invited</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">{completedReferrals.length}</p>
              <p className="text-muted-foreground text-xs">Joined</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-success text-2xl font-bold">{formatCurrency(totalEarned)}</p>
              <p className="text-muted-foreground text-xs">Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral code */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-sm">Your referral code</p>
            <div className="mt-2 flex items-center gap-3">
              <code className="bg-muted flex-1 rounded-xl px-4 py-3 text-lg font-bold tracking-widest">
                {currentUser.referralCode}
              </code>
              <Button variant="outline" size="icon" onClick={copyCode}>
                <Copy />
              </Button>
            </div>
            <Button className="mt-4 w-full" onClick={shareLink}>
              <Share2 className="size-4" /> Share Referral Link
            </Button>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-semibold">How it works</h3>
            <ol className="space-y-4">
              {[
                "Share your unique referral code with friends",
                "They sign up and complete their first booking",
                "You both receive ₹100 in your wallet",
              ].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Referral list */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Your Referrals</h3>
            {pendingCount > 0 && (
              <Badge variant="warning">{pendingCount} pending</Badge>
            )}
          </div>
          <div className="space-y-3">
            {referrals.map((ref) => (
              <Card key={ref.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={ref.name} size="md" />
                    <div>
                      <p className="font-medium">{ref.name}</p>
                      <p className="text-muted-foreground text-xs">{ref.email}</p>
                      <p className="text-muted-foreground text-xs">Joined {formatRelativeTime(ref.joinedAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={STATUS_VARIANT[ref.status]} className="capitalize">
                      {ref.status}
                    </Badge>
                    {ref.reward > 0 && (
                      <p className="text-success mt-1 text-sm font-semibold">+{formatCurrency(ref.reward)}</p>
                    )}
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

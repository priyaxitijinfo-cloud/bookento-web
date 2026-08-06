"use client";

import { Copy, Gift, Share2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatRelativeTime } from "@/utils/format.utils";

const STATUS_VARIANT = {
  pending: "warning",
  completed: "success",
};

export function ReferralsHeroCard() {
  return (
    <Card className="gradient-brand overflow-hidden border-0 text-white">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Gift className="size-10" />
          <div>
            <h2 className="text-xl font-bold">Invite Friends, Earn ₹100</h2>
            <p className="text-sm text-white/80">Both you and your friend get rewards on first booking</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReferralsStatsGrid({ totalInvited, joinedCount, totalEarned }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-5 text-center">
          <Users className="text-primary mx-auto size-6" />
          <p className="mt-2 text-2xl font-bold">{totalInvited}</p>
          <p className="text-muted-foreground text-xs">Invited</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-5 text-center">
          <p className="text-2xl font-bold">{joinedCount}</p>
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
  );
}

export function ReferralCodeCard({ referralCode, onCopy, onShare }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-muted-foreground text-sm">Your referral code</p>
        <div className="mt-2 flex items-center gap-3">
          <code className="bg-muted flex-1 rounded-xl px-4 py-3 text-lg font-bold tracking-widest">
            {referralCode}
          </code>
          <Button variant="outline" size="icon" onClick={onCopy}>
            <Copy />
          </Button>
        </div>
        <Button className="mt-4 w-full" onClick={onShare}>
          <Share2 className="size-4" /> Share Referral Link
        </Button>
      </CardContent>
    </Card>
  );
}

export function ReferralsHowItWorksCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-4 font-semibold">How it works</h3>
        <ol className="space-y-4">
          {[
            "Share your unique referral code with friends",
            "They sign up and complete their first booking",
            "You both receive ₹100 in your wallet",
          ].map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="bg-primary text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export function ReferralsListSection({ referrals, pendingCount }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Your Referrals</h3>
        {pendingCount > 0 ? (
          <Badge variant="warning">{pendingCount} pending</Badge>
        ) : null}
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
                {ref.reward > 0 ? (
                  <p className="text-success mt-1 text-sm font-semibold">+{formatCurrency(ref.reward)}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ReferralsContent({
  referralCode,
  referrals,
  totalInvited,
  joinedCount,
  totalEarned,
  pendingCount,
  onCopy,
  onShare,
}) {
  return (
    <div className="space-y-6">
      <ReferralsHeroCard />
      <ReferralsStatsGrid
        totalInvited={totalInvited}
        joinedCount={joinedCount}
        totalEarned={totalEarned}
      />
      <ReferralCodeCard referralCode={referralCode} onCopy={onCopy} onShare={onShare} />
      <ReferralsHowItWorksCard />
      <ReferralsListSection referrals={referrals} pendingCount={pendingCount} />
    </div>
  );
}

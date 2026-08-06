"use client";

import { Star } from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentProvider } from "@/mock/providers";
import { ratingsOverview } from "@/mock/ratings";
import { getReviewsByProvider } from "@/mock/reviews";
import { formatRelativeTime } from "@/utils/format.utils";

export default function ProviderRatingsPage() {
  const reviews = getReviewsByProvider(currentProvider.id);
  const displayReviews = reviews.length > 0 ? reviews : require("@/mock/reviews").reviews.slice(0, 15);
  const overview = ratingsOverview;
  const total = Object.values(overview.distribution).reduce((a, b) => a + b, 0);

  return (
    <>
      <ProviderHeader title="Ratings & Reviews" />
      <main className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-5xl font-bold">{overview.averageRating}</p>
              <div className="mt-2 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-5 ${star <= Math.round(overview.averageRating) ? "fill-warning text-warning" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{overview.totalRatings} total ratings</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = overview.distribution[star] || 0;
                const pct = total ? (count / total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="flex w-8 items-center gap-1 text-sm">
                      {star} <Star className="fill-warning text-warning size-3" />
                    </span>
                    <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                      <div className="gradient-brand h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-muted-foreground w-10 text-right text-xs">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Reviews</CardTitle>
            <Badge>{displayReviews.length} reviews</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {displayReviews.map((review) => (
              <div key={review.id} className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <Avatar src={review.userAvatar} name={review.userName} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{review.userName}</p>
                      <span className="text-muted-foreground text-xs">{formatRelativeTime(review.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3.5 ${s <= review.rating ? "fill-warning text-warning" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
                    {review.reply && (
                      <div className="bg-muted/50 mt-3 rounded-lg p-3">
                        <p className="text-xs font-medium">Your reply</p>
                        <p className="text-muted-foreground mt-1 text-sm">{review.reply.comment}</p>
                      </div>
                    )}
                    {!review.reply && (
                      <Button variant="ghost" size="sm" className="mt-2">Reply</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}

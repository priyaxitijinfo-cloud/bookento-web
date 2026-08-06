"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { UserBottomNav, UserHeader } from "@/components/layout/user-nav";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { providerDetailRoute } from "@/constants/routes.constants";
import { currentUser } from "@/mock/users";
import { reviews } from "@/mock/reviews";
import { mockProviders } from "@/mock/providers";
import { formatRelativeTime } from "@/utils/format.utils";

export default function ReviewsPage() {
  const userReviews = reviews.filter((r) => r.userId === currentUser.id);
  const providerMap = new Map(mockProviders.map((p) => [p.id, p]));

  return (
    <div className="bg-background min-h-dvh pb-20 md:pb-6">
      <UserHeader title="My Reviews" />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-6">
        <p className="text-muted-foreground text-sm">
          {userReviews.length} review{userReviews.length !== 1 ? "s" : ""} written
        </p>

        {userReviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description="Share your experience after completing a booking."
          />
        ) : (
          userReviews.map((review) => {
            const provider = providerMap.get(review.providerId);
            return (
              <Card key={review.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    {provider && (
                      <Link href={providerDetailRoute(provider.id)} className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                        <Image src={provider.avatar} alt={provider.businessName} fill className="object-cover" />
                      </Link>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link href={provider ? providerDetailRoute(provider.id) : "#"} className="font-semibold hover:underline">
                          {provider?.businessName || "Provider"}
                        </Link>
                        <span className="text-muted-foreground text-xs">{formatRelativeTime(review.createdAt)}</span>
                      </div>
                      <div className="mt-1 flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">{review.comment}</p>
                      {review.reply && (
                        <div className="bg-muted mt-3 rounded-xl p-3">
                          <p className="text-xs font-medium">Provider Response</p>
                          <p className="text-muted-foreground mt-1 text-sm">{review.reply.comment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </main>
      <UserBottomNav />
    </div>
  );
}

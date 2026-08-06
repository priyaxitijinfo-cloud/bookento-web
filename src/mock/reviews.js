import { avatarUrl, generateId, isoDate, personName, reviewComment } from "./helpers";
import { mockProviders } from "./providers";
import { currentUser } from "./users";

export const ratingsOverview = {
  averageRating: 4.7,
  totalRatings: 1248,
  distribution: { 5: 820, 4: 312, 3: 78, 2: 25, 1: 13 },
};

export const reviews = Array.from({ length: 30 }, (_, i) => {
  const provider = mockProviders[i % mockProviders.length];
  const userName = i < 12 ? currentUser.name : personName(i + 10);

  return {
    id: generateId("rev", i + 1),
    providerId: provider.id,
    userId: i < 12 ? currentUser.id : generateId("user", i + 2),
    userName,
    userAvatar: i < 12 ? currentUser.avatar : avatarUrl(`reviewer-${i}`),
    rating: Math.min(5, 4 + (i % 2)),
    comment: reviewComment(i),
    likes: 12 + (i % 48),
    isLiked: i % 4 === 0,
    reply: i % 5 === 0 ? {
      id: generateId("reply", i + 1),
      comment: "Thank you for your wonderful feedback! We look forward to serving you again.",
      createdAt: isoDate(i - 1),
    } : null,
    createdAt: isoDate(i * 3),
  };
});

export function getReviewsByProvider(providerId) {
  const matched = reviews.filter((r) => r.providerId === providerId);
  if (matched.length > 0) return matched;

  const provider = mockProviders.find((item) => item.id === providerId);
  if (!provider) return [];

  const providerIndex = mockProviders.findIndex((item) => item.id === providerId);

  return Array.from({ length: 4 }, (_, i) => ({
    id: generateId("rev", 500 + providerIndex * 10 + i + 1),
    providerId,
    userId: generateId("user", i + 40),
    userName: personName(i + 40),
    userAvatar: avatarUrl(`provider-review-${providerIndex}-${i}`),
    rating: 4 + (i % 2),
    comment: reviewComment(i + 3),
    likes: 18 + (i % 35),
    isLiked: false,
    reply: i === 0 ? {
      id: generateId("reply", 500 + providerIndex * 10 + i + 1),
      comment: "Thank you for sharing your experience with us!",
      createdAt: isoDate(i + 1),
    } : null,
    createdAt: isoDate(i * 4 + 2),
  }));
}

export function getRatingOverview(providerId) {
  const providerReviews = getReviewsByProvider(providerId);
  if (!providerReviews.length) return ratingsOverview;
  const avg = providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length;
  return { ...ratingsOverview, averageRating: Number(avg.toFixed(1)), totalRatings: providerReviews.length };
}

import { avatarUrl, generateId, isoDate, personName, reviewComment } from "./helpers";
import { currentProvider, mockProviders } from "./providers";
import { currentUser } from "./users";

/** Provider My Ratings overview — matches Figma filled state */
export const ratingsOverview = {
  averageRating: 4.68,
  totalRatings: 500,
  scoreOutOf10: 9.8,
  totalUsers: 1684,
  distribution: { 5: 920, 4: 780, 3: 95, 2: 180, 1: 90 },
};

/** Empty My Ratings overview — Figma still shows user count under empty score */
export const emptyRatingsOverview = {
  averageRating: 0,
  totalRatings: 0,
  scoreOutOf10: 0,
  totalUsers: 1684,
  distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
};

/** Stable timestamps near "today" (2026-10-09) for Figma-style relative labels. */
const REVIEW_DATES = {
  d6: "2026-10-03T10:00:00.000Z",
  d10: "2026-09-29T10:00:00.000Z",
  d11: "2026-09-28T10:00:00.000Z",
  d12: "2026-09-27T10:00:00.000Z",
  d14: "2026-09-25T10:00:00.000Z",
  d18: "2026-09-21T10:00:00.000Z",
  d22: "2026-09-17T10:00:00.000Z",
};

/** Curated reviews for the logged-in provider (Figma sample content) */
export const providerMyReviews = [
  {
    id: "provider_rev_1",
    providerId: currentProvider.id,
    userId: "user_charlotte",
    userName: "Charlotte Hanlin",
    userAvatar: avatarUrl("charlotte-hanlin"),
    rating: 5,
    comment:
      "Dr. Jenny is very professional in her work and responsive. I have consulted and my problem is solved.",
    likes: 965,
    isLiked: true,
    reply: null,
    createdAt: REVIEW_DATES.d6,
  },
  {
    id: "provider_rev_2",
    providerId: currentProvider.id,
    userId: "user_darron",
    userName: "Darron Kulikowaki",
    userAvatar: avatarUrl("darron-kulikowaki"),
    rating: 4,
    comment:
      "The doctor is very beautiful and the service is excellent! I like it and want to consult again.",
    likes: 365,
    isLiked: false,
    reply: null,
    createdAt: REVIEW_DATES.d10,
  },
  {
    id: "provider_rev_3",
    providerId: currentProvider.id,
    userId: "user_ananya",
    userName: "Ananya Desai",
    userAvatar: avatarUrl("ananya-desai"),
    rating: 5,
    comment:
      "Smooth booking process and friendly staff. The doctor explained everything clearly and made me feel comfortable.",
    likes: 242,
    isLiked: false,
    reply: null,
    createdAt: REVIEW_DATES.d12,
  },
  {
    id: "provider_rev_4",
    providerId: currentProvider.id,
    userId: "user_priya",
    userName: "Priya Shah",
    userAvatar: avatarUrl("priya-shah-review"),
    rating: 4,
    comment:
      "Very professional and caring doctor. The consultation was detailed and the staff was helpful throughout.",
    likes: 165,
    isLiked: false,
    reply: {
      id: "provider_reply_4",
      comment:
        "Thank you for sharing your experience. We're glad the consultation was helpful for you.",
      createdAt: REVIEW_DATES.d11,
    },
    createdAt: REVIEW_DATES.d14,
  },
  {
    id: "provider_rev_5",
    providerId: currentProvider.id,
    userId: "user_rahul",
    userName: "Rahul Mehta",
    userAvatar: avatarUrl("rahul-mehta-review"),
    rating: 5,
    comment:
      "Excellent experience. Clear diagnosis, minimal wait time, and a very clean clinic environment.",
    likes: 428,
    isLiked: false,
    reply: null,
    createdAt: REVIEW_DATES.d18,
  },
  {
    id: "provider_rev_6",
    providerId: currentProvider.id,
    userId: "user_sneha",
    userName: "Sneha Kapoor",
    userAvatar: avatarUrl("sneha-kapoor-review"),
    rating: 5,
    comment:
      "Felt heard and cared for. Follow-up instructions were clear and easy to follow.",
    likes: 198,
    isLiked: false,
    reply: null,
    createdAt: REVIEW_DATES.d22,
  },
];

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
    reply:
      i % 5 === 0
        ? {
            id: generateId("reply", i + 1),
            comment:
              "Thank you for your wonderful feedback! We look forward to serving you again.",
            createdAt: isoDate(i - 1),
          }
        : null,
    createdAt: isoDate(i * 3),
  };
});

export function getReviewsByProvider(providerId) {
  if (providerId === currentProvider.id) {
    return providerMyReviews;
  }

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
    reply:
      i === 0
        ? {
            id: generateId("reply", 500 + providerIndex * 10 + i + 1),
            comment: "Thank you for sharing your experience with us!",
            createdAt: isoDate(i + 1),
          }
        : null,
    createdAt: isoDate(i * 4 + 2),
  }));
}

export function getRatingOverview(providerId, { empty = false } = {}) {
  if (empty) return emptyRatingsOverview;
  if (providerId === currentProvider.id) return ratingsOverview;

  const providerReviews = getReviewsByProvider(providerId);
  if (!providerReviews.length) return ratingsOverview;
  const avg =
    providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length;
  return {
    ...ratingsOverview,
    averageRating: Number(avg.toFixed(1)),
    totalRatings: providerReviews.length,
  };
}

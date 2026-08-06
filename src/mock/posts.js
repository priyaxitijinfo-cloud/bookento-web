import { generateId, imageUrl, isoDate } from "./helpers";
import { mockProviders } from "./providers";

export const posts = Array.from({ length: 40 }, (_, i) => {
  const provider = mockProviders[i % mockProviders.length];
  return {
    id: generateId("post", i + 1),
    providerId: provider.id,
    providerName: provider.businessName,
    providerAvatar: provider.avatar,
    image: imageUrl(`post-${i}`, 600, 600),
    caption: `Fresh updates from ${provider.businessName}. Book ${provider.specialty.toLowerCase()} services this week.`,
    hashtags: ["#bookento", "#services", "#quality"],
    visibility: "public",
    likes: 45 + (i % 200),
    comments: 5 + (i % 30),
    isLiked: i % 4 === 0,
    createdAt: isoDate(i * 4),
  };
});

export function getPostsByProvider(providerId) {
  return posts.filter((p) => p.providerId === providerId);
}

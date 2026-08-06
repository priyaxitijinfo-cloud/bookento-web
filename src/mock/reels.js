import { DOCTOR_REELS, DOCTOR_VIDEO_FILES } from "@/constants/doctor-booking.constants";

import { generateId, isoDate } from "./helpers";
import { mockProviders } from "./providers";

export const reels = Array.from({ length: 20 }, (_, i) => {
  const provider = mockProviders[i % 20];
  const sample = DOCTOR_REELS[i % DOCTOR_REELS.length];
  const videoFile = DOCTOR_VIDEO_FILES[i % DOCTOR_VIDEO_FILES.length];
  const videoUrl = `/videos/${videoFile}`;

  return {
    id: generateId("reel", i + 1),
    providerId: provider.id,
    providerName: provider.businessName,
    providerAvatar: provider.avatar,
    handle: sample.handle || provider.businessName,
    videoUrl,
    thumbnailUrl: videoUrl,
    title: sample.title,
    caption: sample.caption,
    hashtags: ["#bookento", "#trending", `#${provider.specialty.replace(/\s/g, "")}`],
    likes: sample.likes,
    comments: sample.comments,
    shares: sample.shares,
    views: sample.views,
    isLiked: i % 3 === 0,
    packageId: sample.packageId || null,
    linkedPackageId: sample.packageId || (i % 3 === 0 ? `pkg_${String(i + 1).padStart(4, "0")}` : null),
    linkedServiceId: i % 2 === 0 ? `svc_${String(i + 1).padStart(4, "0")}` : null,
    isPopular: sample.isPopular !== false,
    isNearby: sample.isNearby !== false,
    createdAt: isoDate(i * 2),
  };
});

export function getReelById(id) {
  return reels.find((r) => r.id === id);
}

export function getReelsByProvider(providerId) {
  const matched = reels.filter((reel) => reel.providerId === providerId);
  return matched.length > 0 ? matched : reels.slice(0, 6);
}

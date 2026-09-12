import { DOCTOR_REELS, DOCTOR_VIDEO_FILES } from "@/constants/doctor-booking.constants";

import { generateId, isoDate } from "./helpers";
import { mockProviders } from "./providers";

const REEL_POSTERS = Array.from(
  { length: 9 },
  (_, i) => `/images/doctor-videos/video-${i + 1}.png`,
);

const REEL_TITLES = [
  "Salon glow-up in 60 seconds",
  "Spa day you’ll want to book",
  "Clinic tour & care experience",
  "Home workout with a pro",
  "Pet grooming before & after",
  "Deep clean home makeover",
  "Teeth whitening results",
  "Weekend wellness routine",
  "Personal training highlights",
  "Beauty tips from top stylists",
];

const REEL_CAPTIONS = [
  "Watch the process, then book the same package in a tap.",
  "Real providers. Real results. Book nearby slots instantly.",
  "See the space, meet the pro, and reserve with confidence.",
  "Short reels, clear vibes — discover services you’ll love.",
  "Trusted Bookento pros sharing what they do best.",
];

export const reels = Array.from({ length: 20 }, (_, i) => {
  const provider = mockProviders[i % 20];
  const sample = DOCTOR_REELS[i % DOCTOR_REELS.length];
  const videoFile = DOCTOR_VIDEO_FILES[i % DOCTOR_VIDEO_FILES.length];
  const videoUrl = `/videos/${videoFile}`;
  const poster = REEL_POSTERS[i % REEL_POSTERS.length];

  return {
    id: generateId("reel", i + 1),
    providerId: provider.id,
    providerName: provider.businessName,
    providerAvatar: provider.avatar,
    handle: sample.handle || provider.businessName,
    videoUrl,
    thumbnailUrl: poster,
    poster,
    title: REEL_TITLES[i % REEL_TITLES.length] || sample.title,
    caption: REEL_CAPTIONS[i % REEL_CAPTIONS.length] || sample.caption,
    hashtags: ["#bookento", "#trending", `#${provider.specialty.replace(/\s/g, "")}`],
    likes: sample.likes,
    comments: sample.comments,
    shares: sample.shares,
    views: sample.views,
    isLiked: i % 3 === 0,
    packageId: sample.packageId || null,
    linkedPackageId:
      sample.packageId ||
      (i % 3 === 0 ? `pkg_${String(i + 1).padStart(4, "0")}` : null),
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

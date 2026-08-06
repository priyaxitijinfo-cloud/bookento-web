import { generateId, imageUrl } from "./helpers";
import { mockProviders } from "./providers";

const GALLERY_CAPTIONS = [
  "Treatment room",
  "Reception area",
  "Before & after results",
  "Team at work",
  "Premium equipment",
  "Client experience",
  "Facility tour",
  "Wellness lounge",
];

export const gallery = {};

mockProviders.forEach((provider, pi) => {
  gallery[provider.id] = Array.from({ length: 6 + (pi % 4) }, (_, i) => ({
    id: generateId("gal", pi * 10 + i + 1),
    providerId: provider.id,
    url: imageUrl(`gallery-${provider.id}-${i}`, 600, 400),
    caption: GALLERY_CAPTIONS[i % GALLERY_CAPTIONS.length],
    type: i % 6 === 0 ? "video" : "image",
    sortOrder: i + 1,
  }));
});

export function getGalleryByProvider(providerId) {
  return gallery[providerId] || [];
}

import { generateId } from "./helpers";
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

/** Shared local assets — avoid broken remote Unsplash URLs in profile galleries */
const LOCAL_GALLERY_IMAGES = [
  "/images/doctor-gallery/gallery-1.png",
  "/images/doctor-gallery/gallery-2.png",
  "/images/doctor-gallery/gallery-3.png",
  "/images/doctor-gallery/gallery-4.png",
  "/images/doctor-gallery/gallery-5.png",
  "/images/doctor-gallery/gallery-6.png",
  "/images/doctor-gallery/gallery-7.png",
  "/images/nearby-glow-salon.png",
  "/images/nearby-serene-spa.png",
  "/images/nearby-bright-dental.png",
  "/images/nearby-fitzone-gym.png",
  "/images/nearby-pure-home-care.png",
  "/images/popular-haircut.png",
  "/images/popular-massage.png",
  "/images/popular-fitness.png",
  "/images/promo-pet-grooming.jpg",
  "/images/special-package-pet-care.png",
  "/images/special-package-home-cleaning.png",
  "/images/promo-selfcare-spa.jpg",
  "/images/top-rated-urban-salon.png",
];

export const gallery = {};

mockProviders.forEach((provider, pi) => {
  gallery[provider.id] = Array.from({ length: 6 + (pi % 4) }, (_, i) => ({
    id: generateId("gal", pi * 10 + i + 1),
    providerId: provider.id,
    url: LOCAL_GALLERY_IMAGES[(pi * 3 + i) % LOCAL_GALLERY_IMAGES.length],
    caption: GALLERY_CAPTIONS[i % GALLERY_CAPTIONS.length],
    type: "image",
    sortOrder: i + 1,
  }));
});

export function getGalleryByProvider(providerId) {
  return gallery[providerId] || [];
}

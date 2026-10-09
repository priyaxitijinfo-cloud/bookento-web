import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

const PHOTO_SEEDS = [
  "/images/doctor-gallery/gallery-1.png",
  "/images/doctor-gallery/gallery-2.png",
  "/images/doctor-gallery/gallery-3.png",
  "/images/doctor-gallery/gallery-4.png",
  "/images/doctor-gallery/gallery-5.png",
  "/images/doctor-gallery/gallery-6.png",
  "/images/doctor-gallery/gallery-7.png",
  "/images/nearby-bright-dental.png",
  "/images/nearby-pure-home-care.png",
  "/images/popular-dental.png",
  "/images/online-consultations-photo.png",
];

const VIDEO_THUMBS = [
  "/images/doctor-videos/video-1.png",
  "/images/doctor-videos/video-2.png",
  "/images/doctor-videos/video-3.png",
  "/images/doctor-videos/video-4.png",
  "/images/doctor-videos/video-5.png",
  "/images/doctor-videos/video-6.png",
];

export const SAMPLE_MEDIA_PACKAGES = [
  {
    id: "mpkg_1",
    name: "Women's Wellness Package",
    duration: 45,
    originalPrice: 2500,
    price: 1500,
    discountPercent: 40,
  },
  {
    id: "mpkg_2",
    name: "Holistic Care Package",
    duration: 30,
    originalPrice: 19000,
    price: 15000,
    discountPercent: 50,
  },
  {
    id: "mpkg_3",
    name: "Complete Care Package",
    duration: 45,
    originalPrice: 3000,
    price: 2000,
    discountPercent: 20,
  },
];

function createPhotoId() {
  return `pphoto_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function createVideoId() {
  return `pvid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const SAMPLE_PROVIDER_PHOTOS = PHOTO_SEEDS.map((url, index) => ({
  id: `pphoto_seed_${index + 1}`,
  url,
  createdAt: new Date(Date.now() - index * 86400000).toISOString(),
}));

export const SAMPLE_PROVIDER_VIDEOS = [
  {
    id: "pvid_seed_1",
    title: "Advanced Surgical Techniques | Expert Insights",
    description:
      "In this video, our expert surgeons explain advanced surgical techniques and best practices that ensure better patient outcomes and faster recovery.",
    thumbnail: VIDEO_THUMBS[0],
    duration: "00.45",
    views: 125500,
    discountType: "packages",
    linkedIds: ["mpkg_2"],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "pvid_seed_2",
    title: "Clinic Tour & Patient Care",
    description:
      "A quick look at our clinic facilities and how we care for patients every day.",
    thumbnail: VIDEO_THUMBS[1],
    duration: "00.32",
    views: 341400,
    discountType: "service",
    linkedIds: ["psvc_1"],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pvid_seed_3",
    title: "Wellness Tips From Our Team",
    description:
      "Short tips from our providers to help you stay healthy between visits.",
    thumbnail: VIDEO_THUMBS[2],
    duration: "01.05",
    views: 89200,
    discountType: "packages",
    linkedIds: ["mpkg_1"],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "pvid_seed_4",
    title: "Before & After Recovery Journey",
    description: "See how patients recover with guided care and follow-up support.",
    thumbnail: VIDEO_THUMBS[3],
    duration: "00.58",
    views: 156000,
    discountType: "service",
    linkedIds: ["psvc_2"],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "pvid_seed_5",
    title: "Meet Our Specialists",
    description: "Get to know the specialists behind Bookento care.",
    thumbnail: VIDEO_THUMBS[4],
    duration: "00.41",
    views: 210300,
    discountType: "packages",
    linkedIds: [],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "pvid_seed_6",
    title: "Home Care Essentials",
    description: "Simple home-care routines recommended by our clinicians.",
    thumbnail: VIDEO_THUMBS[5],
    duration: "00.50",
    views: 97800,
    discountType: "service",
    linkedIds: [],
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
];

export const emptyVideoForm = () => ({
  title: "",
  description: "",
  thumbnail: "",
  duration: "00.00",
  discountType: "service",
  linkedIds: [],
});

export function videoToForm(video) {
  if (!video) return emptyVideoForm();
  return {
    title: video.title || "",
    description: video.description || "",
    thumbnail: video.thumbnail || "",
    duration: video.duration || "00.00",
    discountType: video.discountType || "service",
    linkedIds: Array.isArray(video.linkedIds) ? [...video.linkedIds] : [],
  };
}

function normalizeVideo(form, existingId, existing) {
  return {
    id: existingId || createVideoId(),
    title: (form.title || "").trim() || "Untitled Video",
    description: (form.description || "").trim(),
    thumbnail:
      form.thumbnail ||
      existing?.thumbnail ||
      VIDEO_THUMBS[Math.floor(Math.random() * VIDEO_THUMBS.length)],
    duration: form.duration || existing?.duration || "00.45",
    views: existing?.views ?? 0,
    discountType: form.discountType === "packages" ? "packages" : "service",
    linkedIds: Array.isArray(form.linkedIds) ? form.linkedIds : [],
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
}

export function formatCompactViews(views) {
  const n = Number(views) || 0;
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}K`;
  }
  return String(n);
}

export const useProviderMediaStore = create(
  devtools(
    persist(
      (set, get) => ({
        photos: SAMPLE_PROVIDER_PHOTOS,
        videos: SAMPLE_PROVIDER_VIDEOS,
        packages: SAMPLE_MEDIA_PACKAGES,

        getVideoById: (id) => get().videos.find((v) => v.id === id),

        addPhotos: (urls) => {
          const next = (urls || [])
            .filter(Boolean)
            .slice(0, 5)
            .map((url) => ({
              id: createPhotoId(),
              url,
              createdAt: new Date().toISOString(),
            }));
          if (!next.length) return [];
          set((state) => ({ photos: [...next, ...state.photos] }));
          return next;
        },

        deletePhoto: (id) => {
          set((state) => ({
            photos: state.photos.filter((p) => p.id !== id),
          }));
        },

        addVideo: (form) => {
          const video = normalizeVideo(form);
          set((state) => ({ videos: [video, ...state.videos] }));
          return video;
        },

        updateVideo: (id, form) => {
          const existing = get().getVideoById(id);
          const video = normalizeVideo(form, id, existing);
          set((state) => ({
            videos: state.videos.map((v) => (v.id === id ? video : v)),
          }));
          return video;
        },

        deleteVideo: (id) => {
          set((state) => ({
            videos: state.videos.filter((v) => v.id !== id),
          }));
        },

        resetToSample: () =>
          set({
            photos: SAMPLE_PROVIDER_PHOTOS,
            videos: SAMPLE_PROVIDER_VIDEOS,
            packages: SAMPLE_MEDIA_PACKAGES,
          }),
      }),
      createPersistOptions({ name: "bookento-provider-media" }),
    ),
    { name: "ProviderMediaStore" },
  ),
);

import { services } from "@/mock/services";

export const POPULAR_SERVICE_IMAGES = [
  "/images/popular-haircut.png",
  "/images/popular-massage.png",
  "/images/popular-dental.png",
  "/images/popular-fitness.png",
];

export const HOME_POPULAR_SERVICES = [
  {
    ...services[0],
    price: 299,
    image: POPULAR_SERVICE_IMAGES[0],
    title: "Haircut & Styling",
    tagline: "Look your best",
    duration: "45 min",
    categorySlug: "salon",
  },
  {
    ...services[1],
    price: 499,
    image: POPULAR_SERVICE_IMAGES[1],
    title: "Deep Tissue Massage",
    tagline: "Relax & rejuvenate",
    duration: "60 min",
    categorySlug: "salon",
  },
  {
    ...services[2],
    price: 699,
    image: POPULAR_SERVICE_IMAGES[2],
    title: "Teeth Cleaning",
    tagline: "Brighten your smile",
    duration: "30 min",
    categorySlug: "doctor",
  },
  {
    ...services[3],
    price: 899,
    image: POPULAR_SERVICE_IMAGES[3],
    title: "Personal Training",
    tagline: "Fitness & strength",
    duration: "50 min",
    categorySlug: "fitness",
  },
];

function shortTagline(description) {
  if (!description) return "Book today";
  const first = description.split(".")[0]?.trim() ?? "";
  if (first.length <= 52) return first;
  return `${first.slice(0, 49)}...`;
}

export function formatDuration(duration) {
  if (duration == null) return null;
  if (typeof duration === "number") return `${duration} min`;
  return duration;
}

export function toServiceCardModel(service) {
  return {
    ...service,
    title: service.title ?? service.name,
    tagline: service.tagline ?? shortTagline(service.description),
    duration: formatDuration(service.duration),
  };
}

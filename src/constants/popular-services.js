import { services } from "@/mock/services";
import { HOME_CATEGORIES } from "@/constants/home-categories";

export const POPULAR_SERVICE_IMAGES = [
  "/images/popular-haircut.png",
  "/images/popular-massage.png",
  "/images/popular-dental.png",
  "/images/popular-fitness.png",
];

/** Original curated popular services — used on web/desktop. */
export const WEB_HOME_POPULAR_SERVICES = [
  {
    ...services[0],
    price: 299,
    image: POPULAR_SERVICE_IMAGES[0],
    title: "Haircut & Styling",
    titleKey: "popularServiceHaircut",
    tagline: "Look your best",
    duration: "45 min",
    categorySlug: "salon",
  },
  {
    ...services[1],
    price: 499,
    image: POPULAR_SERVICE_IMAGES[1],
    title: "Deep Tissue Massage",
    titleKey: "popularServiceMassage",
    tagline: "Relax & rejuvenate",
    duration: "60 min",
    categorySlug: "salon",
  },
  {
    ...services[2],
    price: 699,
    image: POPULAR_SERVICE_IMAGES[2],
    title: "Teeth Cleaning",
    titleKey: "popularServiceDental",
    tagline: "Brighten your smile",
    duration: "30 min",
    categorySlug: "doctor",
  },
  {
    ...services[3],
    price: 899,
    image: POPULAR_SERVICE_IMAGES[3],
    title: "Personal Training",
    titleKey: "popularServiceTraining",
    tagline: "Fitness & strength",
    duration: "50 min",
    categorySlug: "fitness",
  },
];

const POPULAR_BY_CATEGORY = [
  {
    categorySlug: "salon",
    title: "Haircut & Styling",
    tagline: "Look your best",
    duration: "45 min",
    price: 299,
    image: POPULAR_SERVICE_IMAGES[0],
  },
  {
    categorySlug: "salon",
    title: "Deep Tissue Massage",
    tagline: "Relax & rejuvenate",
    duration: "60 min",
    price: 499,
    image: POPULAR_SERVICE_IMAGES[1],
  },
  {
    categorySlug: "doctor",
    title: "General Consultation",
    tagline: "Expert medical advice",
    duration: "30 min",
    price: 699,
    image: POPULAR_SERVICE_IMAGES[2],
  },
  {
    categorySlug: "fitness",
    title: "Personal Training",
    tagline: "Fitness & strength",
    duration: "50 min",
    price: 899,
    image: POPULAR_SERVICE_IMAGES[3],
  },
  {
    categorySlug: "tutoring",
    title: "Math Tutoring",
    tagline: "Clear concepts fast",
    duration: "60 min",
    price: 599,
    image: POPULAR_SERVICE_IMAGES[0],
  },
  {
    categorySlug: "pet-care",
    title: "Pet Grooming",
    tagline: "Fresh & happy pets",
    duration: "45 min",
    price: 799,
    image: POPULAR_SERVICE_IMAGES[1],
  },
  {
    categorySlug: "homecare",
    title: "Elder Care Visit",
    tagline: "Trusted home support",
    duration: "60 min",
    price: 999,
    image: POPULAR_SERVICE_IMAGES[2],
  },
  {
    categorySlug: "kids-care",
    title: "Babysitting Session",
    tagline: "Safe childcare",
    duration: "120 min",
    price: 849,
    image: POPULAR_SERVICE_IMAGES[3],
  },
  {
    categorySlug: "plumbing",
    title: "Pipe Repair",
    tagline: "Quick home fixes",
    duration: "40 min",
    price: 549,
    image: POPULAR_SERVICE_IMAGES[0],
  },
  {
    categorySlug: "automotive",
    title: "Car Wash & Detailing",
    tagline: "Showroom shine",
    duration: "50 min",
    price: 699,
    image: POPULAR_SERVICE_IMAGES[1],
  },
  {
    categorySlug: "gardening",
    title: "Garden Maintenance",
    tagline: "Green & tidy",
    duration: "90 min",
    price: 799,
    image: POPULAR_SERVICE_IMAGES[2],
  },
  {
    categorySlug: "cooking",
    title: "Home Chef Meal",
    tagline: "Fresh home cooking",
    duration: "75 min",
    price: 1199,
    image: POPULAR_SERVICE_IMAGES[3],
  },
  {
    categorySlug: "events",
    title: "Birthday Planning",
    tagline: "Stress-free celebrations",
    duration: "120 min",
    price: 2499,
    image: POPULAR_SERVICE_IMAGES[0],
  },
  {
    categorySlug: "carpenter",
    title: "Furniture Repair",
    tagline: "Solid craftsmanship",
    duration: "60 min",
    price: 899,
    image: POPULAR_SERVICE_IMAGES[1],
  },
  {
    categorySlug: "renovation",
    title: "Wall Painting",
    tagline: "Fresh home makeover",
    duration: "180 min",
    price: 3499,
    image: POPULAR_SERVICE_IMAGES[2],
  },
  {
    categorySlug: "shooting",
    title: "Portrait Photography",
    tagline: "Capture every moment",
    duration: "60 min",
    price: 1999,
    image: POPULAR_SERVICE_IMAGES[3],
  },
];

/** Expanded category list — used on mobile. */
export const HOME_POPULAR_SERVICES = POPULAR_BY_CATEGORY.map((item, index) => {
  const base = services[index % services.length];
  const category = HOME_CATEGORIES.find((entry) => entry.slug === item.categorySlug);

  return {
    ...base,
    id: `popular_${item.categorySlug}_${index + 1}`,
    categoryId: category?.categoryId ?? base.categoryId,
    name: item.title,
    title: item.title,
    tagline: item.tagline,
    duration: item.duration,
    price: item.price,
    image: item.image,
    categorySlug: item.categorySlug,
    isPopular: true,
  };
});

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

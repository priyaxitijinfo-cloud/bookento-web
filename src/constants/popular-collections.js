import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";

/** Web-only collection tiles inspired by marketplace “care collections” layout. */
export const WEB_POPULAR_COLLECTIONS = [
  {
    id: "collection-salon",
    href: categoryListingRoute("salon"),
    image: "/images/nearby-glow-salon.png",
    imageFocus: "object-[center_30%]",
    titleKey: "popularCollectionSalonTitle",
    bodyKey: "popularCollectionSalonBody",
  },
  {
    id: "collection-doctor",
    href: categoryListingRoute("doctor"),
    image: "/images/top-rated-royal-clinic.png",
    imageFocus: "object-[center_20%]",
    titleKey: "popularCollectionDoctorTitle",
    bodyKey: "popularCollectionDoctorBody",
  },
  {
    id: "collection-tutoring",
    href: categoryListingRoute("tutoring"),
    image: "/images/popular-fitness.png",
    imageFocus: "object-center",
    titleKey: "popularCollectionTutorTitle",
    bodyKey: "popularCollectionTutorBody",
  },
];

export const POPULAR_COLLECTIONS_SEE_ALL_HREF = ROUTES.CATEGORIES;

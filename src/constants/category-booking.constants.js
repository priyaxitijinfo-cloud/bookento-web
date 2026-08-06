import { CATEGORY_LISTING_CONFIG } from "@/constants/category-listing.constants";
import {
  DOCTOR_ABOUT_DESCRIPTION,
  DOCTOR_BOOKING_SERVICES,
  DOCTOR_GALLERY,
  DOCTOR_REELS,
  DOCTOR_WELLNESS_PACKAGES,
} from "@/constants/doctor-booking.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { imageUrl } from "@/mock/helpers";

const SERVICE_BLUEPRINT = [
  { label: "Consultation", duration: 30, price: 1500, originalPrice: 2200 },
  { label: "Standard Session", duration: 45, price: 2500, originalPrice: 3200 },
  { label: "Premium Session", duration: 60, price: 4200, originalPrice: 5200 },
  { label: "Follow-up Visit", duration: 25, price: 1200, originalPrice: 1800 },
  { label: "Express Service", duration: 20, price: 900, originalPrice: 1400 },
  { label: "Complete Care Package", duration: 90, price: 6500, originalPrice: 8200 },
];

const PACKAGE_THEMES = ["rose", "blue", "amber"];

function buildCategoryServices(slug, config, categoryName) {
  return SERVICE_BLUEPRINT.map((item, index) => {
    const specialty = config.specialties[index % config.specialties.length];

    return {
      id: `${slug}_svc_${index + 1}`,
      name: `${specialty} ${item.label}`,
      duration: item.duration,
      price: item.price,
      originalPrice: item.originalPrice,
    };
  });
}

function buildCategoryPackages(slug, categoryName) {
  return [
    {
      id: `${slug}_pkg_1`,
      name: `${categoryName} Essentials`,
      description: `Core ${categoryName.toLowerCase()} services in one convenient plan`,
      image: "/images/packages/wellness-package-1.png",
      features: ["Initial consultation", "Standard service session", "Follow-up guidance", "Flexible scheduling"],
      originalPrice: 6500,
      price: 4800,
      discountPercent: 26,
      theme: PACKAGE_THEMES[0],
    },
    {
      id: `${slug}_pkg_2`,
      name: `${categoryName} Plus`,
      description: `Popular plan for regular ${categoryName.toLowerCase()} needs`,
      image: "/images/packages/wellness-package-2.png",
      features: ["Priority booking", "Extended service time", "Add-on support", "Member savings"],
      originalPrice: 8200,
      price: 5900,
      discountPercent: 28,
      theme: PACKAGE_THEMES[1],
    },
    {
      id: `${slug}_pkg_3`,
      name: `${categoryName} Premium`,
      description: `Best value for comprehensive ${categoryName.toLowerCase()} care`,
      image: "/images/packages/wellness-package-3.png",
      features: ["Full service bundle", "Dedicated support", "Premium slot access", "Exclusive offers"],
      originalPrice: 9800,
      price: 7200,
      discountPercent: 27,
      theme: PACKAGE_THEMES[2],
    },
  ];
}

function buildCategoryGallery(slug, categoryName) {
  const captions = [
    `${categoryName} reception area`,
    "Professional workspace",
    "Consultation room",
    "Service in progress",
    "Client lounge",
    "Team at work",
  ];

  return captions.map((caption, index) => ({
    id: `${slug}_gal_${index + 1}`,
    url: imageUrl(`${slug}-gallery-${index}`, 800, 600),
    caption,
    featured: index === 0,
  }));
}

function buildCategoryAbout(categoryName, providerName) {
  return [
    `${providerName} is a trusted ${categoryName.toLowerCase()} professional known for reliable service, clear communication, and consistent quality. Clients choose this provider for personalized care, flexible visit options, and a smooth booking experience from start to finish.`,
    `Whether you need a quick appointment or a full service plan, every session is handled with attention to detail. The focus is on practical results, transparent pricing, and making it easy to book again whenever you need support.`,
  ];
}

function buildCategoryReels(slug, categoryName) {
  return DOCTOR_REELS.map((reel, index) => ({
    ...reel,
    id: `${slug}_reel_${index + 1}`,
    title: `${categoryName} highlight ${index + 1}`,
    caption: reel.caption.replace(/wellness|health|clinic/gi, categoryName.toLowerCase()),
    handle: `${categoryName} Pro`,
    packageId: `${slug}_pkg_${(index % 3) + 1}`,
  }));
}

const categoryBookingDataCache = new Map();

function buildCategoryBookingData(slug, category, config) {
  return {
    services: buildCategoryServices(slug, config, category.name),
    packages: buildCategoryPackages(slug, category.name),
    gallery: buildCategoryGallery(slug, category.name),
    aboutParagraphs: buildCategoryAbout(category.name, category.name),
    reels: buildCategoryReels(slug, category.name),
  };
}

export function getCategoryBookingData(slug, providerName = "This provider") {
  if (slug === "doctor") {
    return {
      services: DOCTOR_BOOKING_SERVICES,
      packages: DOCTOR_WELLNESS_PACKAGES,
      gallery: DOCTOR_GALLERY,
      aboutParagraphs: DOCTOR_ABOUT_DESCRIPTION,
      reels: DOCTOR_REELS,
    };
  }

  const config = CATEGORY_LISTING_CONFIG[slug];
  const category = getHomeCategoryBySlug(slug);
  if (!config || !category) return null;

  let data = categoryBookingDataCache.get(slug);
  if (!data) {
    data = buildCategoryBookingData(slug, category, config);
    categoryBookingDataCache.set(slug, data);
  }

  if (providerName !== "This provider" && providerName !== category.name) {
    return {
      ...data,
      aboutParagraphs: buildCategoryAbout(category.name, providerName),
    };
  }

  return data;
}

export function getCategoryPackageById(slug, packageId) {
  const data = getCategoryBookingData(slug);
  if (!data) return null;
  return data.packages.find((pkg) => pkg.id === packageId) || null;
}

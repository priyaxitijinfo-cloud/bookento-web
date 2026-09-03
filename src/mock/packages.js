import { HOME_CATEGORIES } from "@/constants/home-categories";
import { getCategoryPackages } from "@/constants/category-packages.constants";
import { FALLBACK_PACKAGE_CATALOG } from "@/constants/provider-catalog.constants";
import { PACKAGE_THEMES } from "@/constants/doctor-booking.constants";
import { generateId, imageUrl, isoDate } from "./helpers";
import { mockProviders } from "./providers";
import { getServicesByProvider } from "./services";

const PACKAGE_IMAGES = [
  "/images/packages/wellness-package-1.png",
  "/images/packages/wellness-package-2.png",
  "/images/packages/wellness-package-3.png",
];

const CATEGORY_ID_TO_SLUG = Object.fromEntries(
  HOME_CATEGORIES.map((category) => [category.categoryId, category.slug]),
);

function resolveCategoryPackages(provider) {
  const slug = CATEGORY_ID_TO_SLUG[provider.categoryId];
  const catalog = slug ? getCategoryPackages(slug) : null;
  if (catalog?.length) return catalog;

  return FALLBACK_PACKAGE_CATALOG.map((template, index) => ({
    id: `generic_pkg_${index + 1}`,
    ...template,
    image: PACKAGE_IMAGES[index % PACKAGE_IMAGES.length],
  }));
}

/** Category-aware packages for every provider — Packages tab always filled. */
export const packages = mockProviders.flatMap((provider, providerIndex) => {
  const providerServices = getServicesByProvider(provider.id);
  const categoryPackages = resolveCategoryPackages(provider);

  return categoryPackages.map((template, packageIndex) => {
    const globalIndex = providerIndex * categoryPackages.length + packageIndex;
    const serviceIds = providerServices
      .slice(0, 2 + (packageIndex % 3))
      .map((service) => service.id);

    return {
      id: generateId("pkg", globalIndex + 1),
      providerId: provider.id,
      providerName: provider.businessName,
      categorySlug: CATEGORY_ID_TO_SLUG[provider.categoryId] || null,
      name: template.name,
      description: template.description,
      image:
        template.image ||
        PACKAGE_IMAGES[packageIndex % PACKAGE_IMAGES.length] ||
        imageUrl(`pkg-${globalIndex}`, 500, 350),
      serviceIds,
      features: template.features,
      originalPrice: template.originalPrice,
      price: template.price,
      discountPercent: template.discountPercent,
      theme: template.theme || ["rose", "blue", "amber"][packageIndex % 3],
      themeStyles: PACKAGE_THEMES[template.theme] || PACKAGE_THEMES.blue,
      duration: 60 + packageIndex * 30,
      validityDays: 30 + packageIndex * 15,
      totalBookings: 20 + (globalIndex % 80),
      rating: provider.rating,
      isFeatured: providerIndex < 15 && packageIndex === 0,
      isActive: true,
      createdAt: isoDate(80 + globalIndex),
      // Preserve category package id for category-flow deep links when same provider is used
      categoryPackageId: template.id,
    };
  });
});

export function getPackageById(id) {
  if (!id) return null;
  return packages.find((p) => p.id === id || p.categoryPackageId === id) || null;
}

export function getPackagesByProvider(providerId) {
  const matched = packages.filter((p) => p.providerId === providerId);
  if (matched.length > 0) return matched;

  return FALLBACK_PACKAGE_CATALOG.map((template, index) => ({
    id: `fallback_pkg_${index + 1}`,
    providerId,
    name: template.name,
    description: template.description,
    image: PACKAGE_IMAGES[index % PACKAGE_IMAGES.length],
    features: template.features,
    originalPrice: template.originalPrice,
    price: template.price,
    discountPercent: template.discountPercent,
    theme: template.theme,
  }));
}

export function getFeaturedPackages(limit = 8) {
  return packages.filter((p) => p.isFeatured).slice(0, limit);
}

export function getPackagesByCategorySlug(slug, limit = 6) {
  return packages.filter((p) => p.categorySlug === slug).slice(0, limit);
}

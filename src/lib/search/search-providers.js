import { HOME_CATEGORIES } from "@/constants/home-categories";
import { getCategoryListingProviders } from "@/mock/category-listing-providers";

const PROVIDERS_PER_CATEGORY = 8;

export function getGlobalSearchProviders() {
  return HOME_CATEGORIES.flatMap((category) =>
    getCategoryListingProviders(category.slug, category.categoryId, "All")
      .slice(0, PROVIDERS_PER_CATEGORY)
      .map((provider) => ({
        ...provider,
        categoryId: category.categoryId,
        categorySlug: category.slug,
        categoryName: category.name,
      })),
  );
}

export const MOBILE_SEARCH_RESULTS_LIMIT = 20;

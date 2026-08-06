// TODO API
// getProviders()
// getProvider(id)

import {
  mockProviders,
  getProviderById,
  getTrendingProviders,
  getNearbyProviders,
  getFeaturedProviders,
  getRecommendedProviders,
} from "@/mock/providers";
import { delay, paginate } from "@/mock/helpers";

export async function getProviders(filters = {}, page = 1) {
  await delay(500);
  let list = [...mockProviders];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.businessName.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q),
    );
  }
  if (filters.categoryId) list = list.filter((p) => p.categoryId === filters.categoryId);
  return paginate(list, page);
}

export async function getProvider(id) {
  await delay(400);
  return getProviderById(id);
}

export async function getHomeProviders() {
  await delay(400);
  return {
    trending: getTrendingProviders(10),
    nearby: getNearbyProviders(10),
    featured: getFeaturedProviders(10),
    recommended: getRecommendedProviders(10),
  };
}

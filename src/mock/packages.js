import { generateId, imageUrl, isoDate } from "./helpers";
import { mockProviders } from "./providers";
import { services } from "./services";

export const packages = Array.from({ length: 20 }, (_, i) => {
  const provider = mockProviders[i % 20];
  const includedServices = services
    .filter((s) => s.providerId === provider.id)
    .slice(0, 2 + (i % 3))
    .map((s) => s.id);
  const basePrice = includedServices.reduce((sum, id) => {
    const svc = services.find((s) => s.id === id);
    return sum + (svc?.price || 0);
  }, 0);
  return {
    id: generateId("pkg", i + 1),
    providerId: provider.id,
    providerName: provider.businessName,
    name: `${["Starter", "Premium", "Deluxe", "Ultimate"][i % 4]} ${provider.specialty} Package`,
    description: `Complete package including ${includedServices.length} services with exclusive savings and priority booking.`,
    image: imageUrl(`pkg-${i}`, 500, 350),
    serviceIds: includedServices,
    originalPrice: basePrice,
    price: Math.round(basePrice * (0.75 + (i % 3) * 0.05)),
    discountPercent: 15 + (i % 4) * 5,
    duration: 60 + (i % 4) * 30,
    validityDays: 30 + (i % 3) * 15,
    totalBookings: 20 + (i % 80),
    rating: provider.rating,
    isFeatured: i < 8,
    isActive: true,
    createdAt: isoDate(80 + i),
  };
});

export function getPackageById(id) {
  return packages.find((p) => p.id === id);
}

export function getPackagesByProvider(providerId) {
  return packages.filter((p) => p.providerId === providerId);
}

export function getFeaturedPackages(limit = 8) {
  return packages.filter((p) => p.isFeatured).slice(0, limit);
}

import { FALLBACK_SERVICE_CATALOG } from "@/constants/provider-catalog.constants";
import { generateId, imageUrl, isoDate } from "./helpers";
import { mockProviders } from "./providers";

const SERVICE_NAMES = [
  "Haircut & Styling",
  "Deep Tissue Massage",
  "Teeth Cleaning",
  "Personal Training Session",
  "Yoga Class",
  "Deep Home Cleaning",
  "Pipe Repair",
  "Electrical Wiring",
  "AC Servicing",
  "Pest Control Treatment",
  "Bridal Makeup",
  "Gel Manicure",
  "Physiotherapy Session",
  "Diet Consultation",
  "Pet Grooming",
  "Premium Car Wash",
  "Room Makeover Consult",
  "Portrait Photography",
  "Math Tutoring",
  "Legal Consultation",
  "Tax Filing",
  "Birthday Event Planning",
  "Party Catering",
  "Custom Tailoring",
  "Premium Laundry",
  "Garden Maintenance",
  "Wall Painting",
  "Furniture Repair",
  "Refrigerator Repair",
  "Screen Replacement",
];

/** At least 3 services for every provider so detail/booking never show empty. */
export const services = mockProviders.flatMap((provider, providerIndex) => {
  return FALLBACK_SERVICE_CATALOG.map((template, serviceIndex) => {
    const globalIndex = providerIndex * FALLBACK_SERVICE_CATALOG.length + serviceIndex;
    const named = SERVICE_NAMES[globalIndex % SERVICE_NAMES.length];

    return {
      id: generateId("svc", globalIndex + 1),
      providerId: provider.id,
      providerName: provider.businessName,
      categoryId: provider.categoryId,
      name: serviceIndex === 0 ? named : `${template.name}`,
      slug: (serviceIndex === 0 ? named : template.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      description: `Professional ${named.toLowerCase()} delivered by certified experts. Includes consultation and aftercare guidance.`,
      image: imageUrl(`svc-${provider.id}-${serviceIndex}`, 400, 300),
      duration: template.duration,
      price: template.price + (providerIndex % 5) * 50,
      originalPrice: template.originalPrice + (providerIndex % 5) * 50,
      discountType: serviceIndex === 0 ? "percentage" : null,
      discountValue: serviceIndex === 0 ? 10 + (providerIndex % 3) * 5 : 0,
      visitTypes: ["onsite", "home", "online"].slice(0, 1 + (serviceIndex % 3)),
      rating: provider.rating,
      totalBookings: 50 + (globalIndex % 200),
      isPopular: providerIndex < 15 && serviceIndex < 2,
      isActive: true,
      createdAt: isoDate(100 + globalIndex),
    };
  });
});

export function getServiceById(id) {
  return services.find((s) => s.id === id);
}

export function getServicesByProvider(providerId) {
  const matched = services.filter((s) => s.providerId === providerId);
  if (matched.length > 0) return matched;

  // Absolute fallback — should not happen after seeding every provider
  return FALLBACK_SERVICE_CATALOG.map((template, index) => ({
    id: `fallback_svc_${index + 1}`,
    providerId,
    name: template.name,
    duration: template.duration,
    price: template.price,
    originalPrice: template.originalPrice,
  }));
}

export function getPopularServices(limit = 10) {
  return services.filter((s) => s.isPopular).slice(0, limit);
}

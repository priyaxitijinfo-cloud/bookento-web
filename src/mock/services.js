import { generateId, imageUrl, isoDate } from "./helpers";
import { mockProviders } from "./providers";

const SERVICE_NAMES = [
  "Haircut & Styling", "Deep Tissue Massage", "Teeth Cleaning", "Personal Training Session",
  "Yoga Class", "Deep Home Cleaning", "Pipe Repair", "Electrical Wiring",
  "AC Servicing", "Pest Control Treatment", "Bridal Makeup", "Gel Manicure",
  "Physiotherapy Session", "Diet Consultation", "Pet Grooming", "Premium Car Wash",
  "Room Makeover Consult", "Portrait Photography", "Math Tutoring", "Legal Consultation",
  "Tax Filing", "Birthday Event Planning", "Party Catering", "Custom Tailoring",
  "Premium Laundry", "Garden Maintenance", "Wall Painting", "Furniture Repair",
  "Refrigerator Repair", "Screen Replacement",
];

export const services = Array.from({ length: 50 }, (_, i) => {
  const provider = mockProviders[i % mockProviders.length];
  return {
    id: generateId("svc", i + 1),
    providerId: provider.id,
    providerName: provider.businessName,
    categoryId: provider.categoryId,
    name: SERVICE_NAMES[i] || `Premium Service ${i + 1}`,
    slug: (SERVICE_NAMES[i] || `service-${i}`).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: `Professional ${SERVICE_NAMES[i]?.toLowerCase() || "service"} delivered by certified experts. Includes consultation and aftercare guidance.`,
    image: imageUrl(`svc-${i}`, 400, 300),
    duration: 30 + (i % 6) * 15,
    price: 299 + (i % 15) * 200,
    discountType: i % 4 === 0 ? "percentage" : null,
    discountValue: i % 4 === 0 ? 10 + (i % 3) * 5 : 0,
    visitTypes: ["onsite", "home", "online"].slice(0, 1 + (i % 3)),
    rating: provider.rating,
    totalBookings: 50 + (i % 200),
    isPopular: i < 15,
    isActive: true,
    createdAt: isoDate(100 + i),
  };
});

export function getServiceById(id) {
  return services.find((s) => s.id === id);
}

export function getServicesByProvider(providerId) {
  return services.filter((s) => s.providerId === providerId);
}

export function getPopularServices(limit = 10) {
  return services.filter((s) => s.isPopular).slice(0, limit);
}

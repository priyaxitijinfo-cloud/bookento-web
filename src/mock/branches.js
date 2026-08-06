import { generateId, imageUrl } from "./helpers";
import { mockProviders } from "./providers";

export const branches = Array.from({ length: 12 }, (_, i) => {
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"];
  const city = cities[i % 6];
  return {
    id: generateId("branch", i + 1),
    providerId: mockProviders[0].id,
    name: `${city} Branch ${i + 1}`,
    address: `${200 + i * 10}, Commercial Street, ${city}`,
    city,
    state: "Maharashtra",
    country: "India",
    pincode: String(400100 + i),
    phone: `+91 22 ${String(20000000 + i).slice(0, 8)}`,
    email: `branch${i + 1}@elite-studio.com`,
    latitude: 19.076 + i * 0.05,
    longitude: 72.877 + i * 0.05,
    isMain: i === 0,
    isActive: true,
    staffCount: 3 + (i % 8),
    businessHours: {
      weekdays: "9:00 AM - 9:00 PM",
      saturday: "10:00 AM - 8:00 PM",
      sunday: i % 2 === 0 ? "Closed" : "10:00 AM - 6:00 PM",
    },
  };
});

export function getBranchesByProvider(providerId) {
  return branches.filter((b) => b.providerId === providerId);
}

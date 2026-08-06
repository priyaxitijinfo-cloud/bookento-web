import { USER_ROLES, PROVIDER_STATUS } from "@/constants/status.constants";
import { avatarUrl, coverUrl, generateId, isoDate, personName } from "./helpers";

export const mockUsers = Array.from({ length: 30 }, (_, i) => {
  const name = personName(i);
  return {
    id: generateId("user", i + 1),
    email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
    name,
    phone: `+91 9${String(800000000 + i).slice(0, 9)}`,
    avatar: avatarUrl(`user-${i}`),
    gender: i % 2 === 0 ? "male" : "female",
    role: USER_ROLES.USER,
    isVerified: true,
    walletBalance: 500 + i * 150,
    referralCode: `REF${1000 + i}`,
    totalBookings: 3 + (i % 20),
    memberSince: isoDate(365 + i * 10),
    preferences: {
      language: "en",
      notifications: true,
      marketing: i % 3 === 0,
    },
  };
});

export const currentUser = {
  ...mockUsers[0],
  email: "alex.sharma@email.com",
  name: "Alex Sharma",
};

export const mockProviders = Array.from({ length: 100 }, (_, i) => {
  const ownerName = personName(i + 5);
  const loc = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"][i % 6];
  return {
    id: generateId("provider", i + 1),
    userId: generateId("user", i + 100),
    businessName: `${["Elite", "Premium", "Royal", "Urban", "Pro"][i % 5]} ${["Studio", "Spa", "Clinic", "Salon", "Hub"][i % 5]}`,
    ownerName,
    email: `provider${i + 1}@business.com`,
    phone: `+91 9${String(700000000 + i).slice(0, 9)}`,
    avatar: avatarUrl(`provider-${i}`),
    coverImage: coverUrl(`cover-${i}`, 1200, 400),
    description: `Award-winning service provider in ${loc} with ${3 + (i % 10)} years of experience. We deliver premium quality services with customer satisfaction as our top priority.`,
    categoryId: `cat_${String((i % 30) + 1).padStart(4, "0")}`,
    specialty: ["Hair Styling", "Spa Therapy", "Dental Care", "Fitness", "Home Services"][i % 5],
    status: i < 95 ? PROVIDER_STATUS.APPROVED : PROVIDER_STATUS.PENDING,
    rating: Number((3.5 + (i % 15) * 0.1).toFixed(1)),
    totalReviews: 20 + (i % 180),
    totalBookings: 100 + (i % 900),
    yearsOfExperience: 2 + (i % 15),
    isVerified: i % 4 !== 0,
    distance: Number((0.5 + (i % 20) * 0.3).toFixed(1)),
    startingPrice: 299 + (i % 20) * 100,
    serviceModes: [
      ...(i % 3 === 0 ? ["in_clinic"] : []),
      ...(i % 2 === 0 ? ["home_visit"] : []),
      ...(i % 4 === 0 ? ["online"] : []),
      ...(i % 3 !== 0 && i % 2 !== 0 ? ["in_clinic"] : []),
    ],
    city: loc,
    state: "Maharashtra",
    country: "India",
    address: `${100 + i}, Main Street, ${loc}`,
    pincode: String(400000 + i),
    businessHours: {
      monday: { open: "09:00", close: "21:00", isOpen: true },
      tuesday: { open: "09:00", close: "21:00", isOpen: true },
      wednesday: { open: "09:00", close: "21:00", isOpen: true },
      thursday: { open: "09:00", close: "21:00", isOpen: true },
      friday: { open: "09:00", close: "21:00", isOpen: true },
      saturday: { open: "10:00", close: "20:00", isOpen: true },
      sunday: { open: "10:00", close: "18:00", isOpen: i % 3 !== 0 },
    },
    createdAt: isoDate(200 + i),
    isFeatured: i < 15,
    isTrending: i < 20,
    isNearby: i < 25,
    tags: ["Verified", "Top Rated", "Fast Response"].slice(0, 1 + (i % 3)),
  };
});

export const currentProvider = {
  ...mockProviders[0],
  email: "provider@test.com",
  businessName: "Elite Wellness Studio",
  ownerName: "Raj Mehta",
  status: PROVIDER_STATUS.APPROVED,
};

export function getProviderById(id) {
  return mockProviders.find((p) => p.id === id);
}

export function getTrendingProviders(limit = 10) {
  return mockProviders.filter((p) => p.isTrending).slice(0, limit);
}

export function getNearbyProviders(limit = 10) {
  return [...mockProviders].sort((a, b) => a.distance - b.distance).slice(0, limit);
}

export function getFeaturedProviders(limit = 10) {
  return mockProviders.filter((p) => p.isFeatured).slice(0, limit);
}

export function getRecommendedProviders(limit = 10) {
  return mockProviders.filter((p) => p.rating >= 4.5).slice(0, limit);
}

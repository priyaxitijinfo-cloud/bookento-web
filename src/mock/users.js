import { generateId, isoDate, personName, avatarUrl } from "./helpers";

export const mockUsers = Array.from({ length: 30 }, (_, i) => {
  const name = personName(i);
  return {
    id: generateId("user", i + 1),
    email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
    name,
    phone: `+91 9${String(800000000 + i).slice(0, 9)}`,
    avatar: avatarUrl(`user-${i}`),
    gender: i % 2 === 0 ? "male" : "female",
    role: "user",
    isVerified: true,
    walletBalance: 500 + i * 150,
    referralCode: `REF${1000 + i}`,
    totalBookings: 3 + (i % 20),
    memberSince: isoDate(365 + i * 10),
    dateOfBirth: isoDate(8000 + i * 100).split("T")[0],
    bio: "Love discovering great local services and sharing honest reviews.",
    preferences: {
      language: "en",
      notifications: true,
      marketing: i % 3 === 0,
      darkMode: false,
    },
  };
});

const WALLET_TRANSACTION_TEMPLATES = [
  { title: "Home Cleaning", subtitle: "Urban Clean Services", type: "debit", amount: 50, date: "2026-01-09" },
  { title: "Wallet Top-up", subtitle: "Added via GPay", type: "credit", amount: 120, date: "2026-01-07" },
  { title: "Nutrition Plan", subtitle: "Healthify Expert", type: "debit", amount: 50, date: "2026-01-06" },
  { title: "Doctor Consultation", subtitle: "Dr. Amara Reyes", type: "credit", amount: 120, date: "2026-01-04" },
  { title: "Salon Booking", subtitle: "Glow Beauty Salon", type: "debit", amount: 50, date: "2026-01-03" },
  { title: "Pet Care Service", subtitle: "Happy Paws Clinic", type: "credit", amount: 120, date: "2026-01-04" },
  { title: "Home Cleaning", subtitle: "Urban Clean Services", type: "debit", amount: 50, date: "2026-01-03" },
  { title: "Wallet Top-up", subtitle: "Added via GPay", type: "credit", amount: 120, date: "2026-01-04" },
  { title: "Yoga Session", subtitle: "ZenFit Studio", type: "debit", amount: 80, date: "2026-01-02" },
  { title: "Wallet Top-up", subtitle: "Added via PhonePe", type: "credit", amount: 500, date: "2026-01-01" },
  { title: "Plumbing Repair", subtitle: "FixIt Home Services", type: "debit", amount: 150, date: "2025-12-30" },
  { title: "Car Wash", subtitle: "Sparkle Auto Care", type: "debit", amount: 60, date: "2025-12-28" },
];

export const walletTransactions = WALLET_TRANSACTION_TEMPLATES.map((txn, i) => ({
  id: generateId("wtxn", i + 1),
  title: txn.title,
  subtitle: txn.subtitle,
  description: txn.title,
  type: txn.type,
  amount: txn.amount,
  status: "completed",
  createdAt: `${txn.date}T10:00:00.000Z`,
}));

export const currentUser = {
  ...mockUsers[0],
  email: "alex.sharma@email.com",
  name: "Alex Sharma",
  phone: "+91 98765 43210",
  walletBalance: 12560,
};

export const userAddresses = [
  {
    id: generateId("addr", 1),
    userId: currentUser.id,
    label: "Home",
    name: currentUser.name,
    phone: currentUser.phone,
    addressLine1: "123 Home Street",
    addressLine2: "Near Adajan Circle",
    area: "Adajan",
    city: "Surat",
    state: "Gujarat",
    country: "India",
    pincode: "395009",
    isDefault: true,
    latitude: 21.1959,
    longitude: 72.7863,
  },
  {
    id: generateId("addr", 2),
    userId: currentUser.id,
    label: "Office",
    name: currentUser.name,
    phone: currentUser.phone,
    addressLine1: "4100 Piedmont Avenue",
    addressLine2: "Suite 204",
    area: "Rockridge",
    city: "Oakland",
    state: "California",
    country: "United States",
    pincode: "94611",
    isDefault: false,
    latitude: 37.8423,
    longitude: -122.252,
  },
  {
    id: generateId("addr", 3),
    userId: currentUser.id,
    label: "Parents Home",
    name: currentUser.name,
    phone: currentUser.phone,
    addressLine1: "22 Baker Street",
    addressLine2: "Flat 3B",
    area: "Marylebone",
    city: "London",
    state: "England",
    country: "United Kingdom",
    pincode: "NW1 6XE",
    isDefault: false,
    latitude: 51.5237,
    longitude: -0.1585,
  },
];

export const savedProviders = Array.from({ length: 15 }, (_, i) => ({
  id: generateId("saved", i + 1),
  providerId: `provider_${String(i + 1).padStart(4, "0")}`,
  savedAt: isoDate(i * 3),
}));

export const referrals = Array.from({ length: 12 }, (_, i) => {
  const name = personName(i + 20);
  return {
    id: generateId("ref", i + 1),
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
    phone: `+91 9${String(810000000 + i).slice(0, 9)}`,
    avatar: avatarUrl(`referral-${i}`),
    status: ["pending", "completed", "completed"][i % 3],
    reward: i % 3 === 2 ? 100 : i % 3 === 1 ? 100 : 0,
    joinedAt: isoDate(i * 5),
  };
});

export function getUserById(id) {
  return mockUsers.find((u) => u.id === id);
}

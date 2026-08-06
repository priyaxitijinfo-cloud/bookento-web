import { generateId, imageUrl } from "./helpers";

const CATEGORY_NAMES = [
  "Hair & Styling", "Spa & Massage", "Dental Care", "Fitness Training",
  "Yoga & Wellness", "Home Cleaning", "Plumbing", "Electrical",
  "AC Repair", "Pest Control", "Beauty & Makeup", "Nail Art",
  "Physiotherapy", "Nutrition", "Pet Grooming", "Car Wash",
  "Interior Design", "Photography", "Tutoring", "Legal Services",
  "Accounting", "Event Planning", "Catering", "Tailoring",
  "Laundry", "Gardening", "Painting", "Carpentry",
  "Appliance Repair", "Mobile Repair",
];

export const categories = CATEGORY_NAMES.map((name, i) => ({
  id: generateId("cat", i + 1),
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  icon: ["Scissors", "Sparkles", "Heart", "Dumbbell", "Leaf", "Home", "Wrench", "Zap",
    "Wind", "Bug", "Palette", "Hand", "Activity", "Apple", "PawPrint", "Car",
    "Sofa", "Camera", "BookOpen", "Scale", "Calculator", "PartyPopper", "Utensils",
    "Shirt", "Shirt", "TreePine", "Paintbrush", "Hammer", "Settings", "Smartphone"][i],
  image: imageUrl(`cat-${i}`, 300, 300),
  providerCount: 2 + (i % 8),
  serviceCount: 5 + (i % 12),
  description: `Professional ${name.toLowerCase()} services from verified experts near you.`,
  isFeatured: i < 10,
  sortOrder: i + 1,
}));

export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}

export function getFeaturedCategories(limit = 10) {
  return categories.filter((c) => c.isFeatured).slice(0, limit);
}

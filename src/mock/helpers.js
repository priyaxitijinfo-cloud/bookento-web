const FIRST_NAMES = [
  "Aarav", "Vihaan", "Ananya", "Priya", "Rahul", "Sneha", "Karan", "Meera",
  "Arjun", "Isha", "Rohan", "Neha", "Aditya", "Pooja", "Vikram", "Kavya",
  "Dev", "Shreya", "Nikhil", "Tanvi", "Raj", "Divya", "Amit", "Nisha",
];

const LAST_NAMES = [
  "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Reddy", "Mehta", "Joshi",
  "Verma", "Iyer", "Nair", "Desai", "Kapoor", "Malhotra", "Chopra", "Bose",
];

const BUSINESS_PREFIXES = [
  "Elite", "Premium", "Royal", "Urban", "Pro", "Smart", "Golden", "Pure",
  "Fresh", "Swift", "Bright", "Zen", "Nova", "Prime", "Bliss", "Glow",
];

const BUSINESS_SUFFIXES = [
  "Studio", "Spa", "Clinic", "Salon", "Care", "Hub", "Center", "Works",
  "Lab", "House", "Point", "Zone", "Space", "Lounge", "Bar", "Shop",
];

const CITIES = [
  { city: "Mumbai", state: "Maharashtra", country: "India" },
  { city: "Delhi", state: "Delhi", country: "India" },
  { city: "Bangalore", state: "Karnataka", country: "India" },
  { city: "Hyderabad", state: "Telangana", country: "India" },
  { city: "Chennai", state: "Tamil Nadu", country: "India" },
  { city: "Pune", state: "Maharashtra", country: "India" },
  { city: "Kolkata", state: "West Bengal", country: "India" },
  { city: "Ahmedabad", state: "Gujarat", country: "India" },
  { city: "Jaipur", state: "Rajasthan", country: "India" },
  { city: "Lucknow", state: "Uttar Pradesh", country: "India" },
];

const REVIEW_COMMENTS = [
  "Absolutely fantastic service! Highly recommend to everyone.",
  "Professional staff and great attention to detail.",
  "Worth every penny. Will definitely come back again.",
  "Clean environment and punctual service delivery.",
  "Exceeded my expectations in every way possible.",
  "Good value for money. Satisfied with the results.",
  "The team was friendly and knowledgeable throughout.",
  "Quick booking process and seamless experience.",
  "One of the best in the city. Five stars from me!",
  "Impressive quality and reasonable pricing.",
  "Dr. Maya was thorough, calm, and explained everything clearly.",
  "Urban Salon delivered exactly the style I wanted.",
  "Quiet Garden Spa felt premium from start to finish.",
  "Royal Clinic had minimal wait time and excellent care.",
];

export function pick(arr, index) {
  return arr[index % arr.length];
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateId(prefix, index) {
  return `${prefix}_${String(index).padStart(4, "0")}`;
}

export { avatarUrl, coverUrl, imageUrl, selfVideoUrl } from "./stock-images";

export function personName(index) {
  return `${pick(FIRST_NAMES, index)} ${pick(LAST_NAMES, index + 3)}`;
}

export function businessName(index) {
  return `${pick(BUSINESS_PREFIXES, index)} ${pick(BUSINESS_SUFFIXES, index + 5)}`;
}

export function location(index) {
  return pick(CITIES, index);
}

export function rating(index) {
  return Number((3.5 + (index % 15) * 0.1).toFixed(1));
}

export function reviewComment(index) {
  return pick(REVIEW_COMMENTS, index);
}

export function isoDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export function timeSlot(hour) {
  const h = hour % 24;
  const ampm = h >= 12 ? "PM" : "AM";
  const display = h % 12 || 12;
  return `${display}:00 ${ampm}`;
}

export function paginate(items, page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    meta: {
      page,
      pageSize,
      total: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}

export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

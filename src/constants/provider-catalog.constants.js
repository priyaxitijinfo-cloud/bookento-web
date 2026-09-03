/**
 * Shared demo catalog used when a provider has no own services/packages.
 * Keeps Services / Packages tabs and booking flows from showing empty states.
 */
export const FALLBACK_SERVICE_CATALOG = [
  { name: "Standard Consultation", duration: 30, price: 999, originalPrice: 1499 },
  { name: "Premium Session", duration: 45, price: 1899, originalPrice: 2499 },
  { name: "Express Visit", duration: 20, price: 699, originalPrice: 999 },
  { name: "Follow-up Session", duration: 25, price: 799, originalPrice: 1199 },
  { name: "Complete Care Plan", duration: 60, price: 3499, originalPrice: 4499 },
  { name: "Home Visit Service", duration: 40, price: 2299, originalPrice: 2999 },
];

export const FALLBACK_PACKAGE_CATALOG = [
  {
    name: "Essentials Package",
    description: "Core services bundled for everyday needs",
    features: ["Consultation", "Standard session", "Follow-up", "Flexible timing"],
    originalPrice: 5500,
    price: 3999,
    discountPercent: 27,
    theme: "rose",
  },
  {
    name: "Plus Package",
    description: "Popular plan with priority booking",
    features: [
      "Priority slots",
      "Extended session",
      "Add-on support",
      "Member savings",
    ],
    originalPrice: 7800,
    price: 5499,
    discountPercent: 29,
    theme: "blue",
  },
  {
    name: "Premium Package",
    description: "Full-care bundle with dedicated support",
    features: [
      "Full service bundle",
      "Dedicated support",
      "Premium slots",
      "Exclusive offers",
    ],
    originalPrice: 9800,
    price: 6999,
    discountPercent: 28,
    theme: "amber",
  },
];

export const FALLBACK_GALLERY_CAPTIONS = [
  "Reception area",
  "Consultation room",
  "Service workspace",
  "Client lounge",
  "Team at work",
  "Facility tour",
  "Equipment setup",
  "Waiting area",
];

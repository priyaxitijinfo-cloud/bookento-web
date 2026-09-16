export const HOME_CATEGORIES = [
  {
    name: "Doctor",
    slug: "doctor",
    iconImage: "/images/categories/doctor.png",
    categoryId: "cat_0003",
    bg: "bg-[#DAF2FF]",
    iconColor: "text-sky-500",
    iconTile: "#37B8FF",
  },
  {
    name: "Salon",
    slug: "salon",
    iconImage: "/images/categories/salon.png",
    categoryId: "cat_0001",
    bg: "bg-[#FFEDEF]",
    iconColor: "text-rose-500",
    iconTile: "#FF4766",
  },
  {
    name: "Fitness",
    slug: "fitness",
    iconImage: "/images/categories/fitness.png",
    categoryId: "cat_0004",
    bg: "bg-[#DEF0E0]",
    iconColor: "text-lime-600",
    iconTile: "#5EB12D",
  },
  {
    name: "Tutoring",
    slug: "tutoring",
    iconImage: "/images/categories/tutoring.png",
    categoryId: "cat_0019",
    bg: "bg-[#F7EFDD]",
    iconColor: "text-orange-500",
    iconTile: "#FFAF2A",
  },
  {
    name: "Pet Care",
    slug: "pet-care",
    iconImage: "/images/categories/pet-care.png",
    categoryId: "cat_0015",
    bg: "bg-[#EAE9FF]",
    iconColor: "text-violet-500",
    iconTile: "#6357FF",
  },
  {
    name: "Homecare",
    slug: "homecare",
    iconImage: "/images/categories/homecare.png",
    categoryId: "cat_0006",
    bg: "bg-[#FBE8FF]",
    iconColor: "text-fuchsia-500",
    iconTile: "#E046FF",
  },
  {
    name: "Kids Care",
    slug: "kids-care",
    iconImage: "/images/categories/kids-care.png",
    categoryId: "cat_0014",
    bg: "bg-[#FFE8F3]",
    iconColor: "text-pink-500",
    iconTile: "#FF37B8",
  },
  {
    name: "Plumbing",
    slug: "plumbing",
    iconImage: "/images/categories/plumbing.png",
    categoryId: "cat_0007",
    bg: "bg-[#FFF4E5]",
    iconColor: "text-amber-600",
    iconTile: "#D49937",
  },
  {
    name: "Automotive",
    slug: "automotive",
    iconImage: "/images/categories/automotive.png",
    categoryId: "cat_0016",
    bg: "bg-[#E2EFFF]",
    iconColor: "text-[#438AFF]",
    iconTile: "#438AFF",
  },
  {
    name: "Gardening",
    slug: "gardening",
    iconImage: "/images/categories/gardening.png",
    categoryId: "cat_0026",
    bg: "bg-[#E5F8EA]",
    iconColor: "text-emerald-600",
    iconTile: "#B943FF",
  },
  {
    name: "Cooking",
    slug: "cooking",
    iconImage: "/images/categories/cooking.png",
    categoryId: "cat_0023",
    bg: "bg-[#E4FAFC]",
    iconColor: "text-cyan-600",
    iconTile: "#0273D5",
  },
  {
    name: "Events",
    slug: "events",
    iconImage: "/images/categories/events.png",
    categoryId: "cat_0022",
    bg: "bg-[#E0F7F4]",
    iconColor: "text-teal-600",
    iconTile: "#049486",
  },
  {
    name: "Carpenter",
    slug: "carpenter",
    iconImage: "/images/categories/carpenter.png",
    categoryId: "cat_0028",
    bg: "bg-[#E8ECFF]",
    iconColor: "text-indigo-500",
    iconTile: "#438AFF",
  },
  {
    name: "Renovation",
    slug: "renovation",
    iconImage: "/images/categories/renovation.png",
    categoryId: "cat_0027",
    bg: "bg-[#FFF9E5]",
    iconColor: "text-yellow-600",
    iconTile: "#FFAF2A",
  },
  {
    name: "Shooting",
    slug: "shooting",
    iconImage: "/images/categories/shooting.png",
    categoryId: "cat_0018",
    bg: "bg-[#F0E8FF]",
    iconColor: "text-purple-500",
    iconTile: "#EC00F9",
  },
];

/**
 * Desktop landing accents — match category cards (web).
 * Keep unique hues; no adjacent duplicates.
 */
export const HOME_CATEGORY_ACCENTS = {
  doctor: "#37B8FF",
  salon: "#FF4766",
  fitness: "#5EB12D",
  tutoring: "#FFAF2A",
  "pet-care": "#6357FF",
  homecare: "#E046FF",
  "kids-care": "#FF37B8",
  plumbing: "#C47A1A",
  automotive: "#3B82F6",
  gardening: "#10B981",
  cooking: "#0EA5E9",
  events: "#14B8A6",
  carpenter: "#A16207",
  renovation: "#F97316",
  shooting: "#D946EF",
};

export function getHomeCategoryAccent(slug) {
  return (
    HOME_CATEGORY_ACCENTS[slug] || getHomeCategoryBySlug(slug)?.iconTile || "#1865EA"
  );
}

export function shadeHex(hex, amount) {
  const raw = hex.replace("#", "");
  const channel = (start) => parseInt(raw.slice(start, start + 2), 16);
  const r = Math.round(channel(0) * (1 - amount));
  const g = Math.round(channel(2) * (1 - amount));
  const b = Math.round(channel(4) * (1 - amount));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function lightenHex(hex, mix = 0.88) {
  const raw = hex.replace("#", "");
  const channel = (start) => parseInt(raw.slice(start, start + 2), 16);
  const blend = (c) => Math.round(c + (255 - c) * mix);
  return `#${[blend(channel(0)), blend(channel(2)), blend(channel(4))]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

export function getHomeCategoryGradient(slug) {
  const color = getHomeCategoryAccent(slug);
  const from = shadeHex(color, 0.22);
  const to = lightenHex(color, 0.28);
  return {
    color,
    from,
    to,
    css: `linear-gradient(105deg, ${from} 0%, ${color} 46%, ${to} 100%)`,
    stops: [from, color, to],
  };
}

export function getHomeCategoryBySlug(slug) {
  return HOME_CATEGORIES.find((category) => category.slug === slug);
}

export function isHomeCategorySlug(slug) {
  return Boolean(getHomeCategoryBySlug(slug));
}

export function getCategoryProviderDisplayName(businessName, slug) {
  if (slug === "doctor") {
    if (businessName.startsWith("Dr.")) return businessName;
    return `Dr. ${businessName.replace(/^Dr\.\s*/i, "")}`;
  }

  return businessName;
}

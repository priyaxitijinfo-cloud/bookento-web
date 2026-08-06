export const HOME_CATEGORIES = [
  { name: "Doctor", slug: "doctor", iconImage: "/images/categories/doctor.png", categoryId: "cat_0003", bg: "bg-[#DAF2FF]", iconColor: "text-sky-500" },
  { name: "Salon", slug: "salon", iconImage: "/images/categories/salon.png", categoryId: "cat_0001", bg: "bg-[#FFEDEF]", iconColor: "text-rose-500" },
  { name: "Fitness", slug: "fitness", iconImage: "/images/categories/fitness.png", categoryId: "cat_0004", bg: "bg-[#DEF0E0]", iconColor: "text-lime-600" },
  { name: "Tutoring", slug: "tutoring", iconImage: "/images/categories/tutoring.png", categoryId: "cat_0019", bg: "bg-[#F7EFDD]", iconColor: "text-orange-500" },
  { name: "Pet Care", slug: "pet-care", iconImage: "/images/categories/pet-care.png", categoryId: "cat_0015", bg: "bg-[#EAE9FF]", iconColor: "text-violet-500" },
  { name: "Homecare", slug: "homecare", iconImage: "/images/categories/homecare.png", categoryId: "cat_0006", bg: "bg-[#FBE8FF]", iconColor: "text-fuchsia-500" },
  { name: "Kids Care", slug: "kids-care", iconImage: "/images/categories/kids-care.png", categoryId: "cat_0014", bg: "bg-[#FFE8F3]", iconColor: "text-pink-500" },
  { name: "Plumbing", slug: "plumbing", iconImage: "/images/categories/plumbing.png", categoryId: "cat_0007", bg: "bg-[#FFF4E5]", iconColor: "text-amber-600" },
  { name: "Automotive", slug: "automotive", iconImage: "/images/categories/automotive.png", categoryId: "cat_0016", bg: "bg-[#E2EFFF]", iconColor: "text-[#438AFF]" },
  { name: "Gardening", slug: "gardening", iconImage: "/images/categories/gardening.png", categoryId: "cat_0026", bg: "bg-[#E5F8EA]", iconColor: "text-emerald-600" },
  { name: "Cooking", slug: "cooking", iconImage: "/images/categories/cooking.png", categoryId: "cat_0023", bg: "bg-[#E4FAFC]", iconColor: "text-cyan-600" },
  { name: "Events", slug: "events", iconImage: "/images/categories/events.png", categoryId: "cat_0022", bg: "bg-[#E0F7F4]", iconColor: "text-teal-600" },
  { name: "Carpenter", slug: "carpenter", iconImage: "/images/categories/carpenter.png", categoryId: "cat_0028", bg: "bg-[#E8ECFF]", iconColor: "text-indigo-500" },
  { name: "Renovation", slug: "renovation", iconImage: "/images/categories/renovation.png", categoryId: "cat_0027", bg: "bg-[#FFF9E5]", iconColor: "text-yellow-600" },
  { name: "Shooting", slug: "shooting", iconImage: "/images/categories/shooting.png", categoryId: "cat_0018", bg: "bg-[#F0E8FF]", iconColor: "text-purple-500" },
];

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

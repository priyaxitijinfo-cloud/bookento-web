import { HOME_CATEGORIES } from "@/constants/home-categories";
import { CategoryItem, MoreCategoryItem } from "@/components/home/category-item";

const MOBILE_CATEGORY_SLUGS = [
  "doctor",
  "salon",
  "fitness",
  "pet-care",
  "tutoring",
  "homecare",
  "automotive",
];

export function CategoryGrid() {
  const mobileCategories = MOBILE_CATEGORY_SLUGS.map((slug) =>
    HOME_CATEGORIES.find((category) => category.slug === slug),
  ).filter(Boolean);

  return (
    <>
      <div className="grid grid-cols-4 gap-2.5 md:hidden">
        {mobileCategories.map((category) => (
          <div key={category.slug} className="aspect-square min-w-0">
            <CategoryItem category={category} compact />
          </div>
        ))}
        <div className="aspect-square min-w-0">
          <MoreCategoryItem compact />
        </div>
      </div>

      <div className="hidden grid-cols-3 gap-3 sm:grid-cols-4 md:grid md:grid-cols-5 md:gap-4">
        {HOME_CATEGORIES.map((category) => (
          <CategoryItem key={category.slug} category={category} />
        ))}
      </div>
    </>
  );
}

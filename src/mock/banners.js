import { generateId, imageUrl } from "./helpers";

export const banners = Array.from({ length: 10 }, (_, i) => ({
  id: generateId("banner", i + 1),
  title: [
    "Summer Special",
    "New Providers Near You",
    "Book Now & Save 30%",
    "Premium Spa Packages",
    "Home Services Made Easy",
    "Refer & Earn ₹500",
    "Weekend Flash Sale",
    "Top Rated This Week",
    "First Booking Free Delivery",
    "Member Exclusive Deals",
  ][i],
  subtitle: [
    "Up to 40% OFF",
    "Discover experts in your area",
    "Limited time offer",
    "Relax and rejuvenate",
    "Professional help at your doorstep",
    "Invite friends and earn rewards",
    "Saturday & Sunday special prices",
    "Trusted by thousands of customers",
    "Free home visit on first booking",
    "Unlock premium benefits today",
  ][i],
  image: imageUrl(`banner-${i}`, 1200, 400),
  actionUrl: ["/providers", "/categories", "/booking", "/providers", "/providers", "/referrals", "/providers", "/providers", "/booking", "/profile"][i],
  backgroundColor: ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16", "#f97316"][i],
  isActive: true,
  sortOrder: i + 1,
}));

export function getActiveBanners() {
  return banners.filter((b) => b.isActive);
}

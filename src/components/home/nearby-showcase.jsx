import { NearbyProviderCard } from "@/components/home/nearby-provider-card";
import { MobileScrollRow } from "@/components/home/horizontal-scroll";
import { SectionHeader } from "@/components/home/section-header";
import { ROUTES } from "@/constants/routes.constants";
import { mockProviders } from "@/mock/providers";

const NEARBY_SHOWCASE = [
  {
    id: mockProviders[0].id,
    businessName: "Glow Beauty Salon",
    specialty: "Hair Styling",
    rating: 4.3,
    distance: 0.3,
    coverImage: "/images/nearby-glow-salon.png",
  },
  {
    id: mockProviders[1].id,
    businessName: "Serene Spa",
    specialty: "Spa Therapy",
    rating: 4.6,
    distance: 0.4,
    coverImage: "/images/nearby-serene-spa.png",
  },
  {
    id: mockProviders[2].id,
    businessName: "Bright Dental",
    specialty: "Dental Care",
    rating: 4.5,
    distance: 0.6,
    coverImage: "/images/nearby-bright-dental.png",
  },
  {
    id: mockProviders[3].id,
    businessName: "FitZone Gym",
    specialty: "Fitness Training",
    rating: 4.7,
    distance: 0.7,
    coverImage: "/images/nearby-fitzone-gym.png",
  },
  {
    id: mockProviders[4].id,
    businessName: "Urban Wellness Hub",
    specialty: "Yoga & Wellness",
    rating: 4.4,
    distance: 0.8,
    coverImage: "/images/nearby-urban-wellness.png",
  },
  {
    id: mockProviders[5].id,
    businessName: "Pure Home Care",
    specialty: "Home Cleaning",
    rating: 4.2,
    distance: 0.9,
    coverImage: "/images/nearby-pure-home-care.png",
  },
];

export function NearbyShowcase() {
  return (
    <section>
      <SectionHeader title="Nearby You" href={ROUTES.PROVIDERS} />

      <MobileScrollRow className="md:hidden">
        {NEARBY_SHOWCASE.map((provider) => (
          <div key={provider.id} className="w-[9.5rem] shrink-0 snap-start">
            <NearbyProviderCard provider={provider} />
          </div>
        ))}
      </MobileScrollRow>

      <div className="hidden gap-3 md:grid md:grid-cols-6 md:gap-4">
        {NEARBY_SHOWCASE.map((provider) => (
          <NearbyProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </section>
  );
}

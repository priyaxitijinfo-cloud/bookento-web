import { CATEGORY_LISTING_CONFIG } from "@/constants/category-listing.constants";
import {
  DOCTOR_LISTING_COUNT,
  getDoctorListingImage,
} from "@/constants/doctor-listing-images";
import { avatarUrl, personName } from "@/mock/helpers";
import { mockProviders } from "@/mock/providers";

const DEFAULT_LISTING_COUNT = 50;

const DOCTOR_REFERENCE_ENTRIES = [
  {
    name: "Neha Patel",
    specialty: "Dermatologist",
    distance: 0.8,
    rating: 4.9,
    startingPrice: 450,
    serviceModes: ["in_clinic", "online", "video_call"],
  },
  {
    name: "Amara Reyes",
    specialty: "Gynecologist",
    distance: 0.5,
    rating: 4.9,
    startingPrice: 1500,
    serviceModes: ["in_clinic", "online", "video_call"],
  },
  {
    name: "Rohan Mehta",
    specialty: "Cardiologist",
    distance: 1.2,
    rating: 4.9,
    startingPrice: 2000,
    serviceModes: ["in_clinic", "online"],
  },
  {
    name: "Ayesha Khan",
    specialty: "Gynecologist",
    distance: 0.6,
    rating: 4.9,
    startingPrice: 399,
    serviceModes: ["in_clinic"],
  },
  {
    name: "Kabir Shah",
    specialty: "Pediatrician",
    distance: 0.9,
    rating: 4.8,
    startingPrice: 899,
    serviceModes: ["in_clinic", "online"],
  },
  {
    name: "Meera Iyer",
    specialty: "General Physician",
    distance: 1.1,
    rating: 4.7,
    startingPrice: 349,
    serviceModes: ["in_clinic", "online", "video_call"],
  },
];

function buildReferenceEntries(slug, config) {
  if (slug === "doctor") {
    const extras = config.specialties
      .filter(
        (specialty) =>
          !DOCTOR_REFERENCE_ENTRIES.some((entry) => entry.specialty === specialty),
      )
      .map((specialty, index) => ({
        name: personName(index + 40),
        specialty,
        distance: Number((0.7 + index * 0.4).toFixed(1)),
        rating: Number((4.5 + (index % 4) * 0.1).toFixed(1)),
        startingPrice: 350 + index * 200,
        serviceModes: ["in_clinic", "online", "video_call"],
      }));
    return [...DOCTOR_REFERENCE_ENTRIES, ...extras];
  }

  return config.specialties.map((specialty, index) => ({
    name: personName(index + 20),
    specialty,
    distance: Number((0.5 + index * 0.3).toFixed(1)),
    rating: Number((4.6 + (index % 4) * 0.1).toFixed(1)),
    // Mix low/mid prices so sheet filters like ₹0–₹499 still return results
    startingPrice: index % 3 === 0 ? 299 + index * 50 : 800 + index * 350,
    serviceModes:
      index % 2 === 0 ? ["in_clinic", "online", "video_call"] : ["in_clinic", "online"],
  }));
}

function buildServiceModes(index, referenceEntry) {
  if (referenceEntry?.serviceModes) return referenceEntry.serviceModes;
  return index % 2 === 0
    ? ["in_clinic", "online", "video_call"]
    : ["in_clinic", "online"];
}

function resolveSpecialty(config, index, activeFilter) {
  if (activeFilter && activeFilter !== "All") {
    return activeFilter;
  }

  return config.specialties[index % config.specialties.length];
}

function getListingCount(slug) {
  return slug === "doctor" ? DOCTOR_LISTING_COUNT : DEFAULT_LISTING_COUNT;
}

function getListingNames(count) {
  return Array.from({ length: count }, (_, index) => personName(index + 12));
}

function getListingAvatar(slug, index, base) {
  if (slug === "doctor") return getDoctorListingImage(index);
  return avatarUrl(`${slug}-listing-${index % 8}`);
}

export function getCategoryListingProviders(slug, categoryId, activeFilter = "All") {
  const config = CATEGORY_LISTING_CONFIG[slug];
  if (!config) return [];

  const referenceEntries = buildReferenceEntries(slug, config);
  const listingCount = getListingCount(slug);
  const listingNames = getListingNames(listingCount);
  const categoryProviders = mockProviders.filter(
    (provider) => provider.categoryId === categoryId,
  );
  const sourceProviders =
    categoryProviders.length >= 6 ? categoryProviders : mockProviders;

  return listingNames
    .map((name, index) => {
      const base = sourceProviders[index % sourceProviders.length];
      const referenceEntry = referenceEntries[index % referenceEntries.length];
      const specialty =
        activeFilter && activeFilter !== "All"
          ? activeFilter
          : (referenceEntry?.specialty ?? resolveSpecialty(config, index, "All"));
      const displayName = config.namePrefix
        ? `${config.namePrefix}${referenceEntry?.name ?? name}`
        : (referenceEntry?.name ?? name);

      return {
        id: base.id,
        listingKey: `${slug}-${activeFilter}-${index}`,
        businessName: displayName,
        specialty,
        avatar: getListingAvatar(slug, index, base),
        rating: referenceEntry?.rating ?? Number((4.3 + (index % 8) * 0.1).toFixed(1)),
        distance:
          referenceEntry?.distance ?? Number((0.4 + (index % 10) * 0.2).toFixed(1)),
        startingPrice:
          referenceEntry?.startingPrice ??
          (index % 4 === 0 ? 299 + (index % 5) * 40 : 800 + (index % 12) * 150),
        serviceModes: buildServiceModes(index, referenceEntry),
      };
    })
    .filter(
      (provider) => activeFilter === "All" || provider.specialty === activeFilter,
    );
}

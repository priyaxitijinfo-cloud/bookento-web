import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

export const PACKAGE_THEMES = ["pink", "blue", "orange"];

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop";

export const SAMPLE_PROVIDER_PACKAGES = [
  {
    id: "ppkg_1",
    name: "Women's Wellness Package",
    image: SAMPLE_IMAGE,
    images: [SAMPLE_IMAGE],
    features: [
      "General consultation",
      "Routine health check",
      "Hormonal screening",
      "Personalized health plan",
    ],
    serviceIds: ["psvc_1", "psvc_2"],
    totalAmount: 7000,
    price: 5000,
    originalPrice: 7000,
    limitedPrice: 5000,
    discountType: "percent",
    discountValue: 29,
    offerStart: "2026-04-17",
    offerEnd: "2026-04-24",
    inClinic: true,
    online: false,
    atHome: false,
    travelFee: 500,
    theme: "pink",
    isActive: true,
  },
  {
    id: "ppkg_2",
    name: "Holistic Care Package",
    image: SAMPLE_IMAGE,
    images: [SAMPLE_IMAGE],
    features: [
      "Full body checkup",
      "Nutrition guidance",
      "Stress management",
      "Preventive care planning",
    ],
    serviceIds: ["psvc_1"],
    totalAmount: 6500,
    price: 4600,
    originalPrice: 6500,
    limitedPrice: 4600,
    discountType: "percent",
    discountValue: 29,
    offerStart: "2026-04-17",
    offerEnd: "2026-04-24",
    inClinic: true,
    online: true,
    atHome: false,
    travelFee: 500,
    theme: "blue",
    isActive: true,
  },
  {
    id: "ppkg_3",
    name: "Hormonal Balance Package",
    image: SAMPLE_IMAGE,
    images: [SAMPLE_IMAGE],
    features: [
      "Hormone evaluation",
      "Thyroid screening",
      "Lifestyle consultation",
      "Follow-up guidance",
    ],
    serviceIds: ["psvc_2"],
    totalAmount: 7800,
    price: 5600,
    originalPrice: 7800,
    limitedPrice: 5600,
    discountType: "percent",
    discountValue: 28,
    offerStart: "2026-04-17",
    offerEnd: "2026-04-24",
    inClinic: true,
    online: false,
    atHome: true,
    travelFee: 500,
    theme: "orange",
    isActive: true,
  },
];

function createId() {
  return `ppkg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function nextTheme(packages) {
  const index = packages.length % PACKAGE_THEMES.length;
  return PACKAGE_THEMES[index];
}

export function getSavePercent(pkg) {
  if (pkg.discountType === "percent" && pkg.discountValue > 0) {
    return Math.round(pkg.discountValue);
  }
  const original = pkg.originalPrice || pkg.totalAmount || 0;
  const price = pkg.price || pkg.limitedPrice || 0;
  if (original > 0 && price > 0 && original > price) {
    return Math.round((1 - price / original) * 100);
  }
  return 0;
}

export const emptyPackageForm = () => ({
  name: "",
  images: [],
  serviceIds: [],
  discountType: "percent",
  discountValue: "",
  limitedPrice: "",
  offerStart: "",
  offerEnd: "",
  inClinic: true,
  online: false,
  atHome: false,
  travelFee: 500,
});

export function packageToForm(pkg) {
  if (!pkg) return emptyPackageForm();
  return {
    name: pkg.name || "",
    images: pkg.images?.length ? [...pkg.images] : pkg.image ? [pkg.image] : [],
    serviceIds: pkg.serviceIds ? [...pkg.serviceIds] : [],
    discountType: pkg.discountType || "percent",
    discountValue: pkg.discountValue != null ? String(pkg.discountValue) : "",
    limitedPrice: pkg.limitedPrice != null ? String(pkg.limitedPrice) : "",
    offerStart: pkg.offerStart || "",
    offerEnd: pkg.offerEnd || "",
    inClinic: Boolean(pkg.inClinic),
    online: Boolean(pkg.online),
    atHome: Boolean(pkg.atHome),
    travelFee: pkg.travelFee ?? 500,
  };
}

function computePricing(form, totalAmount) {
  const discountValue = Number(form.discountValue) || 0;
  let limitedPrice = Number(form.limitedPrice) || 0;

  if (!limitedPrice && totalAmount > 0 && discountValue > 0) {
    if (form.discountType === "percent") {
      limitedPrice = Math.round(totalAmount * (1 - discountValue / 100));
    } else {
      limitedPrice = Math.max(0, totalAmount - discountValue);
    }
  }

  if (!limitedPrice && totalAmount > 0) {
    limitedPrice = totalAmount;
  }

  const savePercent =
    totalAmount > 0 && limitedPrice > 0 && totalAmount > limitedPrice
      ? Math.round((1 - limitedPrice / totalAmount) * 100)
      : form.discountType === "percent"
        ? Math.round(discountValue)
        : 0;

  return {
    totalAmount,
    price: limitedPrice,
    originalPrice: totalAmount || limitedPrice,
    limitedPrice: limitedPrice || null,
    discountType: form.discountType || "percent",
    discountValue:
      form.discountType === "percent" && discountValue > 0
        ? discountValue
        : savePercent || discountValue,
  };
}

function featuresFromServices(serviceIds, servicesById) {
  return serviceIds
    .map((id) => servicesById[id])
    .filter(Boolean)
    .map((s) => s.name)
    .slice(0, 4);
}

function normalizePackage(form, existingId, existingTheme, servicesLookup = {}) {
  const serviceIds = Array.isArray(form.serviceIds) ? form.serviceIds : [];
  const totalAmount = serviceIds.reduce((sum, id) => {
    const service = servicesLookup[id];
    return sum + (Number(service?.price) || 0);
  }, 0);

  const pricing = computePricing(form, totalAmount);
  const primaryImage = form.images?.[0] || SAMPLE_IMAGE;
  const features = featuresFromServices(serviceIds, servicesLookup);
  const fallbackFeatures =
    features.length > 0
      ? features
      : ["Consultation", "Health check", "Screening", "Care plan"];

  return {
    id: existingId || createId(),
    name: form.name.trim() || "New Package",
    image: primaryImage,
    images: form.images?.length ? form.images : [primaryImage],
    features: fallbackFeatures,
    serviceIds,
    ...pricing,
    offerStart: form.offerStart || "",
    offerEnd: form.offerEnd || "",
    inClinic: Boolean(form.inClinic),
    online: Boolean(form.online),
    atHome: Boolean(form.atHome),
    travelFee: Number(form.travelFee) || 0,
    theme: existingTheme || "pink",
    isActive: true,
  };
}

export const useProviderPackagesStore = create(
  devtools(
    persist(
      (set, get) => ({
        packages: SAMPLE_PROVIDER_PACKAGES,

        getPackageById: (id) => get().packages.find((p) => p.id === id),

        addPackage: (form, servicesLookup = {}) => {
          const theme = nextTheme(get().packages);
          const pkg = normalizePackage(form, null, theme, servicesLookup);
          set((state) => ({ packages: [pkg, ...state.packages] }));
          return pkg;
        },

        updatePackage: (id, form, servicesLookup = {}) => {
          const existing = get().packages.find((p) => p.id === id);
          const pkg = normalizePackage(
            form,
            id,
            existing?.theme || "pink",
            servicesLookup,
          );
          set((state) => ({
            packages: state.packages.map((p) => (p.id === id ? pkg : p)),
          }));
          return pkg;
        },

        deletePackage: (id) => {
          set((state) => ({
            packages: state.packages.filter((p) => p.id !== id),
          }));
        },

        resetToSample: () => set({ packages: SAMPLE_PROVIDER_PACKAGES }),
      }),
      createPersistOptions({ name: "bookento-provider-packages" }),
    ),
    { name: "ProviderPackagesStore" },
  ),
);

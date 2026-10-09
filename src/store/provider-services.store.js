import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

export const SERVICE_CATEGORIES = [
  {
    id: "dental",
    label: "Dental Care",
    icon: "/icons/categories/service/dental.png",
  },
  {
    id: "diabetes",
    label: "Diabetes Care",
    icon: "/icons/categories/service/diabetes.png",
  },
  {
    id: "eye",
    label: "Eye Care",
    icon: "/icons/categories/service/eye.png",
  },
  {
    id: "general",
    label: "General Physician",
    icon: "/icons/categories/service/general-physician.png",
  },
];

export const SERVICE_DURATION_OPTIONS = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
  { value: "90", label: "90 min" },
];

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=400&fit=crop";

export const SAMPLE_PROVIDER_SERVICES = [
  {
    id: "psvc_1",
    name: "Dental Care",
    description: "Complete dental checkup and treatment for healthy teeth and gums.",
    categoryId: "dental",
    image: SAMPLE_IMAGE,
    images: [SAMPLE_IMAGE],
    duration: 45,
    price: 599,
    originalPrice: 799,
    limitedPrice: 479,
    discountType: "percent",
    discountValue: 20,
    offerStart: "2026-04-17",
    offerEnd: "2026-04-20",
    inClinic: true,
    online: true,
    atHome: true,
    onlineModes: ["Video", "Audio Call"],
    travelFee: 500,
    isActive: true,
  },
  {
    id: "psvc_2",
    name: "Dental Care",
    description: "Complete dental checkup and treatment for healthy teeth and gums.",
    categoryId: "dental",
    image: SAMPLE_IMAGE,
    images: [SAMPLE_IMAGE],
    duration: 45,
    price: 599,
    originalPrice: 799,
    limitedPrice: 479,
    discountType: "percent",
    discountValue: 20,
    offerStart: "2026-04-17",
    offerEnd: "2026-04-20",
    inClinic: true,
    online: true,
    atHome: true,
    onlineModes: ["Video", "Audio Call"],
    travelFee: 500,
    isActive: true,
  },
];

function createId() {
  return `psvc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const emptyServiceForm = () => ({
  name: "",
  description: "",
  categoryId: "",
  images: [],
  duration: 45,
  price: "",
  limitedPrice: "",
  discountType: "rupee",
  discountValue: "",
  offerStart: "",
  offerEnd: "",
  inClinic: true,
  online: false,
  atHome: false,
  onlineModes: ["Video", "Audio Call"],
  travelFee: 500,
});

export function serviceToForm(service) {
  if (!service) return emptyServiceForm();
  return {
    name: service.name || "",
    description: service.description || "",
    categoryId: service.categoryId || "",
    images: service.images?.length
      ? [...service.images]
      : service.image
        ? [service.image]
        : [],
    duration: service.duration || 45,
    price: service.price != null ? String(service.price) : "",
    limitedPrice: service.limitedPrice != null ? String(service.limitedPrice) : "",
    discountType: service.discountType || "rupee",
    discountValue: service.discountValue != null ? String(service.discountValue) : "",
    offerStart: service.offerStart || "",
    offerEnd: service.offerEnd || "",
    inClinic: Boolean(service.inClinic),
    online: Boolean(service.online),
    atHome: Boolean(service.atHome),
    onlineModes: service.onlineModes || ["Video", "Audio Call"],
    travelFee: service.travelFee ?? 500,
  };
}

function normalizeService(form, existingId) {
  const price = Number(form.price) || 0;
  const limitedPrice = Number(form.limitedPrice) || 0;
  const discountValue = Number(form.discountValue) || 0;
  const originalPrice =
    limitedPrice > 0 && limitedPrice < price
      ? price
      : form.discountType === "percent" && discountValue > 0
        ? Math.round(price / (1 - discountValue / 100))
        : price + (form.discountType === "rupee" ? discountValue : 0);

  const category = SERVICE_CATEGORIES.find((c) => c.id === form.categoryId);
  const primaryImage = form.images?.[0] || SAMPLE_IMAGE;

  return {
    id: existingId || createId(),
    name: form.name.trim() || category?.label || "New Service",
    description: (form.description || "").trim(),
    categoryId: form.categoryId || "dental",
    image: primaryImage,
    images: form.images?.length ? form.images : [primaryImage],
    duration: Number(form.duration) || 45,
    price: limitedPrice > 0 && limitedPrice < price ? limitedPrice : price,
    originalPrice: originalPrice || price,
    limitedPrice: limitedPrice || null,
    discountType: form.discountType || "rupee",
    discountValue,
    offerStart: form.offerStart || "",
    offerEnd: form.offerEnd || "",
    inClinic: Boolean(form.inClinic),
    online: Boolean(form.online),
    atHome: Boolean(form.atHome),
    onlineModes: form.onlineModes || ["Video", "Audio Call"],
    travelFee: Number(form.travelFee) || 0,
    isActive: true,
  };
}

export const useProviderServicesStore = create(
  devtools(
    persist(
      (set, get) => ({
        services: SAMPLE_PROVIDER_SERVICES,

        getServiceById: (id) => get().services.find((s) => s.id === id),

        addService: (form) => {
          const service = normalizeService(form);
          set((state) => ({ services: [service, ...state.services] }));
          return service;
        },

        updateService: (id, form) => {
          const service = normalizeService(form, id);
          set((state) => ({
            services: state.services.map((s) => (s.id === id ? service : s)),
          }));
          return service;
        },

        deleteService: (id) => {
          set((state) => ({
            services: state.services.filter((s) => s.id !== id),
          }));
        },

        resetToSample: () => set({ services: SAMPLE_PROVIDER_SERVICES }),
      }),
      createPersistOptions({ name: "bookento-provider-services" }),
    ),
    { name: "ProviderServicesStore" },
  ),
);

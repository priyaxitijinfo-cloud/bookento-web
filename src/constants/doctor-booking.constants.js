export const DOCTOR_PROFILE_COVER = "/images/providers/hospital-cover.png";

export const DOCTOR_VIDEO_FILES = [
  "PrintDwn_1785231805.mp4",
  "PrintDwn_1785231842.mp4",
  "PrintDwn_1785231955.mp4",
  "PrintDwn_1785232052.mp4",
  "PrintDwn_1785232091.mp4",
];

const DOCTOR_REEL_META = [
  {
    title: "The perfect wellness day",
    caption: "Swim, relax, and refresh. Book your slot now.",
    handle: "Women's Wellness Clinic",
    likes: 150000,
    comments: 136,
    shares: 48,
    views: 890000,
    packageId: "doc_pkg_1",
    isPopular: true,
    isNearby: true,
  },
  {
    title: "Clinic tour & care experience",
    caption: "See our modern facilities and patient-first approach.",
    handle: "Holistic Care Center",
    likes: 98500,
    comments: 92,
    shares: 31,
    views: 540000,
    packageId: "doc_pkg_2",
    isPopular: true,
    isNearby: true,
  },
  {
    title: "Hormonal health tips",
    caption: "Simple daily habits for better hormonal balance.",
    handle: "Dr. Wellness Hub",
    likes: 67200,
    comments: 74,
    shares: 22,
    views: 320000,
    packageId: "doc_pkg_3",
    isPopular: true,
    isNearby: true,
  },
  {
    title: "Preventive checkup guide",
    caption: "Why regular health screenings matter for every woman.",
    handle: "Preventive Health",
    likes: 45300,
    comments: 58,
    shares: 19,
    views: 125500,
    packageId: "doc_pkg_1",
    isPopular: true,
    isNearby: true,
  },
  {
    title: "Modern clinic facilities",
    caption: "Tour our state-of-the-art hospital and care units.",
    handle: "City Health Hospital",
    likes: 82100,
    comments: 64,
    shares: 27,
    views: 652200,
    packageId: "doc_pkg_2",
    isPopular: true,
    isNearby: true,
  },
];

export const DOCTOR_REELS = DOCTOR_VIDEO_FILES.map((fileName, index) => {
  const meta = DOCTOR_REEL_META[index] || DOCTOR_REEL_META[0];
  const videoUrl = `/videos/${fileName}`;

  return {
    id: `doc_reel_${index + 1}`,
    ...meta,
    videoUrl,
  };
});

export const DOCTOR_GALLERY = [
  {
    id: "doc_gal_1",
    url: "/images/doctor-gallery/gallery-1.png",
    caption: "Reception & lounge area",
    featured: true,
  },
  {
    id: "doc_gal_2",
    url: "/images/doctor-gallery/gallery-2.png",
    caption: "Ultrasound suite",
  },
  {
    id: "doc_gal_3",
    url: "/images/doctor-gallery/gallery-3.png",
    caption: "Consultation room",
  },
  {
    id: "doc_gal_4",
    url: "/images/doctor-gallery/gallery-4.png",
    caption: "Welcome reception desk",
  },
  {
    id: "doc_gal_5",
    url: "/images/doctor-gallery/gallery-5.png",
    caption: "Patient waiting corridor",
  },
  {
    id: "doc_gal_6",
    url: "/images/doctor-gallery/gallery-6.png",
    caption: "Our medical team",
  },
  {
    id: "doc_gal_7",
    url: "/images/doctor-gallery/gallery-7.png",
    caption: "Private patient suite",
  },
];

const DOCTOR_SERVICE_CATALOG = [
  { name: "Annual Physical Checkup", duration: 45, price: 15000, originalPrice: 19000 },
  { name: "General Consultation", duration: 30, price: 1500, originalPrice: 2500 },
  { name: "Follow-up Consultation", duration: 20, price: 800, originalPrice: 1200 },
  { name: "Women's Health Screening", duration: 40, price: 4500, originalPrice: 5500 },
  { name: "Prenatal Checkup", duration: 35, price: 3200, originalPrice: 4000 },
  { name: "Postnatal Care Visit", duration: 30, price: 2800, originalPrice: 3500 },
  { name: "Hormonal Balance Consultation", duration: 30, price: 2200, originalPrice: 2800 },
  { name: "PCOS Management Session", duration: 35, price: 2600, originalPrice: 3200 },
  { name: "Thyroid Profile Consultation", duration: 25, price: 1800, originalPrice: 2400 },
  { name: "Diabetes Monitoring Visit", duration: 30, price: 2000, originalPrice: 2600 },
  { name: "Blood Pressure Review", duration: 20, price: 900, originalPrice: 1200 },
  { name: "Nutrition & Diet Counseling", duration: 30, price: 1600, originalPrice: 2100 },
  { name: "Mental Wellness Consultation", duration: 45, price: 2400, originalPrice: 3000 },
  { name: "Skin & Hair Consultation", duration: 25, price: 1400, originalPrice: 1800 },
  { name: "Allergy Assessment", duration: 30, price: 1700, originalPrice: 2200 },
  { name: "Vaccination Consultation", duration: 20, price: 1100, originalPrice: 1500 },
  { name: "Lab Report Review", duration: 15, price: 700, originalPrice: 1000 },
  { name: "Ultrasound Consultation", duration: 30, price: 3500, originalPrice: 4200 },
  { name: "Bone Health Checkup", duration: 30, price: 2100, originalPrice: 2700 },
  { name: "Menopause Care Session", duration: 35, price: 2500, originalPrice: 3100 },
  { name: "Fertility Counseling", duration: 40, price: 3800, originalPrice: 4600 },
  { name: "Sleep Disorder Consultation", duration: 30, price: 1900, originalPrice: 2500 },
  { name: "Physiotherapy Assessment", duration: 35, price: 2300, originalPrice: 2900 },
  { name: "Senior Care Checkup", duration: 40, price: 2700, originalPrice: 3400 },
  { name: "Emergency Teleconsultation", duration: 15, price: 1200, originalPrice: 1600 },
];

export const DOCTOR_BOOKING_SERVICES = DOCTOR_SERVICE_CATALOG.map((service, index) => ({
  id: `doc_svc_${index + 1}`,
  ...service,
}));

export const DOCTOR_WELLNESS_PACKAGES = [
  {
    id: "doc_pkg_1",
    name: "Women's Wellness Package",
    description: "Choose a care plan tailored to your needs",
    image: "/images/packages/wellness-package-1.png",
    features: [
      "General consultation",
      "Routine health check",
      "Hormonal screening",
      "Personalized health plan",
    ],
    originalPrice: 7000,
    price: 5000,
    discountPercent: 29,
    theme: "rose",
  },
  {
    id: "doc_pkg_2",
    name: "Holistic Care Package",
    description: "Complete preventive care for busy professionals",
    image: "/images/packages/wellness-package-2.png",
    features: [
      "Full body checkup",
      "Nutrition guidance",
      "Stress management",
      "Preventive care planning",
    ],
    originalPrice: 8500,
    price: 6200,
    discountPercent: 27,
    theme: "blue",
  },
  {
    id: "doc_pkg_3",
    name: "Hormonal Balance Package",
    description: "Specialized hormonal health evaluation",
    image: "/images/packages/wellness-package-3.png",
    features: [
      "Hormone evaluation",
      "Thyroid screening",
      "Lifestyle consultation",
      "Follow-up guidance",
    ],
    originalPrice: 7800,
    price: 5600,
    discountPercent: 28,
    theme: "amber",
  },
];

export const DOCTOR_ABOUT_DESCRIPTION = [
  "Dr. Amara Reyes is a highly experienced and board-certified gynecologist with over 10 years of dedicated practice in women's health. She is known for her compassionate approach, clinical excellence, and commitment to providing personalized care tailored to each patient's unique needs. Dr. Reyes specializes in preventive gynecology, reproductive health, hormonal balance, and minimally invasive procedures, ensuring that her patients receive the most advanced and effective treatments available.",
  "She believes that every patient deserves to feel heard, respected, and empowered when making healthcare decisions. Her approach focuses on building long-term relationships, educating patients about their health.",
];

export const PACKAGE_THEMES = {
  rose: {
    badge: "bg-rose-100 text-rose-700",
    checkBg: "bg-rose-500",
    check: "text-rose-500",
    price: "text-rose-600",
    button: "bg-rose-500 text-white hover:bg-rose-600",
    card: "border-rose-100 bg-gradient-to-r from-rose-50/80 to-white",
  },
  blue: {
    badge: "bg-sky-100 text-sky-700",
    checkBg: "bg-sky-500",
    check: "text-sky-500",
    price: "text-sky-600",
    button: "bg-sky-500 text-white hover:bg-sky-600",
    card: "border-sky-100 bg-gradient-to-r from-sky-50/80 to-white",
  },
  amber: {
    badge: "bg-amber-100 text-amber-700",
    checkBg: "bg-amber-500",
    check: "text-amber-500",
    price: "text-amber-600",
    button: "bg-amber-500 text-white hover:bg-amber-600",
    card: "border-amber-100 bg-gradient-to-r from-amber-50/80 to-white",
  },
};

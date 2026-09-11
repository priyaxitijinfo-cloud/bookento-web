import fs from "node:fs/promises";

const outputPath = new URL("./extra-web-messages.json", import.meta.url);

const en = {
  featureInstantTitle: "Instant Booking",
  featureInstantDesc: "Book appointments in seconds with real-time availability and instant confirmation.",
  featureAvailabilityTitle: "Real-Time Availability",
  featureAvailabilityDesc: "See live schedules and book slots that work perfectly for your calendar.",
  featureVideoTitle: "Video Consultation",
  featureVideoDesc: "Connect with professionals remotely through secure HD video calls.",
  featureChatTitle: "In-App Chat",
  featureChatDesc: "Message your service providers directly for questions and updates.",
  featurePaymentsTitle: "Online Payments",
  featurePaymentsDesc: "Secure payment processing with multiple options and instant receipts.",
  featureRemindersTitle: "Smart Reminders",
  featureRemindersDesc: "Never miss an appointment with push notifications and SMS alerts.",
  featureRxTitle: "Digital Prescriptions",
  featureRxDesc: "Receive and store digital prescriptions securely in your health vault.",
  featureRatingsTitle: "Ratings & Reviews",
  featureRatingsDesc: "Make informed decisions with verified reviews from real customers.",
  faq1Q: "What is Bookento?",
  faq1A: "Bookento is your everyday booking partner for salon, spa, home care, fitness, doctors, and more — so you can find trusted professionals and book in a few taps.",
  faq2Q: "How do I book a service?",
  faq2A: "Choose a category, pick a professional nearby, select a service and time slot, then confirm your booking. You'll get reminders and can manage everything from your appointments.",
  faq3Q: "Can I reschedule or cancel a booking?",
  faq3A: "Yes. Open your appointment details to reschedule or cancel based on the provider's policy. You'll always see the applicable rules before you confirm changes.",
  faq4Q: "Are the professionals verified?",
  faq4A: "We highlight ratings, reviews, and profile details so you can book with confidence. Look for ratings and past customer feedback on each provider card.",
  faq5Q: "What payment methods are supported?",
  faq5A: "You can pay securely through supported online methods at checkout. Wallet options may also be available depending on your account and offers.",
  appLive: "Live on stores",
  appTitle1: "Catch every",
  appTitle2: "booking signal.",
  appBody: "Bookento on your phone means faster discovery, clearer slots, and reminders that actually show up.",
  appStoreEyebrow: "Download on the",
  appStoreName: "App Store",
  playEyebrow: "GET IT ON",
  playName: "Google Play",
  popularLabel: "Popular:",
  chipHaircut: "Haircut",
  chipMassage: "Massage",
  chipHomeCleaning: "Home Cleaning",
  chipPersonalTraining: "Personal Training",
  chipTeethCleaning: "Teeth Cleaning",
  bookNow: "Book now",
  promoUpTo: "Up to",
  promoOffBookings: "Off bookings",
  footerAbout: "About",
  footerServices: "Services",
  footerProfessionals: "Professionals",
  footerBecomeProvider: "Become a Provider",
  footerHelp: "Help Center",
  catDoctor: "Doctor",
  catSalon: "Salon",
  catFitness: "Fitness",
  catTutoring: "Tutoring",
  catPetCare: "Pet Care",
  catHomecare: "Homecare",
  catKidsCare: "Kids Care",
  catPlumbing: "Plumbing",
  catAutomotive: "Automotive",
  catGardening: "Gardening",
  catCooking: "Cooking",
  catEvents: "Events",
  catCarpenter: "Carpenter",
  catRenovation: "Renovation",
  catShooting: "Shooting",
  popularBadgeShort: "Popular",
  packageSave20: "SAVE 20%",
  packageSalonTitle: "Salon Care Combo",
  packageSalonSubtitle: "Hair Spa + Facial + Manicure",
  packageHomeTitle: "Home Cleaning Packages",
  packageHomeSubtitle: "4 Visits / Month",
  packagePetTitle: "Pet Care Package",
  packagePetSubtitle: "Grooming + Bath + Nail Trim",
  popularServiceHaircut: "Haircut & Styling",
  popularServiceMassage: "Deep Tissue Massage",
  popularServiceDental: "Teeth Cleaning",
  popularServiceTraining: "Personal Training",
};

const languages = ["hi", "es", "fr", "pt", "de", "it", "tr", "id", "ko", "zh-CN", "ru", "ja", "ar", "bn", "ta", "te", "sw"];
const outputCodes = { "zh-CN": "zh" };
const protectedValues = {
  appStoreName: "App Store",
  playName: "Google Play",
};

function protect(text) {
  return text
    .replaceAll("Bookento", "__BOOKENTO__")
    .replaceAll("App Store", "__APP_STORE__")
    .replaceAll("Google Play", "__GOOGLE_PLAY__");
}

function restore(text) {
  return text
    .replaceAll("__BOOKENTO__", "Bookento")
    .replaceAll("__ BOOKENTO __", "Bookento")
    .replaceAll("__APP_STORE__", "App Store")
    .replaceAll("__ APP_STORE __", "App Store")
    .replaceAll("__GOOGLE_PLAY__", "Google Play")
    .replaceAll("__ GOOGLE_PLAY __", "Google Play");
}

async function translate(text, language, attempt = 1) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: language,
    dt: "t",
    q: protect(text),
  });
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.json();
    return restore(body[0].map((part) => part[0]).join(""));
  } catch (error) {
    if (attempt >= 5) throw error;
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    return translate(text, language, attempt + 1);
  }
}

async function mapConcurrent(entries, language, concurrency = 8) {
  const result = {};
  let cursor = 0;
  async function worker() {
    while (cursor < entries.length) {
      const index = cursor++;
      const [key, value] = entries[index];
      result[key] = protectedValues[key] ?? await translate(value, language);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return Object.fromEntries(entries.map(([key]) => [key, result[key]]));
}

const all = { en };
const entries = Object.entries(en);
for (const language of languages) {
  const code = outputCodes[language] ?? language;
  console.log(`Translating ${code}...`);
  all[code] = await mapConcurrent(entries, language);
}

await fs.writeFile(outputPath, `${JSON.stringify(all, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath.pathname} with ${entries.length} keys per language.`);

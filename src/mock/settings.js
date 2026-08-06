export const userSettings = {
  notifications: {
    push: true,
    email: true,
    sms: false,
    bookingUpdates: true,
    promotions: false,
    chatMessages: true,
  },
  privacy: {
    showProfile: true,
    showReviews: true,
    showActivity: false,
  },
  preferences: {
    language: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
  },
};

export const providerSettings = {
  notifications: {
    push: true,
    email: true,
    sms: true,
    newBookings: true,
    cancellations: true,
    reviews: true,
    payouts: true,
  },
  business: {
    autoAcceptBookings: false,
    bufferTime: 15,
    maxDailyBookings: 20,
    cancellationPolicy: "24_hours",
  },
  payment: {
    bankName: "HDFC Bank",
    accountHolder: "Raj Mehta",
    accountNumber: "****7890",
    ifsc: "HDFC0001234",
    upi: "rajmehta@upi",
  },
};

export const providerTypes = [
  { id: "ptype_001", name: "Individual Professional", slug: "individual", icon: "User" },
  { id: "ptype_002", name: "Business / Company", slug: "business", icon: "Building2" },
  { id: "ptype_003", name: "Franchise", slug: "franchise", icon: "Store" },
  { id: "ptype_004", name: "Freelancer", slug: "freelancer", icon: "Briefcase" },
];

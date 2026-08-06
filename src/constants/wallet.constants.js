export const WALLET_QUICK_AMOUNTS = [100, 200, 500, 1000];

export const WALLET_ADD_MONEY_OFFERS = [
  {
    id: "offer-1",
    code: "SALON20",
    discountLabel: "₹200",
    description: "20% OFF up to ₹150 on Salon Services",
    validTill: "30 Apr 2026",
    savePercent: 29,
    minAmount: 5000,
    discount: { type: "percent", value: 20, cap: 150 },
  },
  {
    id: "offer-2",
    code: "WALLET100",
    discountLabel: "₹100",
    description: "Flat ₹100 cashback on wallet top-up above ₹1,000",
    validTill: "15 May 2026",
    savePercent: 18,
    minAmount: 1000,
    discount: { type: "flat", value: 100, minTopUp: 1000 },
  },
  {
    id: "offer-3",
    code: "HEALTH50",
    discountLabel: "₹150",
    description: "15% OFF up to ₹150 on Doctor Consultations",
    validTill: "22 Jun 2026",
    savePercent: 22,
    minAmount: 2500,
    discount: { type: "percent", value: 15, cap: 150 },
  },
  {
    id: "offer-4",
    code: "CLEAN30",
    discountLabel: "₹120",
    description: "30% OFF up to ₹120 on Home Cleaning bookings",
    validTill: "10 Mar 2026",
    savePercent: 25,
    minAmount: 1500,
    discount: { type: "percent", value: 30, cap: 120 },
  },
  {
    id: "offer-5",
    code: "FIT150",
    discountLabel: "₹250",
    description: "₹250 OFF on Fitness & Yoga session packages",
    validTill: "05 Jul 2026",
    savePercent: 32,
    minAmount: 3000,
    discount: { type: "flat", value: 250, minTopUp: 3000 },
  },
  {
    id: "offer-6",
    code: "PAWS75",
    discountLabel: "₹75",
    description: "Flat ₹75 OFF on Pet Care & grooming services",
    validTill: "18 Apr 2026",
    savePercent: 15,
    minAmount: 800,
    discount: { type: "flat", value: 75, minTopUp: 800 },
  },
];

/** Returns discount in rupees for a wallet top-up amount. */
export function getWalletOfferDiscount(offer, amount) {
  if (!offer?.discount || amount <= 0) return 0;

  const { type, value, cap, minTopUp = 0 } = offer.discount;
  if (amount < minTopUp) return 0;

  if (type === "flat") {
    return Math.min(value, amount);
  }

  const percentDiscount = Math.round((amount * value) / 100);
  return Math.min(cap ?? percentDiscount, amount, percentDiscount);
}

export function getWalletPayableTotal(amount, discount) {
  return Math.max(amount - discount, 0);
}


export const WALLET_BANKS = [
  {
    id: "hdfc",
    name: "HDFC Bank",
    icon: "/icons/banks/hdfc-bank.svg",
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    icon: "/icons/banks/bank-of-baroda.svg",
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    icon: "/icons/banks/kotak-mahindra-bank.svg",
  },
  {
    id: "union",
    name: "Union Bank of India",
    icon: "/icons/banks/union-bank-of-india.svg",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    icon: "/icons/banks/icici-bank.svg",
  },
];

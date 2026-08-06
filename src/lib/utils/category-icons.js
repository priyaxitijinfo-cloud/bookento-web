import {
  Activity, Apple, Baby, BookOpen, Bug, Calculator, Camera, Car, ChefHat, Dumbbell,
  Hammer, Hand, Heart, Home, Leaf, Paintbrush, Palette, PartyPopper,
  PawPrint, Scale, Scissors, Settings, Shirt, Smartphone, Sofa,
  Sparkles, Stethoscope, TreePine, Utensils, Wind, Wrench, Zap,
} from "lucide-react";

const ICON_MAP = {
  Scissors, Sparkles, Heart, Dumbbell, Leaf, Home, Wrench, Zap,
  Wind, Bug, Palette, Hand, Activity, Apple, PawPrint, Car,
  Sofa, Camera, BookOpen, Scale, Calculator, PartyPopper, Utensils,
  Shirt, TreePine, Paintbrush, Hammer, Settings, Smartphone,
  Stethoscope, Baby, ChefHat,
};

const CATEGORY_PALETTE = [
  { bg: "bg-rose-50", icon: "text-rose-600", hover: "group-hover:bg-rose-100" },
  { bg: "bg-violet-50", icon: "text-violet-600", hover: "group-hover:bg-violet-100" },
  { bg: "bg-sky-50", icon: "text-sky-600", hover: "group-hover:bg-sky-100" },
  { bg: "bg-emerald-50", icon: "text-emerald-600", hover: "group-hover:bg-emerald-100" },
  { bg: "bg-amber-50", icon: "text-amber-600", hover: "group-hover:bg-amber-100" },
  { bg: "bg-indigo-50", icon: "text-indigo-600", hover: "group-hover:bg-indigo-100" },
  { bg: "bg-teal-50", icon: "text-teal-600", hover: "group-hover:bg-teal-100" },
  { bg: "bg-fuchsia-50", icon: "text-fuchsia-600", hover: "group-hover:bg-fuchsia-100" },
];

export function getCategoryIcon(name) {
  return ICON_MAP[name] || Sparkles;
}

export function getCategoryPalette(index) {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

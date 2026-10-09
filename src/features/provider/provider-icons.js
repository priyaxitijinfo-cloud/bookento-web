/**
 * Provider Flow icon map — source of truth is `icons/` (mirrored at
 * `/public/icons/provider-pack/`). Prefer pack paths below.
 *
 * Named `/icons/...` assets are kept only where they are the same glyph
 * (nav/12, Chats, profile/*, edit, etc.) — pack path is still primary.
 *
 * Refs: bottom nav, settings menu (Business Info + Operations).
 */

const PACK = "/icons/provider-pack";

/** Semantic keys used by Provider Flow UI */
export const PROVIDER_ICONS = {
  // ── Bottom nav ───────────────────────────────────────────────────────
  /** Smiling house — pack/305130; identical geometry: /icons/nav/12.svg */
  home: `${PACK}/305130.svg`,
  /** Chat bubble + 3 dots — identical: /icons/Chats.svg */
  chats: `${PACK}/126912.svg`,
  /** Calendar FAB with date-dot grid — identical: /icons/nav/14.svg */
  schedule: `${PACK}/285328.svg`,
  /** Wallet (cards peeking) — monochrome; alt named /icons/provider/wallet.svg differs */
  earnings: `${PACK}/315031.svg`,
  /** Gear / cog — pack primary; named /icons/provider/settings.svg is a different lucide-style glyph */
  settings: `${PACK}/324932.svg`,

  // ── Settings menu — Business Info ────────────────────────────────────
  /** Document + info “i” badge — same family as /icons/profile/03.svg */
  serviceDetails: `${PACK}/384338.svg`,
  /** Photo frames + circular refresh arrows — same as /icons/profile/05.svg */
  uploadMedia: `${PACK}/443744.svg`,
  /** Calendar + clock badge (slot management) */
  slots: `${PACK}/404140.svg`,

  // ── Settings menu — Operations ───────────────────────────────────────
  /** 2×2 tiles with “+” — Suggest Category */
  category: `${PACK}/414041.svg`,
  /** Scalloped seal with “%” — Packages / offers */
  packages: `${PACK}/423942.svg`,
  /** Three stars over review ticket — same as /icons/profile/07.svg */
  ratings: `${PACK}/433843.svg`,
  /** No language glyph in pack — keep named public asset */
  language: "/icons/provider/language.svg",
  /** Door + exit arrow — same as /icons/profile/09.svg (white; tint via CSS) */
  logout: `${PACK}/453645.svg`,

  // ── Settings menu — More (desktop) ───────────────────────────────────
  /** Spiral notepad / booking notes */
  document: `${PACK}/136813.svg`,
  /** Clinic / hospital building with cross */
  building: `${PACK}/562556.svg`,
  /** Report-style list (no funnel glyph in pack) — Analytics */
  analytics: `${PACK}/136813.svg`,
  /** @deprecated alias — prefer `analytics` */
  filter: `${PACK}/136813.svg`,

  // ── Profile / chrome ─────────────────────────────────────────────────
  /** Pencil + underline — same family as /icons/edit.svg */
  edit: `${PACK}/503150.svg`,
  /** Bell — same family as /icons/profile/10.svg */
  bell: `${PACK}/275427.svg`,
  search: `${PACK}/740774.svg`,
  /** Outline calendar grid (non-FAB) */
  calendar: `${PACK}/176417.svg`,
  download: `${PACK}/097209.svg`,
  /** Outline house (stroke) — softer home; identical: /icons/House.svg */
  homeOutline: `${PACK}/305130.svg`,
  /** Gradient wallet glyph — settings-style earnings card */
  walletGlyph: `${PACK}/315031.svg`,
  /** Color wallet + coin deposit */
  walletDeposit: `${PACK}/354635.svg`,
  /** Wallet + clock — pending / history */
  walletPending: `${PACK}/364536.svg`,

  // ── Stars / ratings extras ───────────────────────────────────────────
  star: `${PACK}/018001.svg`,
  starFilled: `${PACK}/681368.svg`,
  starFilledSm: `${PACK}/691269.svg`,

  // ── Time / schedule extras ───────────────────────────────────────────
  clock: `${PACK}/166516.svg`,
  calendarBlue: `${PACK}/245724.svg`,
  calendarColor: `${PACK}/087308.svg`,
  /** Pink calendar grid (slots alt without clock) */
  calendarPink: `${PACK}/522952.svg`,

  // ── Media ────────────────────────────────────────────────────────────
  gallery: `${PACK}/027902.svg`,
  galleryMono: `${PACK}/146714.svg`,
  /** Image frame + upload arrow */
  uploadImage: `${PACK}/394239.svg`,
  camera: `${PACK}/473447.svg`,
  video: `${PACK}/532853.svg`,
  videoPurple: `${PACK}/572457.svg`,
  play: `${PACK}/671467.svg`,
  mic: `${PACK}/780378.svg`,

  // ── Actions ──────────────────────────────────────────────────────────
  eye: `${PACK}/334833.svg`,
  eyeSm: `${PACK}/641764.svg`,
  trash: `${PACK}/513051.svg`,
  trashRed: `${PACK}/047704.svg`,
  /** Duplicate of trashRed */
  trashRedAlt: `${PACK}/661566.svg`,
  plus: `${PACK}/602160.svg`,
  plusLg: `${PACK}/790279.svg`,
  minus: `${PACK}/592259.svg`,
  check: `${PACK}/621962.svg`,
  checkCircle: `${PACK}/463546.svg`,
  verified: `${PACK}/077407.svg`,
  closeCircle: `${PACK}/612061.svg`,
  editWhite: `${PACK}/057605.svg`,
  editSm: `${PACK}/651665.svg`,
  copy: `${PACK}/800180.svg`,
  send: `${PACK}/235823.svg`,
  upload: `${PACK}/730873.svg`,
  like: `${PACK}/711071.svg`,
  /** Hand holding $ money bag */
  handMoney: `${PACK}/344734.svg`,

  // ── Info / contact ───────────────────────────────────────────────────
  info: `${PACK}/107110.svg`,
  infoOutline: `${PACK}/225922.svg`,
  location: `${PACK}/186318.svg`,
  phone: `${PACK}/117011.svg`,
  phoneMono: `${PACK}/206120.svg`,
  phoneDark: `${PACK}/750675.svg`,
  phoneBlue: `${PACK}/760576.svg`,
  mail: `${PACK}/196219.svg`,
  user: `${PACK}/255625.svg`,
  userMono: `${PACK}/156615.svg`,

  // ── Security / money / offers ────────────────────────────────────────
  security: `${PACK}/216021.svg`,
  bank: `${PACK}/374437.svg`,
  /** Purple % seal (offers alt) */
  offers: `${PACK}/552655.svg`,
  /** Vacation / OOO beach scene */
  vacation: `${PACK}/037803.svg`,

  // ── Navigation chrome ────────────────────────────────────────────────
  chevronDown: `${PACK}/067506.svg`,
  caretDown: `${PACK}/483348.svg`,
  chevronRight: `${PACK}/720972.svg`,
  arrowLeft: `${PACK}/265526.svg`,
  /** Double-check / delivered / back-confirm */
  doubleCheck: `${PACK}/770477.svg`,
  back: `${PACK}/770477.svg`,
  more: `${PACK}/493249.svg`,
  moreSm: `${PACK}/631863.svg`,

  // ── Chat extras ──────────────────────────────────────────────────────
  chatList: `${PACK}/295229.svg`,
  chatDots: `${PACK}/701170.svg`,

  // ── Home / house color variants ──────────────────────────────────────
  homePink: `${PACK}/542754.svg`,
  homePinkAlt: `${PACK}/582358.svg`,
};

/**
 * Complete pack catalog: every SVG in icons/ → what it depicts.
 * Paths are `/icons/provider-pack/<file>` (public mirror of `icons/`).
 */
export const PROVIDER_PACK_CATALOG = {
  "018001.svg": { key: "star", depicts: "Star outline (unfilled rating)" },
  "027902.svg": { key: "gallery", depicts: "Image / gallery (landscape + sun)" },
  "037803.svg": { key: "vacation", depicts: "Beach / vacation / out-of-office" },
  "047704.svg": { key: "trashRed", depicts: "Trash can (red delete)" },
  "057605.svg": { key: "editWhite", depicts: "Pencil (white edit)" },
  "067506.svg": { key: "chevronDown", depicts: "Chevron down" },
  "077407.svg": { key: "verified", depicts: "Green scalloped verified badge + check" },
  "087308.svg": { key: "calendarColor", depicts: "Colorful calendar with date grid" },
  "097209.svg": { key: "download", depicts: "Download arrow into tray" },
  "107110.svg": { key: "info", depicts: "Info circle with “i” (filled)" },
  "117011.svg": { key: "phone", depicts: "Phone handset + waves (green)" },
  "126912.svg": { key: "chats", depicts: "Chat bubble with 3 dots" },
  "136813.svg": { key: "document", depicts: "Spiral notepad / notes document" },
  "146714.svg": { key: "galleryMono", depicts: "Image / gallery mountain (mono)" },
  "156615.svg": { key: "userMono", depicts: "User silhouette (mono)" },
  "166516.svg": { key: "clock", depicts: "Clock face" },
  "176417.svg": { key: "calendar", depicts: "Calendar with date grid (mono)" },
  "186318.svg": { key: "location", depicts: "Map pin / location marker" },
  "196219.svg": { key: "mail", depicts: "Envelope / mail" },
  "206120.svg": { key: "phoneMono", depicts: "Phone handset + waves (mono)" },
  "216021.svg": { key: "security", depicts: "Shield with padlock" },
  "225922.svg": { key: "infoOutline", depicts: "Info circle outline with “i”" },
  "235823.svg": { key: "send", depicts: "Paper plane / send" },
  "245724.svg": { key: "calendarBlue", depicts: "Calendar with date grid (blue)" },
  "255625.svg": { key: "user", depicts: "User silhouette (blue)" },
  "265526.svg": { key: "arrowLeft", depicts: "Arrow left / back" },
  "275427.svg": { key: "bell", depicts: "Notification bell" },
  "285328.svg": { key: "schedule", depicts: "Calendar FAB with date dots" },
  "295229.svg": { key: "chatList", depicts: "Chat bubble with text lines" },
  "305130.svg": { key: "home", depicts: "House with smile (home)" },
  "315031.svg": { key: "earnings", depicts: "Wallet with cards" },
  "324932.svg": { key: "settings", depicts: "Gear / settings cog" },
  "334833.svg": { key: "eye", depicts: "Eye / visibility" },
  "344734.svg": { key: "handMoney", depicts: "Hand holding money bag ($)" },
  "354635.svg": { key: "walletDeposit", depicts: "Wallet + coin deposit arrow" },
  "364536.svg": { key: "walletPending", depicts: "Wallet + clock (pending)" },
  "374437.svg": { key: "bank", depicts: "Bank / columns building" },
  "384338.svg": { key: "serviceDetails", depicts: "Document with info “i” badge" },
  "394239.svg": { key: "uploadImage", depicts: "Photo frame + upload arrow" },
  "404140.svg": { key: "slots", depicts: "Calendar + clock (slots)" },
  "414041.svg": { key: "category", depicts: "2×2 tiles with plus (category)" },
  "423942.svg": { key: "packages", depicts: "Scalloped % seal (packages/offers)" },
  "433843.svg": { key: "ratings", depicts: "Stars over review ticket" },
  "443744.svg": { key: "uploadMedia", depicts: "Photos + circular refresh arrows" },
  "453645.svg": { key: "logout", depicts: "Door with exit arrow" },
  "463546.svg": { key: "checkCircle", depicts: "Green check in circle" },
  "473447.svg": { key: "camera", depicts: "Camera" },
  "483348.svg": { key: "caretDown", depicts: "Solid caret / triangle down" },
  "493249.svg": { key: "more", depicts: "Vertical more (⋮) dots" },
  "503150.svg": { key: "edit", depicts: "Pencil edit with underline" },
  "513051.svg": { key: "trash", depicts: "Trash can (mono delete)" },
  "522952.svg": { key: "calendarPink", depicts: "Pink calendar date grid" },
  "532853.svg": { key: "video", depicts: "Video camera (blue)" },
  "542754.svg": { key: "homePink", depicts: "House with chimney (pink)" },
  "552655.svg": { key: "offers", depicts: "Purple scalloped % badge" },
  "562556.svg": { key: "building", depicts: "Hospital / clinic building" },
  "572457.svg": { key: "videoPurple", depicts: "Video camera (purple)" },
  "582358.svg": { key: "homePinkAlt", depicts: "House with chimney (pink alt)" },
  "592259.svg": { key: "minus", depicts: "Minus / subtract" },
  "602160.svg": { key: "plus", depicts: "Plus / add" },
  "612061.svg": { key: "closeCircle", depicts: "Close X in circle" },
  "621962.svg": { key: "check", depicts: "Check on green rounded square" },
  "631863.svg": { key: "moreSm", depicts: "Vertical more dots (small)" },
  "641764.svg": { key: "eyeSm", depicts: "Eye / visibility (small)" },
  "651665.svg": { key: "editSm", depicts: "Pencil edit (small)" },
  "661566.svg": { key: "trashRedAlt", depicts: "Trash can red (dup of 047704)" },
  "671467.svg": { key: "play", depicts: "Play triangle in circle" },
  "681368.svg": { key: "starFilled", depicts: "Filled orange star" },
  "691269.svg": { key: "starFilledSm", depicts: "Filled orange star (small)" },
  "701170.svg": { key: "chatDots", depicts: "Chat bubble with 3 dots (mono)" },
  "711071.svg": { key: "like", depicts: "Thumbs up / like" },
  "720972.svg": { key: "chevronRight", depicts: "Chevron right" },
  "730873.svg": { key: "upload", depicts: "Upload arrow up" },
  "740774.svg": { key: "search", depicts: "Magnifying glass / search" },
  "750675.svg": { key: "phoneDark", depicts: "Phone handset + waves (dark)" },
  "760576.svg": { key: "phoneBlue", depicts: "Phone handset + waves (blue grad)" },
  "770477.svg": { key: "doubleCheck", depicts: "Double checkmark / delivered" },
  "780378.svg": { key: "mic", depicts: "Microphone" },
  "790279.svg": { key: "plusLg", depicts: "Plus / add (large)" },
  "800180.svg": { key: "copy", depicts: "Overlapping pages / copy" },
};

/** Named public duplicates of pack glyphs (same visual; optional aliases) */
export const PROVIDER_NAMED_DUPLICATES = {
  home: "/icons/nav/12.svg",
  chats: "/icons/Chats.svg",
  schedule: "/icons/nav/14.svg",
  serviceDetails: "/icons/profile/03.svg",
  uploadMedia: "/icons/profile/05.svg",
  ratings: "/icons/profile/07.svg",
  logout: "/icons/profile/09.svg",
  bell: "/icons/profile/10.svg",
  edit: "/icons/edit.svg",
  homeOutline: "/icons/House.svg",
};

/** Marketplace provider-type glyphs (from supplied icon set) */
export const PROVIDER_TYPE_ICONS = {
  fitness: "/icons/provider/categories/icon-01.png",
  salon: "/icons/provider/categories/icon-02.png",
  clinic: "/icons/provider/categories/icon-03.png",
  staff: "/icons/provider/categories/icon-04.png",
  pet: "/icons/provider/categories/icon-05.png",
  homecare: "/icons/provider/categories/icon-06.png",
  auto: "/icons/provider/categories/icon-07.png",
  handyman: "/icons/provider/categories/icon-08.png",
  pediatrics: "/icons/provider/categories/icon-09.png",
  wellness: "/icons/provider/categories/icon-10.png",
  cooking: "/icons/provider/categories/icon-11.png",
  events: "/icons/provider/categories/icon-12.png",
  media: "/icons/provider/categories/icon-13.png",
  painting: "/icons/provider/categories/icon-14.png",
  carpentry: "/icons/provider/categories/icon-15.png",
};

/** Medical specialty tiles (Frame 401 set) */
export const PROVIDER_SPECIALTY_ICONS = {
  diabetes: "/icons/provider/categories/icon-frame401-1.png",
  eye: "/icons/provider/categories/icon-frame401-2.png",
  general: "/icons/provider/categories/icon-frame401-3.png",
  cardiology: "/icons/provider/categories/icon-frame401-4.png",
  pulmonology: "/icons/provider/categories/icon-frame401-5.png",
  orthopedics: "/icons/provider/categories/icon-frame401-6.png",
  neurology: "/icons/provider/categories/icon-frame401-7.png",
  dental: "/icons/provider/categories/icon-frame401-8.png",
};

/** Bottom-nav keys only */
export const PROVIDER_BOTTOM_NAV_ICONS = {
  home: PROVIDER_ICONS.home,
  chats: PROVIDER_ICONS.chats,
  schedule: PROVIDER_ICONS.schedule,
  earnings: PROVIDER_ICONS.earnings,
  settings: PROVIDER_ICONS.settings,
};

/** Settings list keys — Business Info + Operations + More + sign-out/edit */
export const PROVIDER_SETTINGS_ICONS = {
  serviceDetails: PROVIDER_ICONS.serviceDetails,
  uploadMedia: PROVIDER_ICONS.uploadMedia,
  slots: PROVIDER_ICONS.slots,
  category: PROVIDER_ICONS.category,
  packages: PROVIDER_ICONS.packages,
  ratings: PROVIDER_ICONS.ratings,
  document: PROVIDER_ICONS.document,
  building: PROVIDER_ICONS.building,
  analytics: PROVIDER_ICONS.analytics,
  language: PROVIDER_ICONS.language,
  logout: PROVIDER_ICONS.logout,
  edit: PROVIDER_ICONS.edit,
};

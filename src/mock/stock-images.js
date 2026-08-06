const UNSPLASH = "https://images.unsplash.com";

function hashSeed(seed) {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick(list, seed) {
  return list[hashSeed(seed) % list.length];
}

function photo(id, width, height, options = {}) {
  const params = new URLSearchParams({
    auto: "format",
    fit: options.fit || "crop",
    w: String(width),
    q: "80",
  });

  if (height) params.set("h", String(height));
  if (options.crop) params.set("crop", options.crop);

  return `${UNSPLASH}/${id}?${params.toString()}`;
}

const DOCTOR_LISTING_AVATARS = [
  "photo-1612349317150-e413f6a5b16d",
  "photo-1594824476967-e122a1e783bd",
  "photo-1622253692010-333f2da6031d",
  "photo-1559839734-2b71ea1976de",
  "photo-1582750433449-648ed127bb54",
  "photo-1573496395897-6be8794b18c8",
  "photo-1537367349846-4b4b871344b4",
  "photo-1516549656389-dc8493602453",
  "photo-1576091160399-112ba8d25d1d",
  "photo-1631217864550-67249d2784ae",
  "photo-1584982752971-d5f910159276",
  "photo-1651008376811-b90ae639eb10",
];

const AVATARS = [
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1494790108377-be9c29b29330",
  "photo-1500648767791-00dcc994a43e",
  "photo-1438761681033-6461ffad8d80",
  "photo-1472099645785-5658abf4ff4e",
  "photo-1534528741775-53994a69daeb",
  "photo-1517841905240-472988babdf9",
  "photo-1524504388940-b1c1722653e1",
  "photo-1539571696357-5a69c17a67c6",
  "photo-1544005313-94ddf0286df2",
  "photo-1560250097-0b93528c311a",
  "photo-1573496359142-b8d87734a5a2",
  "photo-1580489944761-15a19d654956",
  "photo-1595152772835-2197741742d8",
  "photo-1607746882042-944635dfe10e",
  "photo-1619895862022-09118b41cb16",
  "photo-1628157588553-70ee285b72c8",
  "photo-1633332755198-658a6317f9d9",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1463453091185-91306f0a0b0a",
];

const COVERS = [
  "photo-1560066984-138d8554da03",
  "photo-1521590832169-1f68ed765d97",
  "photo-1544161515-4ab6ce7db7f9",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1581578731548-8664d445eca2",
  "photo-1600880292203-757bb62b4baf",
  "photo-1556742049-0cfed4f6a45d",
  "photo-1497366216548-37526070297c",
  "photo-1519494026892-80bbd2d6fd0d",
  "photo-1631049307264-da0ec9d70304",
  "photo-1629909613654-28e377c37b09",
  "photo-1515377905703-c4788e51af15",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1615874959472-a9df9803c5d8",
  "photo-1560448204-e02f11c3d0e2",
  "photo-1616594039964-40817a8a6930",
];

const CATEGORY_IMAGES = [
  "photo-1522337360788-8b13dee7a37e",
  "photo-1544161515-4ab6ce7db7f9",
  "photo-1629909613654-28e377c37b09",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1544367567-0f2fcb009e0b",
  "photo-1581578731548-8664d445eca2",
  "photo-1607472586893-edb57bdc0e39",
  "photo-1621905251189-08b45d6a269e",
  "photo-1631545806609-65a00f30919d",
  "photo-1558618666-fcd25c85cd64",
  "photo-1487412940907-5a7ac893a4e6",
  "photo-1604654894610-df63bc536371",
  "photo-1576091160399-112ba8d25d1d",
  "photo-1490645935967-10de89ba44a6",
  "photo-1516734212186-a967ffa81f19",
  "photo-1506905925346-21bda4d32df4",
  "photo-1618221195710-dd6b41fa6046",
  "photo-1452587925148-ce544e77ee70",
  "photo-1434030216411-0b793f4b4173",
  "photo-1554224155-6726b3ff858f",
  "photo-1521791136064-7986c2920216",
  "photo-1556911220-e15b29be8c8f",
  "photo-1555244162-803834f70033",
  "photo-1594938298603-c8148c4dae35",
  "photo-1416879595882-3373a0480b5b",
  "photo-1585320806290-9795b0003b93",
  "photo-1562259949-e8e7689d7828",
  "photo-1504148455328-c376907a0066",
  "photo-1581094790869-fb7644c7074a",
  "photo-1511707171634-597697263b02",
];

const SERVICE_IMAGES = CATEGORY_IMAGES;

const BANNER_IMAGES = [
  "photo-1600880292203-757bb62b4baf",
  "photo-1556742049-0cfed4f6a45d",
  "photo-1556745757-8d76dbeb3443",
  "photo-1544161515-4ab6ce7db7f9",
  "photo-1581578731548-8664d445eca2",
  "photo-1522202176988-66273c2fd55f",
  "photo-1558618666-fcd25c85cd64",
  "photo-1560066984-138d8554da03",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1497366216548-37526070297c",
];

const PACKAGE_IMAGES = [
  "photo-1540555700478-4be289fbecef",
  "photo-1600334089648-b0d9d3028eb2",
  "photo-1515377905703-c4788e51af15",
  "photo-1544161515-4ab6ce7db7f9",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1560066984-138d8554da03",
  "photo-1616594039964-40817a8a6930",
  "photo-1600607687939-ce8a6c25118c",
];

const POST_IMAGES = [
  "photo-1522337360788-8b13dee7a37e",
  "photo-1515377905703-c4788e51af15",
  "photo-1560066984-138d8554da03",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1581578731548-8664d445eca2",
  "photo-1607746882042-944635dfe10e",
  "photo-1615874959472-a9df9803c5d8",
  "photo-1629909613654-28e377c37b09",
];

const REEL_IMAGES = [
  "photo-1594736797933-d0cbc0a04627",
  "photo-1560066984-138d8554da03",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1544161515-4ab6ce7db7f9",
  "photo-1515377905703-c4788e51af15",
  "photo-1581578731548-8664d445eca2",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1616594039964-40817a8a6930",
];

const GALLERY_IMAGES = [
  "photo-1560066984-138d8554da03",
  "photo-1521590832169-1f68ed765d97",
  "photo-1515377905703-c4788e51af15",
  "photo-1544161515-4ab6ce7db7f9",
  "photo-1571019614242-c5c5dee9f50e",
  "photo-1581578731548-8664d445eca2",
  "photo-1615874959472-a9df9803c5d8",
  "photo-1629909613654-28e377c37b09",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1616594039964-40817a8a6930",
];

const POPULAR_IMAGES = {
  "popular-haircut": "photo-1622286342626-9aa386937e04",
  "popular-massage": "photo-1544161515-4ab6ce7db7f9",
  "popular-dental": "photo-1606811841689-174aee548b54",
  "popular-fitness": "photo-1571019614242-c5c5dee9f50e",
};

function resolveImageId(seed, width, height) {
  const key = String(seed);

  if (POPULAR_IMAGES[key]) return POPULAR_IMAGES[key];
  if (key.startsWith("banner-")) return pick(BANNER_IMAGES, key);
  if (key.startsWith("cat-")) return pick(CATEGORY_IMAGES, key);
  if (key.startsWith("svc-")) return pick(SERVICE_IMAGES, key);
  if (key.startsWith("pkg-")) return pick(PACKAGE_IMAGES, key);
  if (key.startsWith("post-")) return pick(POST_IMAGES, key);
  if (key.startsWith("reel-")) return pick(REEL_IMAGES, key);
  if (key.startsWith("gallery-")) return pick(GALLERY_IMAGES, key);
  if (key.startsWith("cover-")) return pick(COVERS, key);

  return pick(GALLERY_IMAGES, key);
}

export function avatarUrl(seed) {
  return photo(pick(AVATARS, seed), 256, 256, { crop: "faces" });
}

export function doctorListingAvatarUrl(index) {
  const id = DOCTOR_LISTING_AVATARS[index % DOCTOR_LISTING_AVATARS.length];
  return photo(id, 400, 400, { crop: "faces" });
}

export function coverUrl(seed, width = 1200, height = 400) {
  return photo(resolveImageId(`cover-${seed}`, width, height), width, height);
}

export function imageUrl(seed, width = 400, height = 300) {
  const key = String(seed);
  const isPortrait = key.startsWith("reel-");
  const id = resolveImageId(key, width, height);

  if (isPortrait) {
    return photo(id, width, height, { fit: "crop" });
  }

  return photo(id, width, height);
}

export function selfVideoUrl() {
  return photo("photo-1507003211169-0a1dd7228f2d", 400, 600, { crop: "faces" });
}

export function buildReelShareUrl(providerId, reelId) {
  if (typeof window === "undefined" || !providerId) return "";

  const url = new URL(`/providers/${providerId}`, window.location.origin);
  if (reelId) url.searchParams.set("reel", reelId);
  return url.toString();
}

export function buildReelShareText(reel, provider) {
  const title = reel?.title || reel?.caption || "Check out this reel on Bookento";
  const handle = reel?.handle || provider?.businessName || provider?.name || "";

  if (!handle) return title;
  const normalizedHandle = handle.startsWith("@") ? handle : `@${handle}`;
  return `${title} — ${normalizedHandle}`;
}

export async function copyToClipboard(text) {
  if (!text) return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to legacy copy.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export function openShareWindow(url) {
  const popup = window.open(url, "_blank", "noopener,noreferrer,width=640,height=720");
  if (!popup) window.location.href = url;
}

export async function shareWithNativeShare({ title, text, url }) {
  if (!navigator.share) return "unsupported";

  try {
    await navigator.share({ title, text, url });
    return "shared";
  } catch (error) {
    if (error?.name === "AbortError") return "cancelled";
    return "failed";
  }
}

export async function sharePageLink({
  title,
  text,
  url = typeof window !== "undefined" ? window.location.href : "",
  preferClipboard = false,
}) {
  if (!url) return "failed";

  // Desktop browsers often expose navigator.share but consume the user gesture,
  // so clipboard fallback fails. Prefer copy when requested (e.g. web layouts).
  if (!preferClipboard) {
    const nativeResult = await shareWithNativeShare({ title, text, url });
    if (nativeResult === "shared" || nativeResult === "cancelled") {
      return nativeResult;
    }
  }

  const copied = await copyToClipboard(url);
  return copied ? "copied" : "failed";
}

export function getPlatformShareUrl(platform, { url, text }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case "messenger":
      return `https://www.facebook.com/dialog/send?link=${encodedUrl}&redirect_uri=${encodedUrl}&display=popup`;
    case "instagram":
      return null;
    default:
      return null;
  }
}

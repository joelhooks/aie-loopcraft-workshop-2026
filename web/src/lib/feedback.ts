import { browser } from "$app/environment";

export const feedbackStoragePrefix = "aie-loopcraft-workshop-2026-feedback:";

export function isFeedbackEnabled(url: URL) {
  if (!browser) return false;
  return url.searchParams.get("feedback") === "1";
}

export function withFeedback(href: string, enabled: boolean) {
  if (!enabled || !href.startsWith("/")) return href;
  const [beforeHash, hash] = href.split("#", 2);
  const separator = beforeHash.includes("?") ? "&" : "?";
  return `${beforeHash}${separator}feedback=1${hash ? `#${hash}` : ""}`;
}

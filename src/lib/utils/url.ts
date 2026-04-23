const BLOCKED_PROTOCOLS = ["javascript:", "data:", "vbscript:", "file:"];

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();

  for (const protocol of BLOCKED_PROTOCOLS) {
    if (trimmed.toLowerCase().startsWith(protocol)) {
      return null;
    }
  }

  if (!isValidUrl(trimmed)) return null;

  return trimmed;
}

export function buildShortUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/r/${slug}`;
}

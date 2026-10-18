const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
const STORAGE_KEY = "ooo_booking_campaign_v1";

type CampaignKey = (typeof CAMPAIGN_KEYS)[number];
export type CampaignAttribution = Partial<Record<CampaignKey, string>> & { landing_path?: string };

export function parseCampaignAttribution(search: string, pathname: string): CampaignAttribution {
  const params = new URLSearchParams(search);
  const campaign: CampaignAttribution = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key)?.trim().slice(0, 120);
    if (value) campaign[key] = value;
  }
  if (pathname.startsWith("/")) campaign.landing_path = pathname.slice(0, 300);
  return campaign;
}

/** Keep first campaign labels for this tab; never store the full URL or query. */
export function captureCampaignAttribution(): CampaignAttribution {
  if (typeof window === "undefined") return {};
  const current = parseCampaignAttribution(window.location.search, window.location.pathname);
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: unknown = JSON.parse(raw);
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        const clean: CampaignAttribution = {};
        for (const key of CAMPAIGN_KEYS) {
          const value = (saved as Record<string, unknown>)[key];
          if (typeof value === "string" && value.trim()) clean[key] = value.trim().slice(0, 120);
        }
        const path = (saved as Record<string, unknown>).landing_path;
        if (typeof path === "string" && path.startsWith("/"))
          clean.landing_path = path.slice(0, 300);
        if (CAMPAIGN_KEYS.some((key) => clean[key])) return clean;
      }
    }
    if (CAMPAIGN_KEYS.some((key) => current[key])) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
  } catch {
    // Restricted storage must not prevent an evaluation request.
  }
  return current;
}

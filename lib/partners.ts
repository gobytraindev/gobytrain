// lib/partners.ts

export type Partner = "omio" | "raileurope";

export type PartnerInput = {
  from: string;
  to: string;
  date?: string;      // yyyy-mm-dd
  adults?: number;    // default 1
  currency?: string;  // default EUR
  price?: string;     // "€123" (frivilligt)
};

function slug(s: string) {
  return (s || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function yyyymmdd(d?: string) {
  if (!d) return "";
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

/**
 * Byt ut placeholder-affiliate-taggar när du har riktiga ID:n:
 *  - Omio:  lägg in din partner slug (ex: ?utm_source=aff&utm_medium=partner&utm_campaign=XXXXX)
 *  - RailEurope: lägg in affiliateId som query
 */
export function buildPartnerUrl(
  partner: Partner,
  input: PartnerInput
): string {
  const from = input.from?.trim() || "";
  const to = input.to?.trim() || "";
  const date = yyyymmdd(input.date) || "";
  const adults = input.adults && input.adults > 0 ? input.adults : 1;
  const currency = input.currency || "EUR";

  if (!from || !to) return "";

  if (partner === "omio") {
    // Omio – enkel sök-URL (placeholder UTM)
    const q = new URLSearchParams({
      q: `${from} to ${to}`,
      adults: String(adults),
      currency,
      ...(date ? { date } : {}),
      utm_source: "gobytrain",
      utm_medium: "affiliate",
      utm_campaign: "placeholder",
    });
    return `https://www.omio.com/travel-search?${q.toString()}`;
  }

  if (partner === "raileurope") {
    // Rail Europe – enkel sök-URL (placeholder affiliateId)
    const q = new URLSearchParams({
      from: from,
      to: to,
      passengers: String(adults),
      ...(date ? { date } : {}),
      currency,
      affiliateId: "gobytrain-placeholder",
    });
    return `https://www.raileurope.com/en/search?${q.toString()}`;
  }

  return "";
}
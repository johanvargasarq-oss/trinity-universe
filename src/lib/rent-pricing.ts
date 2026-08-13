import type { Property } from "./db/properties";

/** Effective price for one specific night: the season whose [from,to) contains the date, else the base price. */
export function getPriceForDate(property: Property, date: string): number {
  const season = property.pricing.seasons.find((s) => date >= s.from && date < s.to);
  return season ? season.price : property.pricing.basePrice;
}

/** Sums the per-night effective price across a stay (the checkOut night itself is not charged). */
export function getStayTotal(property: Property, checkIn: string, checkOut: string): number {
  let total = 0;
  const cursor = new Date(checkIn + "T00:00:00Z");
  const end = new Date(checkOut + "T00:00:00Z");
  while (cursor < end) {
    total += getPriceForDate(property, cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return total;
}

export function rangesOverlap(aFrom: string, aTo: string, bFrom: string, bTo: string): boolean {
  return aFrom < bTo && aTo > bFrom;
}

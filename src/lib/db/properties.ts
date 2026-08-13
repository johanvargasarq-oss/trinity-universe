import { hashGetAll, hashSet } from "./redis-client";

const HASH_KEY = "trinity:rent-properties";

export type PropertyType = "house" | "apartment";
export type PropertyStatus = "activa" | "inactiva";

export interface PropertySeason {
  id: string;
  label: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  price: number;
}

export interface PropertyImage {
  url: string;
  alt: string;
}

export interface PropertyVideo {
  url: string;
  label?: string;
}

export interface PropertyBlockedRange {
  id: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  reason?: string;
}

export interface Property {
  id: string;
  type: PropertyType;
  slug: string;
  name: string;
  description: string;
  order: number;
  status: PropertyStatus;
  capacity: { maxGuests: number; maxAdults: number; maxChildren: number };
  rooms: { bedrooms: number; beds: number; bathrooms: number };
  amenities: string[];
  pricing: { basePrice: number; seasons: PropertySeason[] };
  media: { images: PropertyImage[]; videos: PropertyVideo[] };
  location: { address: string; lat?: number; lng?: number; mapsUrl?: string };
  blockedRanges: PropertyBlockedRange[];
  createdAt: string;
  updatedAt: string;
}

export async function getAllProperties(): Promise<Property[]> {
  const all = await hashGetAll<Property>(HASH_KEY);
  return all.sort((a, b) => a.order - b.order);
}

export async function getProperty(id: string): Promise<Property | null> {
  const all = await getAllProperties();
  return all.find((p) => p.id === id) ?? null;
}

export async function saveProperty(property: Property): Promise<void> {
  await hashSet(HASH_KEY, property.id, property);
}

// Pure pricing/date-range helpers (no Redis dependency, safe to import from
// client components) live in "@/lib/rent-pricing" — re-exported here so
// existing server-side call sites don't need to change their import.
export { getPriceForDate, getStayTotal, rangesOverlap } from "@/lib/rent-pricing";

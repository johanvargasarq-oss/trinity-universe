import type { Property } from "./properties";

/**
 * Provisional catalog for Trini Beach Rental — content is placeholder
 * (reuses the two existing /media/rent images) until the client provides
 * real photos, prices and copy. Editable afterwards from /admin/rent
 * (each field maps 1:1 to the property editor form) or by changing this
 * file and re-running the seed endpoint.
 */

const PLACEHOLDER_IMAGES = [
  { url: "/media/rent/hero.png", alt: "Terraza frente al mar Trinity Rent" },
  { url: "/media/rent/experiencias.png", alt: "Atardecer Trinity Rent" },
];

const now = () => new Date().toISOString();

const triniHouse: Property = {
  id: "trini-house",
  type: "house",
  slug: "trini-house",
  name: "Trini House",
  description:
    "Casa completa frente al mar para grupos grandes: 6 habitaciones, piscina privada y zonas sociales pensadas para desconectar sin perder el estándar Trinity. Contenido y precios provisionales — se reemplazan cuando el cliente entregue el material definitivo.",
  order: 0,
  status: "activa",
  capacity: { maxGuests: 12, maxAdults: 10, maxChildren: 6 },
  rooms: { bedrooms: 6, beds: 8, bathrooms: 5 },
  amenities: [
    "Piscina privada",
    "WiFi de alta velocidad",
    "Parqueadero privado",
    "Aire acondicionado",
    "Cocina totalmente equipada",
    "Vista al mar",
    "Zona BBQ",
    "Seguridad 24h",
  ],
  pricing: { basePrice: 1800000, seasons: [] },
  media: { images: PLACEHOLDER_IMAGES, videos: [] },
  location: {
    address: "Santa Marta, Colombia (dirección provisional — pendiente de confirmar con el cliente)",
    mapsUrl: undefined,
  },
  blockedRanges: [],
  createdAt: now(),
  updatedAt: now(),
};

function buildApartment(n: number): Property {
  const id = `apt-${String(n).padStart(2, "0")}`;
  // Vary capacity/price across the 16 units so the grid doesn't look identical.
  const tier = n % 3; // 0: compact, 1: mid, 2: large
  const capacity = tier === 0 ? { maxGuests: 2, maxAdults: 2, maxChildren: 0 } : tier === 1 ? { maxGuests: 4, maxAdults: 3, maxChildren: 2 } : { maxGuests: 6, maxAdults: 4, maxChildren: 3 };
  const rooms = tier === 0 ? { bedrooms: 1, beds: 1, bathrooms: 1 } : tier === 1 ? { bedrooms: 2, beds: 2, bathrooms: 1 } : { bedrooms: 3, beds: 4, bathrooms: 2 };
  const basePrice = tier === 0 ? 150000 : tier === 1 ? 220000 : 320000;

  return {
    id,
    type: "apartment",
    slug: id,
    name: `Apartamento ${String(n).padStart(2, "0")}`,
    description: `Apartamento independiente en el edificio Trini Beach, a pasos del mar. Datos y fotos provisionales — se actualizan desde el panel admin cuando el cliente entregue el contenido real del Apartamento ${n}.`,
    order: n,
    status: "activa",
    capacity,
    rooms,
    amenities: ["WiFi", "Aire acondicionado", "Cocina equipada", "Balcón", "TV"],
    pricing: { basePrice, seasons: [] },
    media: { images: PLACEHOLDER_IMAGES, videos: [] },
    location: {
      address: "Edificio Trini Beach, Santa Marta, Colombia (dirección provisional)",
      mapsUrl: undefined,
    },
    blockedRanges: [],
    createdAt: now(),
    updatedAt: now(),
  };
}

export const SEED_PROPERTIES: Property[] = [triniHouse, ...Array.from({ length: 16 }, (_, i) => buildApartment(i + 1))];

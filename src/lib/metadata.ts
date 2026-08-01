import type { Metadata } from "next";
import type { WorldConfig } from "@/lib/brands";

export function buildWorldMetadata(world: WorldConfig): Metadata {
  return {
    title: world.name,
    description: world.description,
    openGraph: {
      title: world.name,
      description: world.description,
      images: [world.media.cardImage],
    },
  };
}

export function buildLocalBusinessJsonLd(world: WorldConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: world.name,
    telephone: world.contact.phone,
    openingHours: world.contact.hours,
    sameAs: [world.contact.instagram.url],
    address: world.contact.addresses?.map((a) => ({
      "@type": "PostalAddress",
      streetAddress: a.line,
      addressLocality: "Bucaramanga",
      addressCountry: "CO",
    })),
  };
}

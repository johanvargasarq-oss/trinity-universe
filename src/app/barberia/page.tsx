"use client";

import { worlds } from "@/lib/brands";
import { buildLocalBusinessJsonLd } from "@/lib/metadata";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import barberiaData from "@/data/barberia.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import WorldStory from "@/components/world/WorldStory";
import WorldServices from "@/components/world/WorldServices";
import WorldGallery from "@/components/world/WorldGallery";
import WorldMap from "@/components/world/WorldMap";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import BookingForm from "@/components/booking/BookingForm";
import BarberExperience from "@/components/barberia/BarberExperience";

const world = worlds.barberia;

const servicios = barberiaData.servicios.map((s) => ({
  title: s.nombre,
  description: s.descripcion,
  meta: `${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(s.precio)} · ${s.duracionMin} min`,
}));

const galeria = [
  { src: "/media/barberia/gallery-1.png", alt: "Corte fade en Trinity Barbería" },
  { src: "/media/barberia/gallery-2.png", alt: "Productos de grooming Trinity" },
  { src: "/media/barberia/hero.png", alt: "Interior Trinity Barbería" },
  { src: "/media/barberia/gallery-3.png", alt: "Fachada Trinity Barbería" },
  {
    src: "/media/barberia/gallery-video-2-poster.jpg",
    video: "/media/barberia/gallery-video-2.mp4",
    alt: "Antes y después de un corte en Trinity Barbería",
  },
  {
    src: "/media/barberia/gallery-video-1-poster.jpg",
    video: "/media/barberia/gallery-video-1.mp4",
    alt: "Ambiente en Trinity Barbería",
  },
];

export default function BarberiaPage() {
  useRevealWorld();
  const jsonLd = buildLocalBusinessJsonLd(world);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorldNav world={world} />
      <WorldHero world={world} />
      <WorldStory
        world={world}
        title="Más que un corte"
        paragraphs={[
          "Trinity Barbería nació para ofrecer una experiencia distinta en Bucaramanga: técnica precisa, ambiente premium y atención que se nota desde que cruzas la puerta.",
          "Cada sede mantiene el mismo estándar: buena luz, buena música y barberos que se toman su tiempo para que el resultado sea exactamente el que buscas.",
        ]}
        image="/media/barberia/gallery-3.png"
      />
      <WorldServices world={world} services={servicios} />
      <WorldGallery world={world} items={galeria} />
      <BarberExperience world={world} />

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-3">Agenda tu cita</h2>
          <p className="text-world-text-muted">
            Elige tu barbero, servicio, sede, fecha y hora. Confirmamos por WhatsApp al instante.
          </p>
        </div>
        <BookingForm
          world={world}
          whatsapp={barberiaData.whatsapp}
          staffLabel="barbero"
          staff={barberiaData.barberos}
          services={barberiaData.servicios}
          sedes={barberiaData.sedes}
          horasDisponibles={barberiaData.horasDisponibles}
        />
      </section>

      <WorldMap world={world} />
      <WorldContactBlock world={world} />
    </>
  );
}

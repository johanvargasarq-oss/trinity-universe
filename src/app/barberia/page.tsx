"use client";

import { worlds } from "@/lib/brands";
import { buildLocalBusinessJsonLd, buildFaqJsonLd } from "@/lib/metadata";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import barberiaData from "@/data/barberia.json";
import WorldHero from "@/components/world/WorldHero";
import WorldStory from "@/components/world/WorldStory";
import WorldServices from "@/components/world/WorldServices";
import WorldGallery from "@/components/world/WorldGallery";
import WorldFAQ from "@/components/world/WorldFAQ";
import WorldMap from "@/components/world/WorldMap";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import BookingForm from "@/components/booking/BookingForm";
import BarberExperience from "@/components/barberia/BarberExperience";

const world = worlds.barberia;

const servicios = barberiaData.servicios.map((s) => ({
  title: s.nombre,
  description: s.descripcion,
  meta: new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(s.precio),
}));

const galeria = [
  { src: "/media/barberia/gallery-4.jpg", alt: "Corte a degradado en Trinity Barbería" },
  { src: "/media/barberia/gallery-5.jpg", alt: "Mullet con diseño en Trinity Barbería" },
  { src: "/media/barberia/gallery-6.jpg", alt: "Diseño de líneas en el fade" },
  { src: "/media/barberia/gallery-7.jpg", alt: "Corte con diseño y mural Trinity" },
  { src: "/media/barberia/gallery-8.jpg", alt: "Mullet con tatuaje en el cuello" },
  { src: "/media/barberia/gallery-9.jpg", alt: "Mullet frente al mural Trinity" },
  { src: "/media/barberia/gallery-10.jpg", alt: "Corte con flequillo en Trinity Barbería" },
  { src: "/media/barberia/gallery-13.jpg", alt: "Diseño a mano alzada en Trinity Barbería" },
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

const faqs = [
  {
    question: "¿Cómo puedo reservar una cita en Trinity Barbería?",
    answer:
      "Puedes reservar tu cita directamente desde la página de Trinity Barbería. Selecciona el servicio que deseas, elige el día y horario disponible y completa los datos solicitados para confirmar tu reserva.",
  },
  {
    question: "¿Qué servicios ofrece Trinity Barbería?",
    answer:
      "Trinity Barbería ofrece diferentes servicios de barbería y cuidado masculino. En la sección de servicios puedes consultar las opciones disponibles, sus precios y la duración aproximada de cada servicio.",
  },
  {
    question: "¿Cuánto cuesta un corte de cabello en Trinity Barbería?",
    answer:
      "El precio depende del servicio que elijas. Consulta nuestra lista de servicios y precios actualizada directamente en la sección de Trinity Barbería.",
  },
  {
    question: "¿Necesito reservar una cita para ir a Trinity Barbería?",
    answer:
      "Recomendamos reservar una cita previamente para asegurar disponibilidad en el horario que prefieras. De esta manera puedes evitar esperas y garantizar tu espacio con el barbero.",
  },
  {
    question: "¿Puedo elegir el barbero con el que quiero atenderme?",
    answer:
      "Sí, si el sistema muestra diferentes barberos disponibles, puedes seleccionar el profesional de tu preferencia al momento de realizar la reserva.",
  },
  {
    question: "¿Cuánto dura aproximadamente una cita?",
    answer:
      "La duración depende del servicio seleccionado. Al momento de reservar podrás consultar la información correspondiente al servicio que deseas.",
  },
  {
    question: "¿Puedo cancelar o cambiar mi cita?",
    answer:
      "Sí. Si necesitas cancelar o modificar tu reserva, hazlo con anticipación utilizando los canales de contacto disponibles de Trinity Barbería.",
  },
  {
    question: "¿Qué pasa si llego tarde a mi cita?",
    answer:
      "Te recomendamos llegar unos minutos antes de tu horario reservado. Si llegas tarde, la atención puede verse afectada dependiendo de la disponibilidad del barbero y de las citas posteriores.",
  },
  {
    question: "¿Puedo reservar una cita para otra persona?",
    answer:
      "Sí. Puedes realizar una reserva para otra persona siempre que ingreses correctamente los datos solicitados durante el proceso de reserva.",
  },
  {
    question: "¿Dónde está ubicada Trinity Barbería?",
    answer:
      "Trinity Barbería está ubicada en Bucaramanga. Consulta la sección de ubicación de la página para conocer nuestra dirección exacta y cómo llegar.",
  },
  {
    question: "¿Trinity Barbería atiende sin cita previa?",
    answer:
      "La atención sin cita está sujeta a la disponibilidad del momento. Para garantizar tu espacio y evitar esperas, recomendamos realizar una reserva previamente.",
  },
  {
    question: "¿Cómo puedo contactar a Trinity Barbería?",
    answer: "Puedes comunicarte con Trinity Barbería utilizando los canales de contacto disponibles en nuestra página web.",
  },
];

export default function BarberiaPage() {
  useRevealWorld();
  const jsonLd = buildLocalBusinessJsonLd(world);
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <WorldHero world={world} />
      <WorldStory
        world={world}
        title="Más que un corte"
        paragraphs={[
          "Trinity Barbería nació para ofrecer una experiencia distinta en Bucaramanga: técnica precisa, ambiente premium y atención que se nota desde que cruzas la puerta.",
          "Cada sede mantiene el mismo estándar: buena luz, buena música y barberos que se toman su tiempo para que el resultado sea exactamente el que buscas.",
        ]}
        image="/media/barberia/gallery-3.jpg"
      />
      <WorldServices
        world={world}
        services={servicios}
        title="Todo lo que hacemos mejor"
        subtitle="Elige el servicio y reserva directamente por WhatsApp."
        video="/media/barberia/services-video.mp4"
      />
      <WorldGallery world={world} items={galeria} />
      <BarberExperience world={world} />

      <section id="reservas" className="relative py-24 px-5 sm:px-10 bg-world-bg-alt scroll-mt-20">
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

      <WorldFAQ
        world={world}
        items={faqs}
        title="Preguntas frecuentes"
        subtitle="Todo lo que necesitas saber antes de tu cita en Trinity Barbería."
      />
    </>
  );
}

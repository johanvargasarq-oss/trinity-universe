import type { Reservation } from "@/lib/db/reservations";
import type { Property } from "@/lib/db/properties";
import type { NotificationResult } from "./email";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/**
 * Sends the reservation-confirmed WhatsApp message via WhatsApp Business
 * Cloud API (Meta) — plain fetch to the Graph API, no SDK. Requires
 * WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID and an approved message
 * template (WHATSAPP_TEMPLATE_NAME) in the environment. Without those, this
 * intentionally does nothing but open WhatsApp manually is NOT a substitute
 * for this — it stays a documented gap until the credentials exist. Never
 * throws: the reservation must survive a failed notification.
 */
export async function sendReservationConfirmationWhatsapp(
  reservation: Reservation,
  property: Property
): Promise<NotificationResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  if (!token || !phoneNumberId || !templateName) {
    return {
      status: "error",
      reason: "WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_TEMPLATE_NAME no configuradas",
    };
  }

  const guests = reservation.adultos + reservation.ninos + reservation.bebes;
  const bodyParams = [
    reservation.codigo,
    property.name,
    reservation.checkIn,
    reservation.checkOut,
    String(guests),
    currency.format(reservation.total),
  ];

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: reservation.huesped.celular,
        type: "template",
        template: {
          name: templateName,
          language: { code: "es_CO" },
          components: [{ type: "body", parameters: bodyParams.map((text) => ({ type: "text", text })) }],
        },
      }),
    });
    if (!res.ok) {
      return { status: "error", reason: `WhatsApp Cloud API respondió ${res.status}` };
    }
    return { status: "enviado" };
  } catch (e) {
    return { status: "error", reason: (e as Error).message };
  }
}

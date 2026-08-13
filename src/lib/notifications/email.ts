import type { Reservation } from "@/lib/db/reservations";
import type { Property } from "@/lib/db/properties";

export interface NotificationResult {
  status: "enviado" | "error";
  reason?: string;
}

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

/**
 * Sends the reservation-confirmed email via Resend's REST API (no SDK — one
 * fetch call, nothing to install). Requires RESEND_API_KEY and
 * RESEND_FROM_EMAIL in the environment (Vercel → Project → Settings →
 * Environment Variables). Never throws: a missing/failing notification must
 * not roll back or lose the reservation, so callers just record the result.
 */
export async function sendReservationConfirmationEmail(
  reservation: Reservation,
  property: Property
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return { status: "error", reason: "RESEND_API_KEY / RESEND_FROM_EMAIL no configuradas" };
  }

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>TRINITY BEACH RENTAL</h2>
      <p><strong>Reserva confirmada</strong></p>
      <p>Código: <strong>${reservation.codigo}</strong></p>
      <p>Propiedad: ${property.name}</p>
      <p>Entrada: ${reservation.checkIn}</p>
      <p>Salida: ${reservation.checkOut}</p>
      <p>Huéspedes: ${reservation.adultos + reservation.ninos + reservation.bebes}</p>
      <p>Total: ${currency.format(reservation.total)}</p>
      <p>Dirección: ${property.location.address}</p>
      <p>Cualquier duda, escríbenos por WhatsApp — gracias por reservar con Trinity.</p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: fromEmail,
        to: reservation.huesped.correo,
        subject: `Reserva confirmada — ${reservation.codigo}`,
        html,
      }),
    });
    if (!res.ok) {
      return { status: "error", reason: `Resend respondió ${res.status}` };
    }
    return { status: "enviado" };
  } catch (e) {
    return { status: "error", reason: (e as Error).message };
  }
}

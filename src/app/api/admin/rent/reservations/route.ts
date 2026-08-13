import { NextRequest, NextResponse } from "next/server";
import { getAllReservations, saveReservation, deleteReservation, type ReservationEstado } from "@/lib/db/reservations";
import { getProperty } from "@/lib/db/properties";
import { rangesOverlap } from "@/lib/db/properties";
import { checkAdminAuth } from "@/lib/admin-auth-server";
import { sendReservationConfirmationEmail } from "@/lib/notifications/email";
import { sendReservationConfirmationWhatsapp } from "@/lib/notifications/whatsapp";

const VALID_ESTADOS: ReservationEstado[] = ["pendiente", "confirmada", "rechazada", "cancelada", "finalizada"];

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const all = await getAllReservations();
    all.sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1));
    return NextResponse.json({ reservations: all }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  const body = await req.json();
  if (!checkAdminAuth(req, body?.pass)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const { id, accion, estado } = body || {};
    if (!id || !accion) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    if (accion === "eliminar") {
      await deleteReservation(id);
      return NextResponse.json({ ok: true });
    }
    if (accion === "cambiarEstado") {
      if (!VALID_ESTADOS.includes(estado)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      const all = await getAllReservations();
      const reservation = all.find((r) => r.id === id);
      if (!reservation) {
        return NextResponse.json({ error: "No existe esa reserva" }, { status: 404 });
      }

      if (estado === "confirmada") {
        const conflict = all.some(
          (r) =>
            r.id !== reservation.id &&
            r.propertyId === reservation.propertyId &&
            r.estado === "confirmada" &&
            rangesOverlap(r.checkIn, r.checkOut, reservation.checkIn, reservation.checkOut)
        );
        if (conflict) {
          return NextResponse.json(
            { error: "Ya existe otra reserva confirmada en fechas que se cruzan para esta propiedad" },
            { status: 409 }
          );
        }
      }

      reservation.estado = estado;
      reservation.actualizadoEn = new Date().toISOString();
      await saveReservation(reservation);

      if (estado === "confirmada") {
        const property = await getProperty(reservation.propertyId);
        if (property) {
          reservation.notificacion.email = "enviando";
          reservation.notificacion.whatsapp = "enviando";
          await saveReservation(reservation);

          const [emailResult, whatsappResult] = await Promise.all([
            sendReservationConfirmationEmail(reservation, property),
            sendReservationConfirmationWhatsapp(reservation, property),
          ]);
          reservation.notificacion.email = emailResult.status;
          reservation.notificacion.whatsapp = whatsappResult.status;
          reservation.notificacion.error = [emailResult.reason, whatsappResult.reason].filter(Boolean).join(" · ") || undefined;
          await saveReservation(reservation);
        }
      }

      return NextResponse.json({ ok: true, reservation });
    }
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

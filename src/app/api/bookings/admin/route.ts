import { NextRequest, NextResponse } from "next/server";
import { getAllBookings, saveBooking, deleteBooking } from "@/lib/redis";

function checkAuth(req: NextRequest, bodyPass?: string) {
  const headerPass = req.headers.get("x-admin-pass");
  const queryPass = new URL(req.url).searchParams.get("pass");
  const pass = headerPass || bodyPass || queryPass;
  return Boolean(pass) && pass === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const all = await getAllBookings();
    all.sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1));
    return NextResponse.json({ bookings: all }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  const body = await req.json();
  if (!checkAuth(req, body?.pass)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const { id, accion } = body || {};
    if (!id || !accion) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    if (accion === "eliminar") {
      await deleteBooking(id);
      return NextResponse.json({ ok: true });
    }
    if (accion === "confirmar") {
      const all = await getAllBookings();
      const booking = all.find((b) => b.id === id);
      if (!booking) {
        return NextResponse.json({ error: "No existe esa reserva" }, { status: 404 });
      }
      booking.estado = "confirmada";
      booking.confirmadoEn = new Date().toISOString();
      await saveBooking(booking);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

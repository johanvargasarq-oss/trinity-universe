import { NextRequest, NextResponse } from "next/server";
import { saveBooking, type Booking } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { worldId, nombre, telefono, servicio, staff, sede, fecha, hora } = body || {};
    if (!worldId || !nombre || !telefono || !servicio || !staff || !sede || !fecha || !hora) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const booking: Booking = {
      id,
      worldId,
      nombre,
      telefono,
      servicio,
      staff,
      sede,
      fecha,
      hora,
      estado: "pendiente",
      creadoEn: new Date().toISOString(),
    };
    await saveBooking(booking);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

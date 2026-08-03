import { NextRequest, NextResponse } from "next/server";
import { saveOrder, type Order, type OrderWorldId } from "@/lib/db/orders";

const VALID_WORLDS: OrderWorldId[] = ["fries", "arepas", "slush"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { worldId, lines, notes, total, clienteNombre, clienteTelefono } = body || {};
    if (!VALID_WORLDS.includes(worldId) || !Array.isArray(lines) || lines.length === 0 || typeof total !== "number") {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const order: Order = {
      id,
      worldId,
      lines,
      notes: notes || "",
      total,
      clienteNombre: clienteNombre || undefined,
      clienteTelefono: clienteTelefono || undefined,
      estado: "pendiente",
      creadoEn: new Date().toISOString(),
    };
    await saveOrder(order);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

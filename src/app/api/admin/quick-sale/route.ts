import { NextRequest, NextResponse } from "next/server";
import { saveOrder, type Order, type OrderWorldId } from "@/lib/db/orders";
import { checkAdminAuth } from "@/lib/admin-auth-server";

const VALID_WORLDS: OrderWorldId[] = ["fries", "arepas", "slush"];

/**
 * Lets staff log an in-person, already-paid sale from their phone so it
 * shows up in the owner's admin totals alongside WhatsApp orders. Unlike
 * /api/orders, this is admin-password gated and the order is created
 * already "entregado" — there's nothing to prepare, the customer already
 * has it in hand.
 */
export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  const body = await req.json();
  if (!checkAdminAuth(req, body?.pass)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const { worldId, lines, notes } = body || {};
    if (!VALID_WORLDS.includes(worldId) || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }
    const total = lines.reduce((s: number, l: { unitPrice: number; quantity: number }) => s + l.unitPrice * l.quantity, 0);
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const order: Order = {
      id,
      worldId,
      lines,
      notes: notes || "",
      total,
      estado: "entregado",
      canal: "mostrador",
      creadoEn: new Date().toISOString(),
    };
    await saveOrder(order);
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

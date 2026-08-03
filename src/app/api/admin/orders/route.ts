import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, saveOrder, deleteOrder, type OrderEstado } from "@/lib/db/orders";
import { checkAdminAuth } from "@/lib/admin-auth-server";

const VALID_ESTADOS: OrderEstado[] = ["pendiente", "preparando", "listo", "entregado", "cancelado"];

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const worldId = new URL(req.url).searchParams.get("worldId");
    let all = await getAllOrders();
    if (worldId) all = all.filter((o) => o.worldId === worldId);
    all.sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1));
    return NextResponse.json({ orders: all }, { headers: { "Cache-Control": "no-store" } });
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
      await deleteOrder(id);
      return NextResponse.json({ ok: true });
    }
    if (accion === "cambiarEstado") {
      if (!VALID_ESTADOS.includes(estado)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      const all = await getAllOrders();
      const order = all.find((o) => o.id === id);
      if (!order) {
        return NextResponse.json({ error: "No existe ese pedido" }, { status: 404 });
      }
      order.estado = estado;
      order.actualizadoEn = new Date().toISOString();
      await saveOrder(order);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

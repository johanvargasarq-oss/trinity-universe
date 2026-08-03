import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db/orders";
import { getAllBookings } from "@/lib/db/bookings";
import { checkAdminAuth } from "@/lib/admin-auth-server";

function isToday(iso: string) {
  return iso.slice(0, 10) === new Date().toISOString().slice(0, 10);
}

function isThisMonth(iso: string) {
  return iso.slice(0, 7) === new Date().toISOString().slice(0, 7);
}

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }

  try {
    const [orders, bookings] = await Promise.all([getAllOrders(), getAllBookings()]);

    const ordersToday = orders.filter((o) => isToday(o.creadoEn));
    const bookingsToday = bookings.filter((b) => isToday(b.creadoEn));
    const bookingsForToday = bookings.filter((b) => b.fecha === new Date().toISOString().slice(0, 10));

    const ventasHoy =
      ordersToday.filter((o) => o.estado !== "cancelado").reduce((s, o) => s + o.total, 0) +
      bookingsToday.filter((b) => b.estado !== "cancelada").reduce((s, b) => s + b.total, 0);

    const ventasMes =
      orders.filter((o) => isThisMonth(o.creadoEn) && o.estado !== "cancelado").reduce((s, o) => s + o.total, 0) +
      bookings.filter((b) => isThisMonth(b.creadoEn) && b.estado !== "cancelada").reduce((s, b) => s + b.total, 0);

    const pedidosPendientes = orders.filter((o) => o.estado === "pendiente" || o.estado === "preparando" || o.estado === "listo").length;
    const pedidosEntregadosHoy = ordersToday.filter((o) => o.estado === "entregado").length;

    const productCounts = new Map<string, number>();
    for (const o of orders) {
      for (const line of o.lines) {
        productCounts.set(line.label, (productCounts.get(line.label) ?? 0) + line.quantity);
      }
    }
    const topProductos = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));

    const ingresosPorNegocio = {
      barberia: bookings.filter((b) => b.estado !== "cancelada").reduce((s, b) => s + b.total, 0),
      fries: orders.filter((o) => o.worldId === "fries" && o.estado !== "cancelado").reduce((s, o) => s + o.total, 0),
      arepas: orders.filter((o) => o.worldId === "arepas" && o.estado !== "cancelado").reduce((s, o) => s + o.total, 0),
      slush: orders.filter((o) => o.worldId === "slush" && o.estado !== "cancelado").reduce((s, o) => s + o.total, 0),
    };

    const pedidosPorNegocioHoy = {
      fries: ordersToday.filter((o) => o.worldId === "fries").length,
      arepas: ordersToday.filter((o) => o.worldId === "arepas").length,
      slush: ordersToday.filter((o) => o.worldId === "slush").length,
    };

    return NextResponse.json(
      {
        ventasHoy,
        ventasMes,
        pedidosPendientes,
        pedidosEntregadosHoy,
        reservasHoy: bookingsForToday.length,
        clientesNuevosHoy: new Set([
          ...bookingsToday.map((b) => b.telefono),
          ...ordersToday.filter((o) => o.clienteTelefono).map((o) => o.clienteTelefono),
        ]).size,
        topProductos,
        ingresosPorNegocio,
        pedidosPorNegocioHoy,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

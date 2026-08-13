import { NextRequest, NextResponse } from "next/server";
import { getProperty, saveProperty } from "@/lib/db/properties";
import { checkAdminAuth } from "@/lib/admin-auth-server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  const body = await req.json();
  if (!checkAdminAuth(req, body?.pass)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const property = await getProperty(id);
    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }
    const { accion, from, to, reason, blockId } = body || {};
    if (accion === "bloquear") {
      if (!from || !to || to <= from) {
        return NextResponse.json({ error: "Rango de fechas inválido" }, { status: 400 });
      }
      const blockIdNew = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      property.blockedRanges.push({ id: blockIdNew, from, to, reason: reason || undefined });
    } else if (accion === "desbloquear") {
      if (!blockId) {
        return NextResponse.json({ error: "Falta blockId" }, { status: 400 });
      }
      property.blockedRanges = property.blockedRanges.filter((b) => b.id !== blockId);
    } else {
      return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
    }
    property.updatedAt = new Date().toISOString();
    await saveProperty(property);
    return NextResponse.json({ ok: true, property });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

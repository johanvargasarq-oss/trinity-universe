import { NextRequest, NextResponse } from "next/server";
import { getProperty, saveProperty, type Property } from "@/lib/db/properties";
import { checkAdminAuth } from "@/lib/admin-auth-server";

const EDITABLE_FIELDS: (keyof Property)[] = [
  "name",
  "description",
  "status",
  "capacity",
  "rooms",
  "amenities",
  "pricing",
  "media",
  "location",
];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const updated: Property = { ...property };
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) {
        (updated as unknown as Record<string, unknown>)[field] = body[field];
      }
    }
    updated.updatedAt = new Date().toISOString();
    await saveProperty(updated);
    return NextResponse.json({ ok: true, property: updated });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getAllProperties, saveProperty } from "@/lib/db/properties";
import { SEED_PROPERTIES } from "@/lib/db/rent-seed-data";
import { checkAdminAuth } from "@/lib/admin-auth-server";

/** Idempotent — only inserts the default 17 properties if none exist yet. Safe to call more than once. */
export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  const body = await req.json().catch(() => ({}));
  if (!checkAdminAuth(req, body?.pass)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const existing = await getAllProperties();
    if (existing.length > 0) {
      return NextResponse.json({ ok: true, seeded: false, count: existing.length });
    }
    for (const property of SEED_PROPERTIES) {
      await saveProperty(property);
    }
    return NextResponse.json({ ok: true, seeded: true, count: SEED_PROPERTIES.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

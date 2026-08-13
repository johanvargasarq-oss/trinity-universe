import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/db/properties";
import { checkAdminAuth } from "@/lib/admin-auth-server";

export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Falta configurar ADMIN_PASSWORD." }, { status: 500 });
  }
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
  }
  try {
    const all = await getAllProperties();
    return NextResponse.json({ properties: all }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

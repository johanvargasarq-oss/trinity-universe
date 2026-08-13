import { NextRequest, NextResponse } from "next/server";
import { getProperty } from "@/lib/db/properties";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await getProperty(id);
    if (!property || property.status !== "activa") {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ property }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

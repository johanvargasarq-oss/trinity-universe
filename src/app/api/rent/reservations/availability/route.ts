import { NextRequest, NextResponse } from "next/server";
import { getProperty } from "@/lib/db/properties";
import { getOccupiedRanges } from "@/lib/db/reservations";

/** Occupied ranges (confirmed reservations + manual blocks) for one property's calendar. Public, no personal data returned. */
export async function GET(req: NextRequest) {
  try {
    const propertyId = new URL(req.url).searchParams.get("propertyId");
    if (!propertyId) {
      return NextResponse.json({ error: "Falta propertyId" }, { status: 400 });
    }
    const property = await getProperty(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }
    const occupied = await getOccupiedRanges(propertyId, property.blockedRanges);
    return NextResponse.json(
      { occupied: occupied.map((o) => ({ from: o.from, to: o.to })) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

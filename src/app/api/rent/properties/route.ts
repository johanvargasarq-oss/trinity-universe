import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/db/properties";

/** Public catalog — property info is marketing content, not personal data. */
export async function GET() {
  try {
    const all = await getAllProperties();
    return NextResponse.json(
      { properties: all.filter((p) => p.status === "activa") },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

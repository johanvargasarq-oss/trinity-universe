import { NextRequest, NextResponse } from "next/server";
import { getAllBookings } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const worldId = searchParams.get("worldId");
    const sede = searchParams.get("sede");
    const fecha = searchParams.get("fecha");
    const staff = searchParams.get("staff");
    if (!worldId || !sede || !fecha || !staff) {
      return NextResponse.json({ error: "Falta worldId, sede, fecha o staff" }, { status: 400 });
    }
    const all = await getAllBookings();
    const ocupadas = all
      .filter(
        (b) =>
          b.estado === "confirmada" &&
          b.worldId === worldId &&
          b.sede === sede &&
          b.fecha === fecha &&
          b.staff === staff
      )
      .map((b) => b.hora);
    return NextResponse.json({ ocupadas }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

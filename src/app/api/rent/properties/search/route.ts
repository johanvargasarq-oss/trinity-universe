import { NextRequest, NextResponse } from "next/server";
import { getAllProperties } from "@/lib/db/properties";
import { getStayTotal } from "@/lib/rent-pricing";
import { isRangeAvailable } from "@/lib/db/reservations";

/** Public — filters active properties by capacity + real availability for a date range. */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adultos = Number(searchParams.get("adultos") ?? "1");
    const ninos = Number(searchParams.get("ninos") ?? "0");
    const guests = adultos + ninos;

    const all = (await getAllProperties()).filter((p) => p.status === "activa");

    if (!checkIn || !checkOut) {
      return NextResponse.json({ properties: all.map((p) => ({ ...p, stayTotal: null })) }, { headers: { "Cache-Control": "no-store" } });
    }

    const matches = [];
    for (const p of all) {
      if (guests > p.capacity.maxGuests || adultos > p.capacity.maxAdults) continue;
      const available = await isRangeAvailable(p.id, checkIn, checkOut, p.blockedRanges);
      if (!available) continue;
      matches.push({ ...p, stayTotal: getStayTotal(p, checkIn, checkOut) });
    }

    return NextResponse.json({ properties: matches }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

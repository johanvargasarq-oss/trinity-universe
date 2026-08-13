import { NextRequest, NextResponse } from "next/server";
import { getProperty, getStayTotal } from "@/lib/db/properties";
import { saveReservation, isRangeAvailable, nextReservationCode, type Reservation } from "@/lib/db/reservations";

function isValidDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      propertyId,
      checkIn,
      checkOut,
      adultos,
      ninos,
      bebes,
      horaLlegadaEstimada,
      comentarios,
      huesped,
      aceptaTerminos,
      aceptaTratamientoDatos,
    } = body || {};

    if (!propertyId || !isValidDate(checkIn) || !isValidDate(checkOut)) {
      return NextResponse.json({ error: "Faltan fechas o propiedad" }, { status: 400 });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (checkIn < today) {
      return NextResponse.json({ error: "La fecha de entrada no puede ser anterior a hoy" }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return NextResponse.json({ error: "La fecha de salida debe ser posterior a la entrada" }, { status: 400 });
    }
    const adultosNum = Number(adultos);
    const ninosNum = Number(ninos) || 0;
    const bebesNum = Number(bebes) || 0;
    if (!Number.isInteger(adultosNum) || adultosNum < 1 || ninosNum < 0 || bebesNum < 0) {
      return NextResponse.json({ error: "Cantidad de huéspedes inválida" }, { status: 400 });
    }
    if (
      !huesped?.nombreCompleto?.trim() ||
      !huesped?.tipoDocumento?.trim() ||
      !huesped?.numeroDocumento?.trim() ||
      !huesped?.correo?.trim() ||
      !huesped?.celular?.trim() ||
      !huesped?.pais?.trim()
    ) {
      return NextResponse.json({ error: "Faltan datos del huésped" }, { status: 400 });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(huesped.correo);
    if (!emailOk) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }
    if (!aceptaTerminos || !aceptaTratamientoDatos) {
      return NextResponse.json({ error: "Debes aceptar los términos y el tratamiento de datos" }, { status: 400 });
    }

    const property = await getProperty(propertyId);
    if (!property || property.status !== "activa") {
      return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });
    }

    const totalGuests = adultosNum + ninosNum;
    if (totalGuests > property.capacity.maxGuests || adultosNum > property.capacity.maxAdults) {
      return NextResponse.json({ error: "Esta propiedad no tiene capacidad para esa cantidad de huéspedes" }, { status: 400 });
    }

    const available = await isRangeAvailable(propertyId, checkIn, checkOut, property.blockedRanges);
    if (!available) {
      return NextResponse.json({ error: "Esas fechas ya no están disponibles para esta propiedad" }, { status: 409 });
    }

    const noches = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    const subtotal = getStayTotal(property, checkIn, checkOut);
    const precioPorNoche = Math.round(subtotal / noches);
    const cargosAdicionales = 0;
    const total = subtotal + cargosAdicionales;

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const codigo = await nextReservationCode();
    const reservation: Reservation = {
      id,
      codigo,
      propertyId,
      huesped: {
        nombreCompleto: huesped.nombreCompleto.trim(),
        tipoDocumento: huesped.tipoDocumento.trim(),
        numeroDocumento: huesped.numeroDocumento.trim(),
        correo: huesped.correo.trim(),
        celular: huesped.celular.trim(),
        pais: huesped.pais.trim(),
      },
      checkIn,
      checkOut,
      noches,
      adultos: adultosNum,
      ninos: ninosNum,
      bebes: bebesNum,
      horaLlegadaEstimada: horaLlegadaEstimada || undefined,
      comentarios: comentarios || undefined,
      precioPorNoche,
      subtotal,
      cargosAdicionales,
      total,
      estado: "pendiente",
      aceptaTerminos: true,
      aceptaTratamientoDatos: true,
      notificacion: { email: "pendiente", whatsapp: "pendiente" },
      creadoEn: new Date().toISOString(),
    };
    await saveReservation(reservation);

    return NextResponse.json({ ok: true, id, codigo, total, noches });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

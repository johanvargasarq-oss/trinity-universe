const HASH_KEY = "trinity:bookings";

async function redisCmd(...args: (string | number)[]) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Falta configurar la base de datos: agrega una integración de Redis (Vercel KV / Upstash) al proyecto."
    );
  }
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const data = await r.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export interface Booking {
  id: string;
  worldId: string;
  nombre: string;
  telefono: string;
  servicio: string;
  staff: string;
  sede: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "confirmada";
  creadoEn: string;
  confirmadoEn?: string;
}

export async function getAllBookings(): Promise<Booking[]> {
  const flat = await redisCmd("HGETALL", HASH_KEY);
  const out: Booking[] = [];
  if (Array.isArray(flat)) {
    for (let i = 0; i < flat.length; i += 2) {
      try {
        out.push(JSON.parse(flat[i + 1]));
      } catch {
        // ignora entradas corruptas
      }
    }
  }
  return out;
}

export async function saveBooking(booking: Booking): Promise<void> {
  await redisCmd("HSET", HASH_KEY, booking.id, JSON.stringify(booking));
}

export async function deleteBooking(id: string): Promise<void> {
  await redisCmd("HDEL", HASH_KEY, id);
}

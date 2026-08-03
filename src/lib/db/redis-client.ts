/** Low-level Redis REST client (Upstash / Vercel KV compatible). Every entity module builds on this. */
export async function redisCmd(...args: (string | number)[]) {
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

/** Reads every value in a Redis hash, parsed as JSON, skipping corrupt entries. */
export async function hashGetAll<T>(hashKey: string): Promise<T[]> {
  const flat = await redisCmd("HGETALL", hashKey);
  const out: T[] = [];
  if (Array.isArray(flat)) {
    for (let i = 0; i < flat.length; i += 2) {
      try {
        out.push(JSON.parse(flat[i + 1]));
      } catch {
        // ignore corrupt entries
      }
    }
  }
  return out;
}

export async function hashSet(hashKey: string, id: string, value: unknown): Promise<void> {
  await redisCmd("HSET", hashKey, id, JSON.stringify(value));
}

export async function hashDelete(hashKey: string, id: string): Promise<void> {
  await redisCmd("HDEL", hashKey, id);
}

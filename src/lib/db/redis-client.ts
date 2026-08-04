import Redis from "ioredis";

/**
 * Cached across warm serverless invocations (standard Next.js pattern) so we
 * don't open a new TCP connection to Redis on every request.
 */
let client: Redis | null = null;

function getClient(): Redis {
  if (client) return client;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error(
      "Falta configurar la base de datos: agrega una integración de Redis al proyecto en Vercel."
    );
  }
  client = new Redis(url, { maxRetriesPerRequest: 3 });
  return client;
}

/** Reads every value in a Redis hash, parsed as JSON, skipping corrupt entries. */
export async function hashGetAll<T>(hashKey: string): Promise<T[]> {
  const redis = getClient();
  const flat = await redis.hgetall(hashKey);
  const out: T[] = [];
  for (const value of Object.values(flat)) {
    try {
      out.push(JSON.parse(value));
    } catch {
      // ignore corrupt entries
    }
  }
  return out;
}

export async function hashSet(hashKey: string, id: string, value: unknown): Promise<void> {
  const redis = getClient();
  await redis.hset(hashKey, id, JSON.stringify(value));
}

export async function hashDelete(hashKey: string, id: string): Promise<void> {
  const redis = getClient();
  await redis.hdel(hashKey, id);
}

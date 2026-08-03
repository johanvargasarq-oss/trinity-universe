import { NextRequest } from "next/server";

/** Shared admin-password check for every admin-gated API route. */
export function checkAdminAuth(req: NextRequest, bodyPass?: string): boolean {
  const headerPass = req.headers.get("x-admin-pass");
  const queryPass = new URL(req.url).searchParams.get("pass");
  const pass = headerPass || bodyPass || queryPass;
  return Boolean(pass) && pass === process.env.ADMIN_PASSWORD;
}

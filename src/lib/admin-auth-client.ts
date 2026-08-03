"use client";

const KEY = "trinity-admin-pass";

export function getStoredAdminPass(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}

export function setStoredAdminPass(pass: string) {
  sessionStorage.setItem(KEY, pass);
}

export function clearStoredAdminPass() {
  sessionStorage.removeItem(KEY);
}

/** Fetch wrapper that always attaches the stored admin password header. */
export async function adminFetch(input: string, init: RequestInit = {}) {
  const pass = getStoredAdminPass() ?? "";
  return fetch(input, {
    ...init,
    headers: { ...(init.headers || {}), "x-admin-pass": pass },
  });
}

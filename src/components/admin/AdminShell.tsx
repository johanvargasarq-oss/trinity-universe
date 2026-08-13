"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminFetch, getStoredAdminPass, setStoredAdminPass, clearStoredAdminPass } from "@/lib/admin-auth-client";

const NAV = [
  { href: "/admin", label: "Dashboard", emoji: "📊" },
  { href: "/admin/barberia", label: "Barbería", emoji: "✂️" },
  { href: "/admin/fries", label: "TriniFries", emoji: "🍟" },
  { href: "/admin/arepas", label: "TriniArepas", emoji: "🌮" },
  { href: "/admin/slush", label: "TriniSlush", emoji: "🥤" },
  { href: "/admin/rent", label: "Beach Rental", emoji: "🏖️" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = getStoredAdminPass();
    if (!stored) {
      setAuthed(false);
      return;
    }
    adminFetch("/api/admin/dashboard")
      .then((res) => setAuthed(res.ok))
      .catch(() => setAuthed(false));
  }, []);

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard", { headers: { "x-admin-pass": pass } });
      if (res.ok) {
        setStoredAdminPass(pass);
        setAuthed(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Clave incorrecta");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearStoredAdminPass();
    setAuthed(false);
    setPass("");
  }

  if (authed === null) return <div className="min-h-screen bg-black" />;

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl text-white mb-1 text-center trinity-gradient-text">TRINITY ADMIN</h1>
          <p className="text-white/40 text-sm text-center mb-6">Panel de administración</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Clave de administrador"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40"
          />
          <button
            onClick={login}
            disabled={loading}
            className="w-full mt-3 rounded-lg bg-white text-black py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col sm:flex-row">
      <aside className="sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 px-4 py-5 sm:min-h-screen">
        <div className="font-display text-lg trinity-gradient-text mb-6 px-2">TRINITY ADMIN</div>
        <nav className="flex sm:flex-col gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.emoji}</span> {item.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="hidden sm:block mt-8 px-3 text-xs text-white/30 hover:text-white/60">
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

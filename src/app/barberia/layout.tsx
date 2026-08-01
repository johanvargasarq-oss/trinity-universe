import type { Metadata } from "next";
import { worlds } from "@/lib/brands";
import { buildWorldMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildWorldMetadata(worlds.barberia);

export default function BarberiaLayout({ children }: { children: React.ReactNode }) {
  return <div data-world="barberia">{children}</div>;
}

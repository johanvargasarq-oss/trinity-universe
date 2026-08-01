import type { Metadata } from "next";
import { worlds } from "@/lib/brands";
import { buildWorldMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildWorldMetadata(worlds.arepas);

export default function ArepasLayout({ children }: { children: React.ReactNode }) {
  return <div data-world="arepas">{children}</div>;
}

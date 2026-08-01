import type { Metadata } from "next";
import { worlds } from "@/lib/brands";
import { buildWorldMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildWorldMetadata(worlds.fries);

export default function FriesLayout({ children }: { children: React.ReactNode }) {
  return <div data-world="fries">{children}</div>;
}

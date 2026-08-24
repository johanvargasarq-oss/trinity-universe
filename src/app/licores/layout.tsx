import type { Metadata } from "next";
import { worlds } from "@/lib/brands";
import { buildWorldMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildWorldMetadata(worlds.licores);

export default function LicoresLayout({ children }: { children: React.ReactNode }) {
  return <div data-world="licores">{children}</div>;
}

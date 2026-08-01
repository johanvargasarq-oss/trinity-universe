import type { Metadata } from "next";
import { worlds } from "@/lib/brands";
import { buildWorldMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildWorldMetadata(worlds.rent);

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return <div data-world="rent">{children}</div>;
}

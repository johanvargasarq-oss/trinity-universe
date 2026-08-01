import type { WorldConfig } from "@/lib/brands";

/** Renders alongside the global TrinityCorner (logo + back link, in layout.tsx). */
export default function WorldNav({ world }: { world: WorldConfig }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-end px-5 sm:px-8 py-5">
      <span
        className="font-display text-sm sm:text-base tracking-wide"
        style={{ color: world.theme.accent }}
      >
        {world.name}
      </span>
    </nav>
  );
}

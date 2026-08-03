import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine<T> {
  /** Unique per exact configuration (same product + same customization = same id, so re-adding bumps quantity). */
  id: string;
  item: T;
  quantity: number;
  unitPrice: number;
}

interface CartState<T> {
  lines: CartLine<T>[];
  notes: string;
  isOpen: boolean;
  addLine: (line: Omit<CartLine<T>, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeLine: (id: string) => void;
  setNotes: (notes: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

/**
 * Each business calls this once with its own storage key, producing a
 * fully isolated store (own state, own localStorage entry). Nothing is
 * ever shared between businesses — that's enforced by construction, not
 * by convention.
 */
export function createCartStore<T>(storageKey: string) {
  return create<CartState<T>>()(
    persist(
      (set) => ({
        lines: [],
        notes: "",
        isOpen: false,
        addLine: (line) =>
          set((state) => {
            const existing = state.lines.find((l) => l.id === line.id);
            const addQty = line.quantity ?? 1;
            if (existing) {
              return {
                lines: state.lines.map((l) =>
                  l.id === line.id ? { ...l, quantity: l.quantity + addQty } : l
                ),
              };
            }
            return { lines: [...state.lines, { ...line, quantity: addQty }] };
          }),
        updateQuantity: (id, quantity) =>
          set((state) => ({
            lines:
              quantity <= 0
                ? state.lines.filter((l) => l.id !== id)
                : state.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
          })),
        removeLine: (id) => set((state) => ({ lines: state.lines.filter((l) => l.id !== id) })),
        setNotes: (notes) => set({ notes }),
        clear: () => set({ lines: [], notes: "" }),
        open: () => set({ isOpen: true }),
        close: () => set({ isOpen: false }),
      }),
      { name: storageKey }
    )
  );
}

export function cartTotal<T>(lines: CartLine<T>[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
}

export function cartCount<T>(lines: CartLine<T>[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

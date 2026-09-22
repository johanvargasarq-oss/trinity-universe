import { createCartStore } from "./createCartStore";

export interface ArepaCartItem {
  baseName: string;
  adiciones: { id: string; nombre: string }[];
  salsas: { id: string; nombre: string }[];
}

export const useArepasCart = createCartStore<ArepaCartItem>("trinity-arepas-cart");

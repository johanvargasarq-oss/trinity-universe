import { createCartStore } from "./createCartStore";

export interface VapersCartItem {
  productName: string;
  variantName?: string;
}

export const useVapersCart = createCartStore<VapersCartItem>("trinity-vapers-cart");

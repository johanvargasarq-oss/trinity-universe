import { createCartStore } from "./createCartStore";

export interface LicoresCartItem {
  productName: string;
  variantName?: string;
}

export const useLicoresCart = createCartStore<LicoresCartItem>("trinity-licores-cart");

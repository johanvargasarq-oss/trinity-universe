import { createCartStore } from "./createCartStore";

export interface FriesCartItem {
  productName: string;
  variantName?: string;
}

export const useFriesCart = createCartStore<FriesCartItem>("trinity-fries-cart");

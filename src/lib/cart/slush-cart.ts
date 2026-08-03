import { createCartStore } from "./createCartStore";

export interface SlushCartItem {
  flavorName: string;
  sizeOz: number;
}

export const useSlushCart = createCartStore<SlushCartItem>("trinity-slush-cart");

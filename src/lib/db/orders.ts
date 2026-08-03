import { hashGetAll, hashSet, hashDelete } from "./redis-client";

const HASH_KEY = "trinity:orders";

export type OrderWorldId = "fries" | "arepas" | "slush";
export type OrderEstado = "pendiente" | "preparando" | "listo" | "entregado" | "cancelado";

export interface OrderLineSnapshot {
  label: string; // e.g. "Trini Clasic" or "Arepa de Pollo + Chorizo, Queso costeño"
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  worldId: OrderWorldId;
  lines: OrderLineSnapshot[];
  notes: string;
  total: number;
  clienteNombre?: string;
  clienteTelefono?: string;
  estado: OrderEstado;
  creadoEn: string;
  actualizadoEn?: string;
}

export async function getAllOrders(): Promise<Order[]> {
  return hashGetAll<Order>(HASH_KEY);
}

export async function saveOrder(order: Order): Promise<void> {
  await hashSet(HASH_KEY, order.id, order);
}

export async function deleteOrder(id: string): Promise<void> {
  await hashDelete(HASH_KEY, id);
}

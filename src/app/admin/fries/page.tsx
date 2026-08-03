"use client";

import OrdersAdmin from "@/components/admin/OrdersAdmin";
import { worlds } from "@/lib/brands";

export default function FriesAdminPage() {
  return <OrdersAdmin world={worlds.fries} />;
}

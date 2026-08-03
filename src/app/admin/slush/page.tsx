"use client";

import OrdersAdmin from "@/components/admin/OrdersAdmin";
import { worlds } from "@/lib/brands";

export default function SlushAdminPage() {
  return <OrdersAdmin world={worlds.slush} />;
}

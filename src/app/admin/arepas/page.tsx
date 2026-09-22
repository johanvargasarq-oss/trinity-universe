"use client";

import OrdersAdmin from "@/components/admin/OrdersAdmin";
import { worlds } from "@/lib/brands";

export default function ArepasAdminPage() {
  return <OrdersAdmin world={worlds.arepas} />;
}

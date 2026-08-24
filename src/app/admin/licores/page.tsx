"use client";

import OrdersAdmin from "@/components/admin/OrdersAdmin";
import { worlds } from "@/lib/brands";

export default function LicoresAdminPage() {
  return <OrdersAdmin world={worlds.licores} />;
}

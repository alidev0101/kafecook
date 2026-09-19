import Badge from "@/components/ui/Badge";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/lib/utils";

const orderVariantMap = {
  "bg-yellow-100 text-yellow-700": "warning",
  "bg-blue-100 text-blue-700":     "info",
  "bg-purple-100 text-purple-700": "purple",
  "bg-green-100 text-green-700":   "success",
  "bg-red-100 text-red-700":       "danger",
  "bg-gray-100 text-gray-700":     "default",
};

export function OrderStatusBadge({ status }) {
  const config = ORDER_STATUS[status];
  if (!config) return null;
  return <Badge variant={orderVariantMap[config.color] || "default"}>{config.label}</Badge>;
}

export function PaymentStatusBadge({ status }) {
  const config = PAYMENT_STATUS[status];
  if (!config) return null;
  const map = {
    "bg-red-100 text-red-700":   "danger",
    "bg-green-100 text-green-700": "success",
    "bg-gray-100 text-gray-700":   "default",
  };
  return <Badge variant={map[config.color] || "default"}>{config.label}</Badge>;
}

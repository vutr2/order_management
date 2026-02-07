import Link from "next/link";
import { StatusUpdateForm } from "@/components/orders/status-update-form";

const platformStyles = {
  shopee: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  lazada: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  manual: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export function OrderDetail({ order }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/orders"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition"
        >
          Orders
        </Link>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-sm font-medium">{order._id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformStyles[order.platform] || platformStyles.manual}`}>
            {order.platform}
          </span>
        </div>
        <StatusUpdateForm orderId={order._id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-black">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Customer</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-zinc-500">Name: </span>
              <span className="font-medium">{order.customerName || "—"}</span>
            </div>
            <div>
              <span className="text-zinc-500">Phone: </span>
              <span className="font-medium">{order.customerPhone || "—"}</span>
            </div>
            <div>
              <span className="text-zinc-500">Address: </span>
              <span className="font-medium">{order.shippingAddress || "—"}</span>
            </div>
          </div>
        </div>

        {/* Order Info */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-black">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Order Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-zinc-500">Date: </span>
              <span className="font-medium">{date}</span>
            </div>
            {order.platformOrderId && (
              <div>
                <span className="text-zinc-500">Platform ID: </span>
                <span className="font-medium">{order.platformOrderId}</span>
              </div>
            )}
            {order.trackingNumber && (
              <div>
                <span className="text-zinc-500">Tracking: </span>
                <span className="font-medium">{order.trackingNumber}</span>
              </div>
            )}
            {order.notes && (
              <div>
                <span className="text-zinc-500">Notes: </span>
                <span className="font-medium">{order.notes}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-black">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <th className="text-left px-5 py-3 font-medium text-zinc-500">Item</th>
              <th className="text-left px-5 py-3 font-medium text-zinc-500">SKU</th>
              <th className="text-right px-5 py-3 font-medium text-zinc-500">Qty</th>
              <th className="text-right px-5 py-3 font-medium text-zinc-500">Price</th>
              <th className="text-right px-5 py-3 font-medium text-zinc-500">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0">
                <td className="px-5 py-3 font-medium">{item.name}</td>
                <td className="px-5 py-3 text-zinc-500">{item.sku || "—"}</td>
                <td className="px-5 py-3 text-right">{item.quantity}</td>
                <td className="px-5 py-3 text-right">{formatCurrency(item.price)}</td>
                <td className="px-5 py-3 text-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-zinc-50 dark:bg-zinc-900">
              <td colSpan={4} className="px-5 py-3 text-right font-semibold">Total</td>
              <td className="px-5 py-3 text-right font-bold text-blue-600">{formatCurrency(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

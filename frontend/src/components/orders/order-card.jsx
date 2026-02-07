import Link from "next/link";

const platformStyles = {
  shopee: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  lazada: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  manual: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
  confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  processing: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
  shipping: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  delivered: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export function OrderCard({ order }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/orders/${order._id}`}
      className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-800 transition bg-white dark:bg-black"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformStyles[order.platform] || platformStyles.manual}`}>
              {order.platform}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[order.status] || statusStyles.pending}`}>
              {order.status}
            </span>
          </div>
          <span className="text-sm font-medium truncate">
            {order.customerName || "No name"}
          </span>
          <span className="text-xs text-zinc-500">{date}</span>
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <div className="text-sm font-semibold">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)}
        </div>
        <div className="text-xs text-zinc-500">
          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
        </div>
      </div>
    </Link>
  );
}

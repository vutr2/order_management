import Link from "next/link";
import { OrderCard } from "@/components/orders/order-card";

export function OrderList({ orders, total, page, totalPages, currentStatus }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
        <p className="text-sm">No orders found</p>
      </div>
    );
  }

  const buildUrl = (p) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", p);
    if (currentStatus) params.set("status", currentStatus);
    const qs = params.toString();
    return `/orders${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <span className="text-sm text-zinc-500">
            {total} order{total !== 1 ? "s" : ""} total
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildUrl(page - 1)}
                className="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                Previous
              </Link>
            )}
            <span className="px-3 py-1.5 text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={buildUrl(page + 1)}
                className="px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

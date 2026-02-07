import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getOrders } from "@/lib/db/queries/orders";
import { OrderList } from "@/components/orders/order-list";

const statusFilters = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipping", value: "shipping" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default async function OrdersPage({ searchParams }) {
  const { userId } = await auth();
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const status = params?.status || undefined;

  const data = userId
    ? await getOrders(userId, { page, status })
    : { orders: [], total: 0, page: 1, totalPages: 0 };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((f) => {
          const isActive = (status || "") === f.value;
          const href = f.value ? `/orders?status=${f.value}` : "/orders";
          return (
            <Link
              key={f.value}
              href={href}
              className={`px-3 py-1.5 text-sm rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-300 dark:hover:border-blue-800"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <OrderList
        orders={JSON.parse(JSON.stringify(data.orders))}
        total={data.total}
        page={data.page}
        totalPages={data.totalPages}
        currentStatus={status}
      />
    </div>
  );
}

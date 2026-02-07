import { auth } from "@clerk/nextjs/server";
import { getOrderStats } from "@/lib/db/queries/analytics";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipping: "Shipping",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusColors = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  processing: "bg-indigo-500",
  shipping: "bg-purple-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const platformColors = {
  shopee: "bg-orange-500",
  lazada: "bg-blue-500",
  manual: "bg-zinc-500",
};

export default async function AnalyticsPage() {
  const { userId } = await auth();

  const stats = userId
    ? await getOrderStats(userId)
    : { statusCounts: [], platformCounts: [], totalRevenue: 0, orderCount: 0, productCount: 0 };

  const pendingCount =
    stats.statusCounts.find((s) => s._id === "pending")?.count || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value={stats.orderCount} />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
        <StatCard label="Products" value={stats.productCount} />
        <StatCard label="Pending Orders" value={pendingCount} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-black">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">Orders by Status</h2>
          {stats.statusCounts.length === 0 ? (
            <p className="text-sm text-zinc-500">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.statusCounts.map((s) => {
                const pct = stats.orderCount > 0 ? (s.count / stats.orderCount) * 100 : 0;
                return (
                  <div key={s._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{statusLabels[s._id] || s._id}</span>
                      <span className="text-zinc-500">{s.count}</span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColors[s._id] || "bg-zinc-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orders by Platform */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-black">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-4">Orders by Platform</h2>
          {stats.platformCounts.length === 0 ? (
            <p className="text-sm text-zinc-500">No data yet</p>
          ) : (
            <div className="space-y-4">
              {stats.platformCounts.map((p) => {
                const pct = stats.orderCount > 0 ? (p.count / stats.orderCount) * 100 : 0;
                return (
                  <div key={p._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{p._id}</span>
                      <span className="text-zinc-500">
                        {p.count} orders &middot; {formatCurrency(p.revenue)}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${platformColors[p._id] || "bg-zinc-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-white dark:bg-black">
      <div className="text-sm text-zinc-500 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

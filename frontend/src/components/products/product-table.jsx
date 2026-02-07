import Link from "next/link";
import Image from "next/image";

const platformStyles = {
  shopee: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  lazada: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  all: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export function ProductTable({ products, total, page, totalPages, currentPlatform }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
        <p className="text-sm">No products found</p>
      </div>
    );
  }

  const buildUrl = (p) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", p);
    if (currentPlatform) params.set("platform", currentPlatform);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-black">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <th className="text-left px-5 py-3 font-medium text-zinc-500">Product</th>
              <th className="text-left px-5 py-3 font-medium text-zinc-500">SKU</th>
              <th className="text-left px-5 py-3 font-medium text-zinc-500">Platform</th>
              <th className="text-right px-5 py-3 font-medium text-zinc-500">Price</th>
              <th className="text-right px-5 py-3 font-medium text-zinc-500">Cost</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-zinc-100 dark:border-zinc-900 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.category && (
                        <div className="text-xs text-zinc-500">{product.category}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-zinc-500 font-mono text-xs">{product.sku}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${platformStyles[product.platform] || platformStyles.all}`}>
                    {product.platform}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-medium">{formatCurrency(product.price)}</td>
                <td className="px-5 py-3 text-right text-zinc-500">
                  {product.costPrice ? formatCurrency(product.costPrice) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <span className="text-sm text-zinc-500">
            {total} product{total !== 1 ? "s" : ""} total
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

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getProducts } from "@/lib/db/queries/products";
import { getLowStockItems } from "@/lib/db/queries/inventory";
import { ProductTable } from "@/components/products/product-table";

const platformFilters = [
  { label: "All", value: "" },
  { label: "Shopee", value: "shopee" },
  { label: "Lazada", value: "lazada" },
];

export default async function ProductsPage({ searchParams }) {
  const { userId } = await auth();
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const platform = params?.platform || undefined;

  const [productData, lowStockItems] = userId
    ? await Promise.all([
        getProducts(userId, { page, platform }),
        getLowStockItems(userId),
      ])
    : [{ products: [], total: 0, page: 1, totalPages: 0 }, []];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      {/* Low stock warning */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-yellow-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            {lowStockItems.length} product{lowStockItems.length !== 1 ? "s" : ""} with low stock
          </span>
        </div>
      )}

      {/* Platform filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {platformFilters.map((f) => {
          const isActive = (platform || "") === f.value;
          const href = f.value ? `/products?platform=${f.value}` : "/products";
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

      <ProductTable
        products={JSON.parse(JSON.stringify(productData.products))}
        total={productData.total}
        page={productData.page}
        totalPages={productData.totalPages}
        currentPlatform={platform}
      />
    </div>
  );
}

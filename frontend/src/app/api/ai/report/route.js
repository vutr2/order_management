import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/db/queries/subscription";
import { getOrders } from "@/lib/db/queries/orders";
import { getProducts } from "@/lib/db/queries/products";
import { getLowStockItems } from "@/lib/db/queries/inventory";
import { getOrderStats } from "@/lib/db/queries/analytics";

export async function GET(req) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await getSubscription(userId);
  if (sub.plan === "free") {
    return Response.json(
      { error: "Weekly report requires a Pro or Business plan." },
      { status: 403 }
    );
  }

  const [orderData, productData, lowStock, stats] = await Promise.all([
    getOrders(userId, { limit: 100 }),
    getProducts(userId, { limit: 100 }),
    getLowStockItems(userId),
    getOrderStats(userId),
  ]);

  const prompt = `
Based on this business data, generate a weekly report in Vietnamese:

ORDER STATS:
- Total orders: ${stats.orderCount}
- Total revenue: ${stats.totalRevenue} VND
- Orders by status: ${JSON.stringify(stats.statusCounts)}
- Orders by platform: ${JSON.stringify(stats.platformCounts)}

PRODUCTS: ${productData.total} total
${JSON.stringify(productData.products.map(p => ({
  name: p.name, price: p.price, costPrice: p.costPrice, platform: p.platform,
})))}

LOW STOCK (${lowStock.length} items):
${JSON.stringify(lowStock.map(i => ({
  product: i.productId?.name, quantity: i.quantity, threshold: i.lowStockThreshold,
})))}

RECENT ORDERS: ${orderData.orders.length} orders
${JSON.stringify(orderData.orders.map(o => ({
  platform: o.platform, total: o.totalAmount, status: o.status, date: o.createdAt,
})))}

Generate a report with these sections:
1. **Tổng quan tuần** - Summary of orders, revenue
2. **Cảnh báo tồn kho** - Low stock warnings with product names
3. **Phân tích doanh thu** - Revenue by platform, profit estimates (if cost data available)
4. **Đề xuất** - 2-3 actionable recommendations

Use markdown formatting. Be concise. Format currency in VND.
`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const report = response.content[0]?.text || "Unable to generate report";

  return Response.json({ report });
}

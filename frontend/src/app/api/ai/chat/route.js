import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/db/queries/subscription";
import { getOrders } from "@/lib/db/queries/orders";
import { getProducts } from "@/lib/db/queries/products";
import { getLowStockItems } from "@/lib/db/queries/inventory";
import { getOrderStats } from "@/lib/db/queries/analytics";

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = await getSubscription(userId);
  if (sub.plan === "free") {
    return Response.json(
      { error: "Ask AI requires a Pro or Business plan." },
      { status: 403 }
    );
  }

  const { message } = await req.json();
  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  const [orderData, productData, lowStock, stats] = await Promise.all([
    getOrders(userId, { limit: 50 }),
    getProducts(userId, { limit: 50 }),
    getLowStockItems(userId),
    getOrderStats(userId),
  ]);

  const context = `
You are an AI assistant for OrderHub, an order management platform.
You have access to the user's business data:

ORDER STATS:
- Total orders: ${stats.orderCount}
- Total revenue: ${stats.totalRevenue} VND
- Products: ${stats.productCount}
- Orders by status: ${JSON.stringify(stats.statusCounts)}
- Orders by platform: ${JSON.stringify(stats.platformCounts)}

RECENT ORDERS (last 50):
${JSON.stringify(orderData.orders.map(o => ({
  id: o._id,
  platform: o.platform,
  customer: o.customerName,
  total: o.totalAmount,
  status: o.status,
  items: o.items?.length || 0,
  date: o.createdAt,
})))}

PRODUCTS (${productData.total} total):
${JSON.stringify(productData.products.map(p => ({
  name: p.name,
  sku: p.sku,
  platform: p.platform,
  price: p.price,
  costPrice: p.costPrice,
})))}

LOW STOCK ALERTS (${lowStock.length} items):
${JSON.stringify(lowStock.map(i => ({
  product: i.productId?.name,
  sku: i.productId?.sku,
  quantity: i.quantity,
  threshold: i.lowStockThreshold,
})))}

Answer in the same language the user asks in. Be concise and actionable.
Format currency in VND. Use markdown for formatting.
`;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    system: context,
    messages: [{ role: "user", content: message }],
  });

  const reply = response.content[0]?.text || "No response";

  return Response.json({ reply });
}

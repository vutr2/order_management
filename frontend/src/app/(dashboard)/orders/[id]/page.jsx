import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/db/queries/orders";
import { OrderDetail } from "@/components/orders/order-detail";

export default async function OrderDetailPage({ params }) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) notFound();

  const order = await getOrderById(userId, id);
  if (!order) notFound();

  return <OrderDetail order={JSON.parse(JSON.stringify(order))} />;
}

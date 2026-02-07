"use server";

import { auth } from "@clerk/nextjs/server";
import { updateOrderStatus } from "@/lib/db/queries/orders";
import { revalidatePath } from "next/cache";

export async function changeOrderStatus(orderId, status) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await updateOrderStatus(userId, orderId, status);
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/orders");
}

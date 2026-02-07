import { Webhook } from "svix";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user";

export async function POST(req) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(SIGNING_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  await connectDB();

  const eventType = evt.type;
  const data = evt.data;

  switch (eventType) {
    case "user.created":
    case "user.updated":
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          imageUrl: data.image_url || "",
        },
        { upsert: true, new: true }
      );
      break;
    case "user.deleted":
      await User.findOneAndDelete({ clerkId: data.id });
      break;
    default:
      console.log("Unhandled webhook event:", eventType);
  }

  return new Response("Webhook received", { status: 200 });
}

import { Webhook } from "svix";
import { headers } from "next/headers";

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

  const { id } = evt.data;
  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      // TODO: Save user to your database
      console.log("User created:", id);
      break;
    case "user.updated":
      // TODO: Update user in your database
      console.log("User updated:", id);
      break;
    case "user.deleted":
      // TODO: Delete user from your database
      console.log("User deleted:", id);
      break;
    default:
      console.log("Unhandled webhook event:", eventType);
  }

  return new Response("Webhook received", { status: 200 });
}

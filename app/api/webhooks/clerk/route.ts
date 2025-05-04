import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { IncomingHttpHeaders } from "http";
import { createUser, deleteUser } from "../../../../lib/db";
import { sendWelcomeEmail } from "@/lib/email";

type EventType = "user.created" | "user.updated" | "user.deleted";

type Event = {
  data: {
    id: string;
    email_addresses: {
      email_address: string;
      id: string;
    }[];
    first_name: string;
    last_name: string;
    image_url: string;
    created_at: number;
  };
  object: "event";
  type: EventType;
};

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set in the environment variables.");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  const headerPayload = await headers(); // `await` eklendi
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers:", { svix_id, svix_timestamp, svix_signature });
    return new NextResponse("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const svixHeaders: IncomingHttpHeaders & WebhookRequiredHeaders = {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  };

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    wh.verify(body, svixHeaders);
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error verifying webhook", { status: 400 });
  }

  const { type } = payload;
  const event = payload as Event;

  if (!type || !["user.created", "user.updated", "user.deleted"].includes(type)) {
    console.error("Invalid event type:", type);
    return new NextResponse("Error: Invalid event type", { status: 400 });
  }

  try {
    switch (type) {
      case "user.created": {
        const user = event.data;

        await createUser({
          id: user.id,
          email: user.email_addresses[0]?.email_address || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          imageUrl: user.image_url || "",
          createdAt: new Date(user.created_at).toISOString(),
        });

        await sendWelcomeEmail({
          email: user.email_addresses[0]?.email_address || "",
          firstName: user.first_name || "",
        });

        break;
      }

      case "user.deleted": {
        const userId = event.data.id;
        await deleteUser(userId);
        break;
      }

      default:
        console.log("Unhandled event type:", type);
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error processing webhook", { status: 500 });
  }
}
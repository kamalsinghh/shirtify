import { createUser, updateUser } from "@/lib/actions/user.actions";
import { ClerkUser } from "@/lib/types";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(request: Request) {
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("WEBHOOK_SECRET is not configured.");

    return new Response("Webhook secret is not configured.", {
      status: 500,
    });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing required Svix headers.", {
      status: 400,
    });
  }

  // Read the unmodified request body. Svix verifies the
  // signature against the exact raw payload.
  const body = await request.text();

  const webhook = new Webhook(webhookSecret);

  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);

    return new Response("Invalid webhook signature.", {
      status: 400,
    });
  }

  if (event.type === "user.created") {
    const { id, first_name, last_name, username, image_url, email_addresses } =
      event.data;

    const fallbackUsername =
      email_addresses[0]?.email_address
        ?.split("@")[0]
        .replace(/[^a-zA-Z0-9_]/g, "_") || `user_${id.slice(-8)}`;

    const user: ClerkUser = {
      id,
      firstName: first_name || "",
      lastName: last_name || "",
      username: username || fallbackUsername,
      avatar: image_url || null,
    };

    const result = await createUser(user);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully.",
    });
  }

  if (event.type === "user.updated") {
    const { id, first_name, last_name, username, image_url, email_addresses } =
      event.data;

    const fallbackUsername =
      email_addresses[0]?.email_address
        ?.split("@")[0]
        .replace(/[^a-zA-Z0-9_]/g, "_") || `user_${id.slice(-8)}`;

    const user: ClerkUser = {
      id,
      firstName: first_name || "",
      lastName: last_name || "",
      username: username || fallbackUsername,
      avatar: image_url || null,
    };

    const result = await updateUser(user);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 500,
      });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
    });
  }

  return NextResponse.json({
    success: true,
    message: "Webhook received.",
  });
}

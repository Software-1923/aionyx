import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { updateSubscription } from "../../../../lib/db";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      if (session.subscription && session.customer) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (session.metadata?.userId) {
          await updateSubscription({
            userId: session.metadata.userId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            plan: session.metadata.plan,
            status: subscription.status,
          });

          await clerkClient.users.updateUserMetadata(session.metadata.userId, {
            publicMetadata: {
              plan: session.metadata.plan,
              subscriptionStatus: subscription.status,
            },
          });
        }
      }
      break;

    // Diğer event türleri burada ele alınır...

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { updateSubscription } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  
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
    case 'checkout.session.completed':
      // Payment is successful and the subscription is created
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
          
          // Update Clerk user metadata with subscription info
          await clerkClient.users.updateUserMetadata(session.metadata.userId, {
            publicMetadata: {
              plan: session.metadata.plan,
              subscriptionStatus: subscription.status,
            },
          });
        }
      }
      break;
      
    case 'invoice.payment_succeeded':
      // Recurring payment succeeded
      if (session.subscription && session.customer) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        
        const user = await clerkClient.users.getUserList({
          query: `publicMetadata.stripeCustomerId:${session.customer}`,
        });
        
        if (user.length > 0) {
          const userId = user[0].id;
          
          await updateSubscription({
            userId,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            status: subscription.status,
          });
          
          // Update Clerk user metadata
          await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
              subscriptionStatus: subscription.status,
            },
          });
        }
      }
      break;
      
    case 'customer.subscription.updated':
      // Subscription updated
      const subscriptionUpdated = event.data.object as Stripe.Subscription;
      const userUpdated = await clerkClient.users.getUserList({
        query: `publicMetadata.stripeCustomerId:${subscriptionUpdated.customer}`,
      });
      
      if (userUpdated.length > 0) {
        const userId = userUpdated[0].id;
        
        await updateSubscription({
          userId,
          stripeCurrentPeriodEnd: new Date(
            subscriptionUpdated.current_period_end * 1000
          ).toISOString(),
          status: subscriptionUpdated.status,
        });
        
        // Update Clerk user metadata
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: {
            subscriptionStatus: subscriptionUpdated.status,
          },
        });
      }
      break;
      
    case 'customer.subscription.deleted':
      // Subscription canceled or expired
      const subscriptionDeleted = event.data.object as Stripe.Subscription;
      const userDeleted = await clerkClient.users.getUserList({
        query: `publicMetadata.stripeCustomerId:${subscriptionDeleted.customer}`,
      });
      
      if (userDeleted.length > 0) {
        const userId = userDeleted[0].id;
        
        await updateSubscription({
          userId,
          stripeCurrentPeriodEnd: new Date(
            subscriptionDeleted.current_period_end * 1000
          ).toISOString(),
          status: subscriptionDeleted.status,
        });
        
        // Update Clerk user metadata
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: {
            subscriptionStatus: subscriptionDeleted.status,
          },
        });
      }
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  return new NextResponse(null, { status: 200 });
}
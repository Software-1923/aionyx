import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    const { priceId, plan, successUrl, cancelUrl, interval } = body;
    
    if (!priceId || !plan || !successUrl || !cancelUrl || !interval) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }
    
    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${successUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}?canceled=true`,
      metadata: {
        userId: userId,
        plan: plan,
        interval: interval,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan,
          interval: interval,
        },
      },
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
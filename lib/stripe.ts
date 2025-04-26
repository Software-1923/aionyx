import Stripe from "stripe";

// Initialize Stripe with API key based on environment
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});
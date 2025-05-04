import { tursoTable, text, timestamp } from "drizzle-orm";

export const users = tursoTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = tursoTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  plan: text("plan"),
  status: text("status"),
});

export const payments = tursoTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: text("amount"),
  currency: text("currency"),
  status: text("status"),
  createdAt: timestamp("created_at").defaultNow(),
});
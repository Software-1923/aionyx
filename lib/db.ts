import { createClient } from "@libsql/client";

// Initialize Turso client
const client = createClient({
  url: process.env.DATABASE_URL || "",
});

// Create required tables if they don't exist
export async function initializeDatabase() {
  try {
    // Users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        first_name TEXT,
        last_name TEXT,
        image_url TEXT,
        created_at TEXT
      )
    `);
    
    // Subscriptions table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        stripe_price_id TEXT,
        stripe_current_period_end TEXT,
        plan TEXT,
        status TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    // Payments table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        amount INTEGER,
        currency TEXT,
        status TEXT,
        created_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// User operations
export async function createUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: string;
}) {
  try {
    await client.execute({
      sql: `
        INSERT INTO users (id, email, first_name, last_name, image_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        user.id,
        user.email,
        user.firstName,
        user.lastName,
        user.imageUrl,
        user.createdAt,
      ],
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
}

export async function getUser(userId: string) {
  try {
    const result = await client.execute({
      sql: `SELECT * FROM users WHERE id = ?`,
      args: [userId],
    });
    
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete related records first
    await client.execute({
      sql: `DELETE FROM subscriptions WHERE user_id = ?`,
      args: [userId],
    });
    
    await client.execute({
      sql: `DELETE FROM payments WHERE user_id = ?`,
      args: [userId],
    });
    
    // Then delete the user
    await client.execute({
      sql: `DELETE FROM users WHERE id = ?`,
      args: [userId],
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
}

// Subscription operations
export async function createSubscription(subscription: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: string;
  plan: string;
  status: string;
}) {
  try {
    await client.execute({
      sql: `
        INSERT INTO subscriptions (
          user_id, stripe_customer_id, stripe_subscription_id,
          stripe_price_id, stripe_current_period_end, plan, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        subscription.userId,
        subscription.stripeCustomerId,
        subscription.stripeSubscriptionId,
        subscription.stripePriceId,
        subscription.stripeCurrentPeriodEnd,
        subscription.plan,
        subscription.status,
      ],
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return { success: false, error };
  }
}

export async function updateSubscription(subscription: {
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCurrentPeriodEnd: string;
  plan?: string;
  status: string;
}) {
  try {
    // Check if subscription exists
    const existingSubscription = await client.execute({
      sql: `SELECT * FROM subscriptions WHERE user_id = ?`,
      args: [subscription.userId],
    });
    
    if (existingSubscription.rows.length === 0) {
      // Create new subscription if it doesn't exist
      if (subscription.stripeCustomerId && subscription.stripeSubscriptionId && subscription.stripePriceId && subscription.plan) {
        return createSubscription({
          userId: subscription.userId,
          stripeCustomerId: subscription.stripeCustomerId,
          stripeSubscriptionId: subscription.stripeSubscriptionId,
          stripePriceId: subscription.stripePriceId,
          stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
          plan: subscription.plan,
          status: subscription.status,
        });
      } else {
        return { success: false, error: "Missing required fields for new subscription" };
      }
    }
    
    // Update existing subscription
    await client.execute({
      sql: `
        UPDATE subscriptions
        SET stripe_current_period_end = ?, status = ?
        WHERE user_id = ?
      `,
      args: [
        subscription.stripeCurrentPeriodEnd,
        subscription.status,
        subscription.userId,
      ],
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error };
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const result = await client.execute({
      sql: `
        SELECT * FROM subscriptions 
        WHERE user_id = ?
      `,
      args: [userId],
    });
    
    if (result.rows.length === 0) return null;
    
    const subscription = result.rows[0];
    return {
      userId: subscription.user_id,
      stripeCustomerId: subscription.stripe_customer_id,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      stripePriceId: subscription.stripe_price_id,
      currentPeriodEnd: subscription.stripe_current_period_end,
      plan: subscription.plan,
      status: subscription.status,
    };
  } catch (error) {
    console.error("Error getting user subscription:", error);
    return null;
  }
}

// Payment operations
export async function createPayment(payment: {
  userId: string;
  amount: number;
  currency: string;
  status: string;
}) {
  try {
    const createdAt = new Date().toISOString();
    
    await client.execute({
      sql: `
        INSERT INTO payments (user_id, amount, currency, status, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        payment.userId,
        payment.amount,
        payment.currency,
        payment.status,
        createdAt,
      ],
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error creating payment:", error);
    return { success: false, error };
  }
}

export async function getUserPayments(userId: string) {
  try {
    const result = await client.execute({
      sql: `
        SELECT * FROM payments 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
      args: [userId],
    });
    
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting user payments:", error);
    return [];
  }
}

// Initialize database on import
initializeDatabase();
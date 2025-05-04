import { createClient } from "@turso/client";
import { drizzle } from "drizzle-orm/turso";

// Turso istemcisini oluşturun
const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

// Drizzle ORM ile bağlantıyı oluşturun
export const db = drizzle(client);

// Kullanıcılar tablosu için şema
export const users = {
  id: "id",
  email: "email",
  firstName: "first_name",
  lastName: "last_name",
  imageUrl: "image_url",
  createdAt: "created_at",
};

// Initialize Turso client
const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
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

// Kullanıcı oluşturma
export async function createUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: string;
}) {
  await db.insert(users).values(user);
  console.log("User created:", user);
}

// Kullanıcı silme
export async function deleteUser(userId: string) {
  await db.delete(users).where({ id: userId });
  console.log("User deleted:", userId);
}

// Abonelik güncelleme
export async function updateSubscription(data: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: string;
  plan: string;
  status: string;
}) {
  await db.execute(`
    INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, stripe_current_period_end, plan, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      stripe_customer_id = excluded.stripe_customer_id,
      stripe_subscription_id = excluded.stripe_subscription_id,
      stripe_price_id = excluded.stripe_price_id,
      stripe_current_period_end = excluded.stripe_current_period_end,
      plan = excluded.plan,
      status = excluded.status
  `, [
    data.userId,
    data.stripeCustomerId,
    data.stripeSubscriptionId,
    data.stripePriceId,
    data.stripeCurrentPeriodEnd,
    data.plan,
    data.status,
  ]);
  console.log("Subscription updated successfully for user:", data.userId);
}

// Kullanıcı aboneliği alma
export async function getUserSubscription(userId: string) {
  const result = await db.execute(`
    SELECT * FROM subscriptions WHERE user_id = ?
  `, [userId]);
  return result.rows[0];
}

// Kullanıcı ödemelerini alma
export async function getUserPayments(userId: string) {
  const result = await db.execute(`
    SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC
  `, [userId]);
  return result.rows;
}

// Export all database operations
export { client };
export * from "./db/users";
export * from "./db/subscriptions";
export * from "./db/payments";

// Initialize database on import
initializeDatabase();
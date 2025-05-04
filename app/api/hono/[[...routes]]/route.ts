import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { auth } from '@clerk/nextjs';

// Context türünü genişletme
type CustomContext = {
  Variables: {
    userId: string;
  };
};

const app = new Hono<CustomContext>().basePath('/api');

// Middleware
app.use('*', logger());
app.use('*', cors());

// Auth middleware
app.use('*', async (c, next) => {
  const { userId } = auth();
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('userId', userId); // `userId` artık tanımlı
  await next();
});

// Routes
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

// User routes
app.get('/user', async (c) => {
  const userId = c.get('userId'); // `userId` artık tanımlı
  return c.json({ userId });
});

// Export handlers using handle function
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
import { chatRouter } from '@api/routes/chat.routes';
import { rateLimiter } from 'hono-rate-limiter';
import { compress } from 'hono/compress';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { Hono } from 'hono';

export const app = new Hono();

// Middlewares
app.use('*', compress());
app.use('*', logger());
app.use('*', cors());

// Apply the rate limiting middleware to all requests (200 requests per minute per IP)
app.use(
	rateLimiter({
		windowMs: 1 * 60 * 1000, // 1 minute
		limit: 200, // Limit each IP to 200 requests per `window` (here, per 1 minute).
		keyGenerator: ctx => ctx.req.header('X-Forwarded-For') || 'CLIENT_IP',
		handler: () =>
		{
			throw new Error('Rate limit exceeded');
		},
	})
);

// Routes
let baseApi = app
	// Health route
	.get('/health', c =>
	{
		return c.json({ message: 'API Server is up' });
	})
	// Base path
	.basePath('/api/v1')
	// Auth routes
	.route('/userMgmt', chatRouter);

// 404 Not Found
app.notFound(ctx =>
{
	const message = `${ctx.req.method} ${ctx.req.path} not found`;
	return ctx.json({ message: message }, 404);
});

export type ApiRoutesType = typeof baseApi;

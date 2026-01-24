import { apiEnv } from '@api/config/apiEnv';
import { serve } from '@hono/node-server';
import { app } from '@api/app';

const server = serve({
	port: apiEnv.API_PORT,
	fetch: app.fetch,
});

server.on('listening', async () =>
{
	console.log(`Api Server is running on http://localhost:${apiEnv.API_PORT} and with PID ${process.pid}`);
});

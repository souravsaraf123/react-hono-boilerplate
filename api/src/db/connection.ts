import { drizzle } from 'drizzle-orm/node-postgres';
import { apiEnv } from '@api/config/apiEnv';
import { Pool } from 'pg';

const apiPool = new Pool({
	max: 80,
	idleTimeoutMillis: 60_000,
	application_name: 'mapranks-api',
	user: apiEnv.DB_USER,
	password: apiEnv.DB_PASSWORD,
	host: apiEnv.DB_HOST,
	port: apiEnv.DB_PORT,
	database: apiEnv.DB_NAME,
	ssl: false,
});
export const db = drizzle({ client: apiPool, casing: 'snake_case' });
export const closeDb = async () => await db.$client.end();
export type Transaction = Parameters<Parameters<(typeof db)['transaction']>[0]>[0];

const logPool = new Pool({
	max: 1,
	idleTimeoutMillis: 0,
	application_name: 'mapranks-logger',
	user: apiEnv.DB_USER,
	password: apiEnv.DB_PASSWORD,
	host: apiEnv.DB_HOST,
	port: apiEnv.DB_PORT,
	database: apiEnv.DB_NAME,
	ssl: false,
});
export const logDb = drizzle({ client: logPool, casing: 'snake_case' });

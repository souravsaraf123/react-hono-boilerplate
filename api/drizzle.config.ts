import { apiEnv } from './src/config/apiEnv';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: './src/db/tables/*.ts',
	dialect: 'postgresql',
	casing: 'snake_case',
	dbCredentials: {
		user: apiEnv.DB_USER,
		password: apiEnv.DB_PASSWORD,
		host: apiEnv.DB_HOST,
		port: apiEnv.DB_PORT,
		database: apiEnv.DB_NAME,
		ssl: false,
	},
	verbose: true,
	strict: true,
});

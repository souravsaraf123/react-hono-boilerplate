import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
	path: '.env',
	quiet: true,
});

export const envSchema = z.object({
	DB_USER: z.string(),
	DB_PASSWORD: z.string(),
	DB_HOST: z.string(),
	DB_PORT: z.coerce.number(),
	DB_NAME: z.string(),
	DB_SCHEMA: z.string(),
	API_PORT: z.coerce.number(),
	AI_API_KEY: z.string(),
});

const { data, error } = envSchema.safeParse(process.env);

if (error)
{
	console.error('Missing or invalid environment variables:', error.issues.map(issue => issue.path.join('.')).join(', '));
	process.exit(1);
}

export const apiEnv = data;

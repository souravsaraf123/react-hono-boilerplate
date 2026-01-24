import { closeDb, db } from '@api/db/connection';
import { apiEnv } from '@api/config/apiEnv';

async function main()
{
	try
	{
		// Drop all tables in the public schema
		await db.execute(`
            DO $$ 
            DECLARE 
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname in ('${apiEnv.DB_SCHEMA}', 'drizzle')) LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        `);

		console.log('All tables dropped successfully');
	}
	catch (error)
	{
		console.error('Error dropping tables:', error);
		throw error;
	}
	finally
	{
		await closeDb();
	}
}

main();

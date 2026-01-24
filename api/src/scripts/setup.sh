#!/bin/bash

source .env

PGPASSWORD=$DB_PASSWORD psql --username=$DB_USER --host=$DB_HOST --port=$DB_PORT --command="CREATE DATABASE $DB_NAME;"

npm run db:push

npx tsx src/scripts/seedUsers.ts
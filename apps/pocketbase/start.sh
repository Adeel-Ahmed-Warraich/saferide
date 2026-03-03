#!/bin/sh

# Run migrations
./pocketbase migrate up --dir=/pb_data --migrationsDir=/pb_migrations

# Create or update superuser (upsert works whether it exists or not)
./pocketbase superuser upsert "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD" --dir=/pb_data

# Start PocketBase
exec ./pocketbase serve \
  --http=0.0.0.0:8090 \
  --dir=/pb_data \
  --migrationsDir=/pb_migrations
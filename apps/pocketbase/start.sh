#!/bin/sh

# Run migrations
./pocketbase migrate up --dir=/pb_data --migrationsDir=/pb_migrations

# Create superuser if env vars are set
if [ -n "$PB_ADMIN_EMAIL" ] && [ -n "$PB_ADMIN_PASSWORD" ]; then
  ./pocketbase superuser create "$PB_ADMIN_EMAIL" "$PB_ADMIN_PASSWORD" --dir=/pb_data || echo "Superuser may already exist"
fi

# Start PocketBase
exec ./pocketbase serve \
  --http=0.0.0.0:8090 \
  --dir=/pb_data \
  --migrationsDir=/pb_migrations
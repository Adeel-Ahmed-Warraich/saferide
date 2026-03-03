#!/bin/sh

./pocketbase migrate up --dir=/pb_data --migrationsDir=/pb_migrations

# Force update superuser password every startup
./pocketbase superuser update admin@saferide.com.pk Admin@23335 --dir=/pb_data 2>/dev/null || \
./pocketbase superuser create admin@saferide.com.pk Admin@23335 --dir=/pb_data 2>/dev/null || \
echo "Superuser setup done"

exec ./pocketbase serve \
  --http=0.0.0.0:8090 \
  --dir=/pb_data \
  --migrationsDir=/pb_migrations
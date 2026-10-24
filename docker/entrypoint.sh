#!/bin/sh
set -e

echo "Applying database migrations…"
prisma migrate deploy --schema ./prisma/schema.prisma

echo "Seeding (idempotent)…"
node prisma/seed.js

exec node server.js

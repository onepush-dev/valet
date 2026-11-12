#!/bin/sh
# Railway start wrapper for Valet: one volume, sign-in on, first account seeded. Then runs upstream as uid "node".
set -e
CONF_DIR="$(dirname "$VALET_CONFIG")"
mkdir -p "$CONF_DIR" "$VALET_DATA"
if [ ! -f "$VALET_CONFIG" ]; then
  cp /opt/railway/config.yaml "$VALET_CONFIG"
  echo "railway: seeded $VALET_CONFIG (auth.mode: local)"
fi
chown -R node:node /data 2>/dev/null || true
if [ -n "$VALET_ADMIN_PASSWORD" ]; then
  su-exec node node /opt/railway/seed-admin.mjs
fi
cd /app
exec su-exec node node dist/server.js

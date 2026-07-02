#!/bin/sh
set -e

npx sequelize-cli db:migrate

if [ "$SEED_MODE" = "true" ] || [ "$SEED_MODE" = "seed" ]; then
  npx sequelize-cli db:seed:all || true
fi

node dist/server.js

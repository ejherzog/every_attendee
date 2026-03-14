# Drizzle-kit doesn't pass dbCredentials.ssl to pg when using url, so cert verification fails. This only affects the release dyno.
release: NODE_TLS_REJECT_UNAUTHORIZED=0 npm run db:migrate
web: node build/index.js

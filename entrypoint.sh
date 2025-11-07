#!/bin/sh
set -e

echo "🚀 Waiting for database..."
until nc -z "${POSTGRES_HOST:-db}" "${POSTGRES_PORT:-5432}"; do
  echo "⏳ Still waiting for Postgres..."
  sleep 1
done
echo "✅ Database is up!"

# Run migrations
python manage.py migrate --noinput || true

# Run collectstatic (ignore since not configured yet)
python manage.py collectstatic --noinput || true

# Run the server (to be replaced with gunicorn later)
exec "$@"

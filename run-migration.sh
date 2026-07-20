#!/bin/bash
# Run this script to execute the database migration on your Supabase instance
# Usage: bash run-migration.sh

SUPABASE_URL="https://bxjulwdhpqxvvuhzsepi.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4anVsd2RocHF4dnZ1aHpzZXBpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDQ3MDQwNywiZXhwIjoyMTAwMDQ2NDA3fQ.iDXSWXgXxbRBF-3xJfQw0K80_8Rha-91sA-YPe0OnQc"

echo "Running migration..."
SQL=$(cat supabase/migrations/001_initial_schema.sql)

# Escape the SQL for JSON
ESCAPED_SQL=$(echo "$SQL" | python3 -c "import sys, json; print(json.dumps(sys.stdin.read()))")

curl -X POST "$SUPABASE_URL/rest/v1/rpc/query" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $ESCAPED_SQL}"

echo ""
echo "Migration complete!"

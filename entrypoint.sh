#!/bin/sh
# Dynamically collect all NG_APP_ env vars and format them as a JS object
# We create a JSON-like string: key1: "val1", key2: "val2"
# Note: This handles basic string values.
ENV_JSON=$(env | grep '^NG_APP_' | sed 's/=/": "/' | sed 's/^/    "/' | sed 's/$/",/' | sed '$ s/,$//')

# Replace the placeholder in all index.html files
# We use a custom placeholder __NG_APP_ENV_PAYLOAD__
find /usr/share/nginx/html -name "index.html" -exec sh -c '
  export ENV_JSON="$1"
  envsubst "\$ENV_JSON" < "$2" > "$2.tmp" && mv "$2.tmp" "$2"
' -- "$ENV_JSON" {} \;

# Replace PORT and other environment variables in Nginx configuration
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'

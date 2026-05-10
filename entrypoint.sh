#!/bin/sh
# Dynamically collect all NG_APP_ env vars for envsubst
NG_APP_VARS=$(env | grep '^NG_APP_' | cut -d= -f1 | sed 's/^/\${/' | sed 's/$/}/' | tr '\n' ',')

# Replace Angular environment variables in index.html for each language directory
for dir in /usr/share/nginx/html/*/; do
    if [ -f "$dir/index.html" ]; then
        echo "Processing $dir/index.html"
        envsubst "$NG_APP_VARS" \
          < "$dir/index.html" \
          > "$dir/index.html.tmp" && \
          mv "$dir/index.html.tmp" "$dir/index.html"
    fi
done


# Replace PORT and other environment variables in Nginx configuration
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'

#!/bin/sh
# Dynamically collect all NG_APP_ env vars for envsubst
NG_APP_VARS=$(env | grep '^NG_APP_' | cut -d= -f1 | sed 's/^/\${/' | sed 's/$/}/' | tr '\n' ',')

# Replace Angular environment variables in index.html for each language
envsubst "$NG_APP_VARS" \
  < /usr/share/nginx/html/en/index.html \
  > /usr/share/nginx/html/en/index.html.tmp && \
  mv /usr/share/nginx/html/en/index.html.tmp /usr/share/nginx/html/en/index.html

envsubst "$NG_APP_VARS" \
  < /usr/share/nginx/html/fr/index.html \
  > /usr/share/nginx/html/fr/index.html.tmp && \
  mv /usr/share/nginx/html/fr/index.html.tmp /usr/share/nginx/html/fr/index.html


# Replace PORT and other environment variables in Nginx configuration
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'

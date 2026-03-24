#!/bin/sh
# Dynamically collect all NG_APP_ env vars for envsubst
NG_APP_VARS=$(env | grep '^NG_APP_' | cut -d= -f1 | sed 's/^/\${/' | sed 's/$/}/' | tr '\n' ',')

envsubst "$NG_APP_VARS" \
  < /usr/share/nginx/html/index.html \
  > /usr/share/nginx/html/index.html.tmp && \
  mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'

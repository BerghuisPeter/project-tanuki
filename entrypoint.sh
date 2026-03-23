#!/bin/sh

# Set the path to the config file
CONFIG_FILE="/usr/share/nginx/html/assets/config.json"
NGINX_CONF_TEMPLATE="/etc/nginx/templates/nginx.conf.template"
NGINX_CONF="/etc/nginx/nginx.conf"

# Ensure PORT environment variable is set for GCP and substitution
if [ -z "$PORT" ]; then
  export PORT=8080
fi

# Run envsubst on nginx config template
# We only want to substitute ${PORT} in the nginx configuration
# The standard nginx docker image logic expects templates in /etc/nginx/templates/
# and it outputs them to /etc/nginx/conf.d/.
# But since variable-nginx.conf is a FULL nginx.conf, we should overwrite /etc/nginx/nginx.conf.
envsubst '${PORT}' < "$NGINX_CONF_TEMPLATE" > "$NGINX_CONF"

# Start the JSON object
echo "{" > $CONFIG_FILE

# Get all environment variables and format them as JSON
env | while IFS='=' read -r key value; do
  # Skip if key is empty
  if [ -n "$key" ]; then
    # Escape double quotes in value if any
    escaped_value=$(echo "$value" | sed 's/"/\\"/g')
    echo "  \"$key\": \"$escaped_value\"," >> $CONFIG_FILE
  fi
done

# Remove the trailing comma from the last entry
# This is a bit tricky with shell, let's use a temporary file or sed
sed -i '$ s/,$//' $CONFIG_FILE

# End the JSON object
echo "}" >> $CONFIG_FILE

# Start nginx
exec nginx -g 'daemon off;'

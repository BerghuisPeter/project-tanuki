#!/bin/sh

# Set the path to the config file
CONFIG_FILE="/usr/share/nginx/html/assets/config.json"

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

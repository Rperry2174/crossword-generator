#!/bin/sh

# Set default values
export PUBLIC_URL=${PUBLIC_URL:-""}
export BACKEND_HOST=${BACKEND_HOST:-"backend"}

echo "Processing PUBLIC_URL: '${PUBLIC_URL}'"
echo "Processing BACKEND_HOST: '${BACKEND_HOST}'"

# Replace PUBLIC_URL in HTML files
find /usr/share/nginx/html -name "*.html" -exec sed -i "s|%PUBLIC_URL%|${PUBLIC_URL}|g" {} \;

# If PUBLIC_URL is set and not empty, add base tag for proper routing
if [ -n "$PUBLIC_URL" ] && [ "$PUBLIC_URL" != "" ]; then
    echo "Adding base tag for PUBLIC_URL: ${PUBLIC_URL}"
    find /usr/share/nginx/html -name "*.html" -exec sed -i "s|<head>|<head><base href=\"${PUBLIC_URL}/\">|" {} \;
fi

# Replace BACKEND_HOST in nginx config  
envsubst '${BACKEND_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
# Frontend Dockerfile for Crossword Generator React App
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Build with relative paths - PUBLIC_URL will be handled at runtime

# Copy package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY public/ ./public/
COPY src/ ./src/
COPY tsconfig.json ./

# Build the application
RUN npm run build

# Add PUBLIC_URL placeholder to HTML files for runtime substitution
RUN find build -name "*.html" -exec sed -i 's|href="\./|href="%PUBLIC_URL%/|g' {} \; && \
    find build -name "*.html" -exec sed -i 's|src="\./|src="%PUBLIC_URL%/|g' {} \;

# Production stage with Nginx
FROM nginx:alpine

# Set default environment variables
ENV BACKEND_HOST=backend
ENV PUBLIC_URL=""

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/entrypoint.sh"]
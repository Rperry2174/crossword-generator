# Frontend Dockerfile for Crossword Generator React App
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

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

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
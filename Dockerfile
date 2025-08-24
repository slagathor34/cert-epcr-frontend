# Multi-stage Dockerfile for CERT Command Center Frontend

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for production build
ENV REACT_APP_ENV=production
ENV GENERATE_SOURCEMAP=false

# Build the application for production
RUN npm run build

# Stage 2: Production server with Nginx
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Add labels for better container management
LABEL maintainer="CERT Command Center"
LABEL version="1.1.0"
LABEL description="CERT Command Center - Emergency Management System Frontend"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx (running as root for port 80, but nginx workers will drop privileges)
CMD ["nginx", "-g", "daemon off;"]
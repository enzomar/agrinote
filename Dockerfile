# Stage 1: Build the PWA
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies first for caching
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build Ionic React PWA (default output: /www or /dist)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built PWA to Nginx
COPY --from=builder /app/www /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

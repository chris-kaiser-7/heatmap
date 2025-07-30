# Stage 1: Build the React TypeScript app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app and build it
COPY ./src ./src/
COPY ./public ./public/
COPY ./tsconfig.json .
RUN npm run build

# Stage 2: Serve the production build using a lightweight web server
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

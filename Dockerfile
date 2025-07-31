FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm --version
RUN npm install --loglevel=verbose

COPY . .
RUN npm run build

# Stage 2: Serve the production build using a lightweight web server
FROM nginx:alpine AS production

# Remove default nginx static assets
# RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

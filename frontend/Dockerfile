# syntax=docker/dockerfile:1.6
# ── Stage 1: build the Vite + React SPA ───────────────────────────────────────
FROM node:20-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# ── Stage 2: serve with nginx ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

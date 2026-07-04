# Multi stage build. Produces a small static image that the City of Johannesburg
# can run on Azure App Service, Azure Container Apps, or on premises with no
# change to the codebase.

# 1. Build the static site
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Serve the static output with nginx
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: replace default nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

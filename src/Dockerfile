FROM node:14.9 AS builder

WORKDIR /app

COPY . .

RUN npm run build


FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build .

CMD ["nginx", "-g", "daemon off;"]
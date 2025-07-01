# 1. Базовий образ для білду
FROM node:18 AS builder

# Робоча директорія
WORKDIR /app

# Копіюємо package файли і ставимо залежності
COPY package*.json ./
RUN npm install

# Копіюємо весь код і білдимо
COPY . .
RUN npm run build

# 2. Nginx для роздачі
FROM nginx:alpine

# Копіюємо готовий білд у стандартну папку Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копіюємо кастомний конфіг (опціонально)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

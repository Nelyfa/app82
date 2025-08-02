# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем простой HTTP сервер
RUN npm install -g serve

# Открываем порт 82
EXPOSE 82

# Запускаем приложение на порту 82
CMD ["serve", "-s", "dist", "-l", "82"]
#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Название приложения
APP_NAME="word-counter-app"
PORT=82

echo -e "${BLUE}=== Настройка приложения подсчета слов ===${NC}"
echo ""

# Функция для проверки установки Docker
check_docker() {
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}✓ Docker найден${NC}"
        return 0
    else
        echo -e "${RED}✗ Docker не найден${NC}"
        return 1
    fi
}

# Функция для установки Docker
install_docker() {
    echo -e "${YELLOW}Устанавливаем Docker...${NC}"
    
    # Определяем операционную систему
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "Обнаружена Linux система"
        
        # Обновляем пакеты
        sudo apt-get update
        
        # Устанавливаем необходимые пакеты
        sudo apt-get install -y \
            ca-certificates \
            curl \
            gnupg \
            lsb-release
        
        # Добавляем официальный GPG ключ Docker
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        
        # Добавляем репозиторий Docker
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Обновляем пакеты и устанавливаем Docker
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Добавляем пользователя в группу docker
        sudo usermod -aG docker $USER
        
        echo -e "${GREEN}✓ Docker установлен успешно${NC}"
        echo -e "${YELLOW}Примечание: Возможно потребуется перезайти в систему для применения прав группы docker${NC}"
        
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "Обнаружена macOS система"
        
        if command -v brew &> /dev/null; then
            echo "Устанавливаем Docker через Homebrew..."
            brew install --cask docker
        else
            echo -e "${RED}Homebrew не найден. Пожалуйста, установите Docker Desktop вручную с https://www.docker.com/products/docker-desktop${NC}"
            exit 1
        fi
        
    else
        echo -e "${RED}Неподдерживаемая операционная система. Пожалуйста, установите Docker вручную.${NC}"
        exit 1
    fi
}

# Функция для запуска приложения
run_app() {
    echo -e "${BLUE}Запускаем приложение...${NC}"
    
    # Останавливаем и удаляем существующий контейнер если он есть
    if docker ps -a --format 'table {{.Names}}' | grep -q "^${APP_NAME}$"; then
        echo "Останавливаем существующий контейнер..."
        docker stop $APP_NAME
        docker rm $APP_NAME
    fi
    
    # Собираем Docker образ
    echo "Собираем Docker образ..."
    docker build -t $APP_NAME .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Образ собран успешно${NC}"
    else
        echo -e "${RED}✗ Ошибка при сборке образа${NC}"
        exit 1
    fi
    
    # Запускаем контейнер
    echo "Запускаем контейнер на порту $PORT..."
    docker run -d --name $APP_NAME -p $PORT:$PORT $APP_NAME
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Приложение запущено успешно!${NC}"
        echo ""
        echo -e "${BLUE}Приложение доступно по адресу: http://localhost:$PORT${NC}"
        echo ""
        echo "Полезные команды:"
        echo "  Остановить:  docker stop $APP_NAME"
        echo "  Запустить:   docker start $APP_NAME"
        echo "  Логи:        docker logs $APP_NAME"
        echo "  Удалить:     docker rm $APP_NAME"
    else
        echo -e "${RED}✗ Ошибка при запуске контейнера${NC}"
        exit 1
    fi
}

# Основная логика
main() {
    # Проверяем наличие Docker
    if check_docker; then
        # Docker установлен, проверяем что он запущен
        if docker info &> /dev/null; then
            echo -e "${GREEN}✓ Docker запущен и готов к работе${NC}"
            run_app
        else
            echo -e "${YELLOW}Docker установлен, но не запущен. Запускаем Docker...${NC}"
            
            # Пытаемся запустить Docker
            if [[ "$OSTYPE" == "linux-gnu"* ]]; then
                sudo systemctl start docker
                sudo systemctl enable docker
            elif [[ "$OSTYPE" == "darwin"* ]]; then
                open -a Docker
                echo "Ожидаем запуска Docker Desktop..."
                sleep 10
            fi
            
            # Проверяем снова
            if docker info &> /dev/null; then
                echo -e "${GREEN}✓ Docker запущен${NC}"
                run_app
            else
                echo -e "${RED}✗ Не удалось запустить Docker. Пожалуйста, запустите его вручную.${NC}"
                exit 1
            fi
        fi
    else
        # Docker не установлен
        echo -e "${YELLOW}Docker не найден. Хотите установить его автоматически? (y/n)${NC}"
        read -r response
        
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            install_docker
            
            # После установки пытаемся запустить
            if check_docker; then
                echo -e "${GREEN}Перезапустите скрипт после перезагрузки терминала${NC}"
            else
                echo -e "${RED}Установка не удалась${NC}"
                exit 1
            fi
        else
            echo -e "${YELLOW}Установка отменена. Пожалуйста, установите Docker вручную и запустите скрипт снова.${NC}"
            exit 1
        fi
    fi
}

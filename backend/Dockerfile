# 1. Базовий образ Python
FROM python:3.11

# 2. Робоча директорія
WORKDIR /app

# 3. Копіюємо requirements.txt окремо — для кешу при збірці
COPY requirements.txt .

# 4. Встановлюємо залежності
RUN pip install --no-cache-dir -r requirements.txt

# 5. Копіюємо тільки потрібні файли (і папки)
COPY main.py ./
COPY .env .env
COPY src/ ./src

# 6. Відкриваємо порт (FastAPI)
EXPOSE 8000

# 7. Команда запуску
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM --platform=linux/amd64 python:3.11-slim

RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "echo $CA_CERT_BASE64 | base64 -d > /etc/ssl/ca.pem && python manage.py migrate --settings=hayyak.settings.prod && gunicorn hayyak.wsgi:application --bind 0.0.0.0:8000"]
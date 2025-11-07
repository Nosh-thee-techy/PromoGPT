FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /code

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt /code/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /code/

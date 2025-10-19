FROM node:18-alpine AS frontend

WORKDIR /app
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ .

# React dev server (for development)
CMD ["npm", "start"]


FROM python:3.10-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip 
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000 

# --- Stage 1: build frontend with a real Node image ---
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY ./frontend ./
RUN npm run build

# --- Stage 2: python runtime ---
FROM python:3.12-slim
WORKDIR /app

COPY ./backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

ENV PORT=8080
EXPOSE 8080

# shell form so $PORT is expanded at runtime
CMD gunicorn --bind 0.0.0.0:$PORT app:app

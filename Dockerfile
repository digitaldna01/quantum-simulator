# 1. 먼저 Node를 설치해서 frontend 빌드
FROM node:18 as frontend

WORKDIR /app

COPY frontend ./frontend
WORKDIR /app/frontend

RUN npm install --legacy-peer-deps
RUN npm run build

# 2. 그 다음 Python 이미지로 backend 준비
FROM python:3.12-slim

# 필수 패키지 설치
RUN apt-get update && apt-get install -y gcc

WORKDIR /app

# frontend에서 빌드한 결과 복사
COPY --from=frontend /app/frontend/dist ./frontend/dist

# backend 코드 복사
COPY backend ./backend

# backend에 필요한 패키지 설치
WORKDIR /app/backend
RUN pip install --no-cache-dir -r requirements.txt

# 환경변수: Railway에서 포트 지정할 때 사용
ENV PORT 8080

# Flask 실행 (Gunicorn으로 실행)
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
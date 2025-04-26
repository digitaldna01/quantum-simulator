# 1단계: Frontend build
FROM node:18 AS frontend

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps
COPY frontend .
RUN npm run build

# 2단계: Backend build
FROM python:3.12-slim

# 작업 디렉토리 생성
WORKDIR /app

# 필요한 파일 복사
COPY backend backend/
COPY --from=frontend /app/frontend/dist backend/frontend/dist
COPY requirements.txt .

# 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 환경변수 설정
ENV PORT=10000
ENV FLASK_ENV=production

# 포트 오픈
EXPOSE 10000

# 서버 시작
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "backend.app:app"]
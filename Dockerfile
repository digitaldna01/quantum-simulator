# 1. 베이스 이미지
FROM python:3.12-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. frontend와 backend 코드 복사
COPY ./frontend ./frontend
COPY ./backend ./backend

# 4. backend 기준으로 이동
WORKDIR /app/frontend

# 5. frontend 의존성 설치 및 빌드
RUN apt-get update && apt-get install -y npm && \
    npm install --legacy-peer-deps && npm run build

# 6. backend로 다시 이동
WORKDIR /app/backend

# 7. Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 8. PORT 환경변수 받기 (Railway에서 $PORT 자동 지정)
ENV PORT=8080

# 9. 앱 실행 (!!! 여기 주의 !!!)
CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "app:app"]
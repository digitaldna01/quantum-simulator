#!/bin/bash

# 백엔드 실행 (백그라운드)
cd backend
python3.10 app.py &

# 프론트엔드 실행
cd ../frontend
npm run dev
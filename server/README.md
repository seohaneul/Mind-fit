# Mind-Fit Backend Server

마음 상태 기반 운동 및 공공시설 추천 시스템의 백엔드 API 서버

## 🚀 기술 스택

- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MongoDB (Mongoose 8.20.0)
- **Additional**: CORS, dotenv, csv-parser

## 📁 프로젝트 구조

```
server/
├── index.js              # 메인 서버 파일
├── .env                  # 환경 변수 설정
├── package.json          # 의존성 관리
├── routes/               # API 라우트
│   ├── facilities.js     # 시설 검색/근처 검색 API
│   ├── stats.js          # 통계 데이터 API
│   └── logs.js           # 사용자 기록 API (Physical & Mental)
├── model/                # MongoDB 스키마/모델
│   ├── Facility.js       # 시설 모델 (GeoJSON 지원)
│   ├── Program.js        # 프로그램 모델
│   ├── stat.js           # 통계 모델
│   ├── PhysicalLog.js    # 체력 기록 모델
│   ├── MentalLog.js      # 마음 기록 모델
│   └── user.js           # 사용자 모델
└── data/                 # CSV 데이터 파일
    ├── kspo_measurements.csv   # 체력측정 데이터
    ├── kspo_programs.csv       # 프로그램 데이터
    └── kspo_facilities.csv     # 시설 데이터
```

## ⚙️ 환경 설정

### 1. MongoDB 설치 및 실행

**Option A: Local MongoDB (권장)**
```bash
# MongoDB 설치 (Windows)
# https://www.mongodb.com/try/download/community 에서 다운로드

# MongoDB 실행
mongod
```

**Option B: MongoDB Atlas (클라우드)**
- https://www.mongodb.com/cloud/atlas 에서 무료 클러스터 생성
- 연결 문자열을 `.env` 파일에 추가

### 2. 환경 변수 설정

`.env` 파일이 자동 생성되었습니다. 필요시 수정하세요:

```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/mindfit
NODE_ENV=development
```

### 3. 의존성 설치

```bash
npm install
```

## 🎯 실행 방법

### 개발 모드
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버가 실행되면 다음과 같이 표시됩니다:
```
============================================================
🚀 Mind-Fit Server Started
============================================================
📡 Server running on: http://localhost:3001
🌍 Environment: development
📊 Database: ✅ Connected
============================================================
```

## 📡 API 엔드포인트

### Health Check
```
GET /health
```
서버 상태 확인

### Facilities (시설)
```
GET /api/facilities              # 모든 시설 조회 (limit 100)
GET /api/facilities/nearby?lat=37.5&lon=127.0  # 위치 기반 근처 시설 (5km)
GET /api/facilities/search?keyword=요가         # 키워드 검색
```

### Programs (프로그램)
```
GET /api/programs                # 모든 프로그램 조회
POST /api/programs               # 프로그램 생성
```

### Stats (통계)
```
GET /api/stats                   # 모든 통계 데이터
GET /api/stats?ageGroup=20s&gender=M  # 필터링된 통계
GET /api/stats/average?ageGroup=20s&gender=M  # 평균값 계산
```

### Logs (기록)

**Physical Logs (체력 기록)**
```
POST /api/logs/physical          # 체력 기록 저장
GET /api/logs/physical           # 모든 체력 기록 조회
GET /api/logs/physical/latest    # 최근 체력 기록 조회
```

**Mental Logs (마음 기록)**
```
POST /api/logs/mental            # 마음 상태 기록 저장
GET /api/logs/mental             # 모든 마음 기록 조회
GET /api/logs/mental/latest      # 최근 마음 기록 조회
```

## 🔧 트러블슈팅

### MongoDB 연결 오류
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**해결 방법:**
1. MongoDB가 실행 중인지 확인
2. `.env` 파일의 `MONGO_URI` 확인
3. MongoDB 포트 확인 (기본: 27017)

### 포트 충돌
```
Error: listen EADDRINUSE: address already in use :::3001
```

**해결 방법:**
1. `.env` 파일에서 `PORT` 변경
2. 또는 실행 중인 프로세스 종료

## 🎨 개선 사항

### ✅ 구현된 기능
- [x] 환경 변수 설정 (.env)
- [x] 요청 로깅 미들웨어
- [x] 에러 핸들링 개선
- [x] Health check 엔드포인트 강화
- [x] Stats 라우트 필터링 및 평균 계산
- [x] Logs 라우트 Mental 지원 추가
- [x] Graceful shutdown 구현

### 🚧 향후 개선 가능 항목
- [ ] JWT 인증 시스템
- [ ] Rate limiting
- [ ] API 문서화 (Swagger)
- [ ] 단위 테스트
- [ ] CSV 데이터 자동 임포트 스크립트
- [ ] Redis 캐싱

## 📝 라이센스

KSPO Mind-Fit Project

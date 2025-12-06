# Mind-Fit

마음 상태 기반 운동 및 공공시설 추천 시스템

## 🎯 프로젝트 소개

KSPO(국민체육진흥공단) 데이터를 활용하여 사용자의 마음 상태와 체력 수준을 분석하고, AI 기반으로 맞춤형 운동과 공공 체육시설을 추천하는 풀스택 웹 애플리케이션입니다.

### 주요 기능
- 🎨 **프리미엄 랜딩 페이지**: 글래스모피즘과 애니메이션 효과
- 📊 **체력 분석 대시보드**: 평균 대비 내 기록 시각화
- 🤖 **Gemini AI 추천**: 마음 상태 기반 운동 처방
- 🏢 **시설 검색**: 키워드 및 위치 기반 공공시설 찾기
- 📈 **통계 데이터**: 연령대/성별 평균 체력 데이터

## 🏗️ 기술 스택

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 5.4.11
- **Routing**: React Router DOM 7.9.6
- **Styling**: TailwindCSS 4.1.17 + Custom CSS
- **Charts**: Recharts 3.4.1
- **AI**: Google Generative AI (Gemini 2.5 Flash)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.1.0
- **Database**: MongoDB (Mongoose 8.20.0)
- **API**: RESTful API
- **CORS**: cors 2.8.5

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / Railway
- **Database**: MongoDB Atlas
- **Version Control**: Git

## 📁 프로젝트 구조

```
Mind-Fit/
├── client/                 # 프론트엔드 (React + Vite)
│   ├── src/
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LandingPage.css
│   │   │   └── Dashboard.jsx
│   │   ├── components/    # 재사용 컴포넌트
│   │   │   ├── LogForm.jsx
│   │   │   └── Recommendation.jsx
│   │   ├── api/           # API 클라이언트
│   │   │   └── gemini.js
│   │   ├── assets/        # 이미지 및 정적 파일
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # 백엔드 (Express + MongoDB)
│   ├── routes/            # API 라우트
│   │   ├── facilities.js
│   │   ├── stats.js
│   │   └── logs.js
│   ├── model/             # MongoDB 스키마
│   │   ├── Facility.js
│   │   ├── Program.js
│   │   ├── stat.js
│   │   ├── PhysicalLog.js
│   │   ├── MentalLog.js
│   │   └── user.js
│   ├── data/              # CSV 데이터
│   │   ├── kspo_measurements.csv
│   │   ├── kspo_programs.csv
│   │   └── kspo_facilities.csv
│   ├── index.js           # 서버 진입점
│   ├── package.json
│   └── README.md
│
├── vercel.json            # Vercel 배포 설정
├── .gitignore
├── DEPLOYMENT.md          # 배포 가이드
└── README.md
```

## 🚀 로컬 개발 환경 설정

### 사전 요구사항
- Node.js 18+ 설치
- MongoDB 설치 (로컬) 또는 MongoDB Atlas 계정
- Git 설치

### 1. 프로젝트 클론
```bash
git clone https://github.com/YOUR_USERNAME/mind-fit.git
cd mind-fit
```

### 2. 환경 변수 설정

**프론트엔드** (`client/.env`):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=http://localhost:3001
```

**백엔드** (`server/.env`):
```env
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/mindfit
NODE_ENV=development
```

### 3. 의존성 설치 및 실행

**터미널 1 - 백엔드**:
```bash
cd server
npm install
npm run dev
```

**터미널 2 - 프론트엔드**:
```bash
cd client
npm install
npm run dev
```

### 4. 접속
- **프론트엔드**: http://localhost:5174
- **백엔드**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📡 API 엔드포인트

### Facilities (시설)
```
GET  /api/facilities                        # 모든 시설
GET  /api/facilities/nearby?lat=&lon=       # 근처 시설
GET  /api/facilities/search?keyword=        # 검색
```

### Stats (통계)
```
GET  /api/stats                             # 통계 데이터
GET  /api/stats/average?ageGroup=&gender=   # 평균 계산
```

### Logs (기록)
```
POST /api/logs/physical                     # 체력 기록 저장
GET  /api/logs/physical/latest              # 최근 체력 기록
POST /api/logs/mental                       # 마음 기록 저장
GET  /api/logs/mental/latest                # 최근 마음 기록
```

자세한 API 문서는 `server/README.md` 참조

## 🌐 배포

자세한 배포 가이드는 [`DEPLOYMENT.md`](./DEPLOYMENT.md) 참조

### 간단 배포 (Vercel + Render)

1. **MongoDB Atlas 설정**
   - 무료 클러스터 생성
   - 연결 문자열 복사

2. **백엔드 배포 (Render)**
   - https://render.com 에서 Web Service 생성
   - GitHub 레포 연결, `server` 폴더 지정
   - 환경 변수 설정

3. **프론트엔드 배포 (Vercel)**
   ```bash
   npm install -g vercel
   vercel
   ```

## 🎨 주요 화면

### 랜딩 페이지
- 프리미엄 글래스모피즘 디자인
- 부드러운 애니메이션
- 반응형 레이아웃

### 대시보드
- 체력 지표 비교 차트
- Gemini AI 마음 처방
- 공공시설 추천

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

KSPO Mind-Fit Project © 2025

## 👥 팀

- **개발자**: [Your Name]
- **디자인**: [Designer Name]
- **프로젝트**: 국민체육진흥공단 공모전

## 📞 문의

프로젝트 관련 문의: your-email@example.com

## 🙏 감사의 말

- 국민체육진흥공단(KSPO) - 공공 데이터 제공
- Google - Gemini AI API
- Vercel - 호스팅 플랫폼

---

**Made with ❤️ for a healthier Korea**

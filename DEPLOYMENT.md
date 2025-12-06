# Vercel Mind-Fit 배포 가이드

## 🚀 배포 전략

Mind-Fit은 풀스택 애플리케이션이므로 프론트엔드와 백엔드를 분리하여 배포합니다.

### 아키텍처
```
┌─────────────────┐      API 요청      ┌──────────────────┐
│  Vercel         │  ───────────────→  │  Render/Railway  │
│  (Frontend)     │                     │  (Backend)       │
│  React + Vite   │                     │  Express + Node  │
└─────────────────┘                     └──────────────────┘
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │  MongoDB Atlas   │
                                        │  (Database)      │
                                        └──────────────────┘
```

---

## 📦 1단계: 프론트엔드 Vercel 배포

### 방법 A: Vercel CLI 사용 (추천)

#### 1.1 Vercel CLI 설치
```bash
npm install -g vercel
```

#### 1.2 프로젝트 루트에서 배포
```bash
# Mind-Fit 루트 디렉토리에서
vercel
```

#### 1.3 설정 질문에 답변
```
? Set up and deploy "Mind-Fit"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? mind-fit
? In which directory is your code located? ./client
? Want to override the settings? [y/N] y
? Build Command: npm run build
? Output Directory: dist
? Development Command: npm run dev
```

### 방법 B: Vercel 웹 대시보드 사용

#### 1.1 GitHub에 프로젝트 푸시
```bash
cd "c:\Users\user\Desktop\PROJECT\체육진흥공단 공모전\test\Mind-Fit"
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/mind-fit.git
git push -u origin main
```

#### 1.2 Vercel 대시보드에서 Import
1. https://vercel.com/new 접속
2. GitHub 레포지토리 연결
3. `mind-fit` 프로젝트 선택
4. **Framework Preset**: Vite
5. **Root Directory**: `client`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`

#### 1.3 환경 변수 설정
Vercel 대시보드 → Settings → Environment Variables:
```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🖥️ 2단계: 백엔드 배포

### 옵션 A: Render.com (무료, 추천)

#### 2.1 MongoDB Atlas 설정
1. https://www.mongodb.com/cloud/atlas 접속
2. 무료 클러스터 생성
3. Database Access → Add User (username/password 저장)
4. Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Connect → Connect your application → 연결 문자열 복사
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/mindfit
   ```

#### 2.2 Render에 백엔드 배포
1. https://render.com 회원가입/로그인
2. New → Web Service
3. GitHub 레포지토리 연결
4. 설정:
   ```
   Name: mind-fit-backend
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   ```
5. Environment Variables 추가:
   ```
   MONGO_URI=mongodb+srv://...
   PORT=3001
   NODE_ENV=production
   ```

6. Deploy 버튼 클릭!

#### 2.3 백엔드 URL 얻기
배포 완료 후 URL 복사: `https://mind-fit-backend.onrender.com`

---

### 옵션 B: Railway.app (추천, 더 빠름)

#### 2.1 Railway 배포
1. https://railway.app 접속
2. Start a New Project → Deploy from GitHub repo
3. `mind-fit` 선택
4. Settings:
   ```
   Root Directory: /server
   Start Command: npm start
   ```
5. Variables 탭에서 환경 변수 추가:
   ```
   MONGO_URI=mongodb+srv://...
   PORT=3001
   NODE_ENV=production
   ```

---

## 🔗 3단계: 프론트엔드-백엔드 연결

### 3.1 vercel.json 업데이트
백엔드 URL을 얻은 후, `vercel.json` 수정:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://mind-fit-backend.onrender.com/api/:path*"
    }
  ]
}
```

### 3.2 Vercel 재배포
```bash
vercel --prod
```

---

## ✅ 4단계: 배포 확인

### 체크리스트
- [ ] 프론트엔드 접속: `https://mind-fit.vercel.app`
- [ ] 랜딩 페이지 로드 확인
- [ ] "시작하기" 버튼 클릭 → 대시보드 이동
- [ ] 차트 데이터 로드 확인
- [ ] Gemini AI 추천 기능 테스트
- [ ] 시설 검색 기능 테스트 (백엔드 API 호출)

### 디버깅
Vercel 대시보드 → Deployments → 최신 배포 → Logs 확인

---

## 🔒 보안 설정

### CORS 설정 (server/index.js)
```javascript
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5174",
    "https://mind-fit.vercel.app",
    "https://your-custom-domain.com"
  ],
  credentials: true
}));
```

### 환경 변수 보안
- ✅ `.env` 파일은 절대 GitHub에 푸시하지 마세요
- ✅ `.gitignore`에 `.env` 추가 확인
- ✅ Vercel과 Render에서 환경 변수 설정

---

## 📊 배포 후 성능 최적화

### Vercel 설정
1. **Custom Domain** 연결 (선택사항)
2. **Analytics** 활성화
3. **Edge Network** 자동 활성화 (CDN)

### 캐싱 최적화
`client/vite.config.js`:
```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts'],
          'gemini': ['@google/generative-ai']
        }
      }
    }
  }
});
```

---

## 🐛 자주 발생하는 문제

### 1. API 호출 실패 (404/CORS)
**원인**: 백엔드 URL 미설정
**해결**: `vercel.json`의 `destination` URL 확인

### 2. 환경 변수 누락
**원인**: Vercel/Render에 변수 미설정
**해결**: 대시보드 → Settings → Environment Variables 확인

### 3. MongoDB 연결 실패
**원인**: IP 화이트리스트 미설정
**해결**: MongoDB Atlas → Network Access → 0.0.0.0/0 허용

### 4. 빌드 실패
**원인**: 의존성 문제
**해결**: 
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📞 배포 상태 모니터링

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Logs**: Deployments → 프로젝트 선택 → Functions → Logs

### Render
- **Dashboard**: https://dashboard.render.com
- **Logs**: 서비스 선택 → Logs 탭

---

## 🎉 배포 완료 체크리스트

- [ ] MongoDB Atlas 클러스터 생성 완료
- [ ] 백엔드 Render/Railway 배포 완료
- [ ] 백엔드 환경 변수 설정 완료
- [ ] 백엔드 Health Check 성공 (`/health`)
- [ ] 프론트엔드 Vercel 배포 완료
- [ ] 프론트엔드 환경 변수 설정 완료
- [ ] `vercel.json` rewrites 설정 완료
- [ ] 전체 플로우 테스트 완료
- [ ] 커스텀 도메인 설정 (선택)

---

## 💡 팁

### 무료 티어 제한
- **Vercel**: 무제한 배포, 100GB 대역폭/월
- **Render**: 750시간/월 (1개 서비스 24/7 가능)
- **MongoDB Atlas**: 512MB 무료

### 비용 절감
- Render 무료 티어는 15분 비활동 시 sleep 모드
- 첫 요청 후 재시작에 ~30초 소요
- 프로덕션 사용 시 유료 플랜 고려

---

**배포 준비 완료!** 🚀

다음 단계를 선택하세요:
1. **방법 A**: Vercel CLI로 빠른 배포
2. **방법 B**: GitHub 연결 후 자동 배포

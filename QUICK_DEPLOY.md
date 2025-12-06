# 🚀 빠른 Vercel 배포 가이드

## 방법 선택

### 🎯 방법 1: Vercel 웹 인터페이스 (추천, 가장 쉬움)
### ⚡ 방법 2: Vercel CLI

---

## 🎯 방법 1: Vercel 웹 인터페이스로 배포 (5분)

### Step 1: GitHub에 프로젝트 업로드

#### 1.1 GitHub 레포지토리 생성
1. https://github.com/new 접속
2. Repository name: `mind-fit`
3. Public 선택
4. **Create repository** 클릭

#### 1.2 로컬 프로젝트 푸시
```bash
cd "c:\Users\user\Desktop\PROJECT\체육진흥공단 공모전\test\Mind-Fit"

# Git 초기화 (이미 되어있다면 생략)
git init

# .gitignore 확인
git add .gitignore
git commit -m "Add gitignore"

# 모든 파일 추가
git add .
git commit -m "Initial commit: Mind-Fit project"

# GitHub에 연결 (YOUR_USERNAME을 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/mind-fit.git
git branch -M main
git push -u origin main
```

### Step 2: Vercel에 배포

#### 2.1 Vercel 로그인
1. https://vercel.com 접속
2. **Sign Up** 또는 **Log In**
3. GitHub 계정으로 로그인

#### 2.2 프로젝트 Import
1. 대시보드에서 **Add New...** → **Project** 클릭
2. GitHub 레포지토리 연결 허용
3. `mind-fit` 레포지토리 선택
4. **Import** 클릭

#### 2.3 프로젝트 설정
```
Project Name: mind-fit
Framework Preset: Vite
Root Directory: client          ← 중요!
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 2.4 환경 변수 추가
**Environment Variables** 섹션에서 추가:
```
VITE_GEMINI_API_KEY = your_actual_gemini_api_key
```
(백엔드 배포 후 VITE_API_URL 추가 필요)

#### 2.5 배포!
**Deploy** 버튼 클릭!

✅ 배포 완료 후 URL: `https://mind-fit-xxxxx.vercel.app`

---

## ⚡ 방법 2: Vercel CLI로 배포

### Step 1: Vercel CLI 설치
```bash
npm install -g vercel
```

### Step 2: 로그인
```bash
vercel login
```
이메일 주소 입력 → 이메일 확인 링크 클릭

### Step 3: 배포
```bash
cd "c:\Users\user\Desktop\PROJECT\체육진흥공단 공모전\test\Mind-Fit"
vercel
```

#### 설정 질문에 답변:
```
? Set up and deploy? [Y/n] Y
? Which scope? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? mind-fit
? In which directory is your code located? ./client
? Want to modify the settings? [y/N] Y

Build and Output Settings:
? Build Command: npm run build
? Output Directory: dist
? Development Command: npm run dev
```

#### 환경 변수 설정
```bash
vercel env add VITE_GEMINI_API_KEY
```
값 입력 후 Environment: **Production, Preview, Development** 모두 선택

### Step 4: 프로덕션 배포
```bash
vercel --prod
```

✅ 배포 완료!

---

## 🖥️ 백엔드 배포 (Render)

### Step 1: MongoDB Atlas 설정

#### 1.1 클러스터 생성
1. https://www.mongodb.com/cloud/atlas 접속
2. **Try Free** 클릭 → 계정 생성
3. **Build a Database** → **Free** (M0) 선택
4. Cloud Provider: **AWS**
5. Region: **Seoul (ap-northeast-2)** 또는 가장 가까운 지역
6. Cluster Name: `mindfit`
7. **Create** 클릭

#### 1.2 데이터베이스 유저 생성
1. **Security** → **Database Access** → **Add New Database User**
2. Username: `mindfit_admin`
3. Password: 강력한 비밀번호 생성 (저장해두세요!)
4. **Add User** 클릭

#### 1.3 IP 화이트리스트
1. **Security** → **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** 클릭 (0.0.0.0/0)
3. **Confirm** 클릭

#### 1.4 연결 문자열 복사
1. **Database** → **Connect** → **Connect your application**
2. Driver: **Node.js**, Version: **5.5 or later**
3. 연결 문자열 복사:
   ```
   mongodb+srv://mindfit_admin:<password>@mindfit.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. `<password>` 부분을 실제 비밀번호로 변경
5. 데이터베이스 이름 추가:
   ```
   mongodb+srv://mindfit_admin:yourpassword@mindfit.xxxxx.mongodb.net/mindfit?retryWrites=true&w=majority
   ```

### Step 2: Render에 백엔드 배포

#### 2.1 Render 계정 생성
1. https://render.com 접속
2. **Get Started** → GitHub로 로그인

#### 2.2 Web Service 생성
1. 대시보드에서 **New +** → **Web Service** 클릭
2. **Connect a repository** → `mind-fit` 선택
3. 설정:
   ```
   Name: mind-fit-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: server          ← 중요!
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

#### 2.3 환경 변수 설정
**Environment Variables** 섹션:
```
MONGO_URI = mongodb+srv://mindfit_admin:yourpassword@mindfit.xxxxx.mongodb.net/mindfit
PORT = 3001
NODE_ENV = production
```

#### 2.4 배포!
**Create Web Service** 클릭

⏳ 배포 완료까지 2-3분 소요

✅ 배포 완료 후 URL: `https://mind-fit-backend.onrender.com`

### Step 3: 백엔드 테스트
브라우저에서 접속:
```
https://mind-fit-backend.onrender.com/health
```

응답 예시:
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T13:35:00.000Z",
  "uptime": 123.45,
  "environment": "production",
  "database": "connected"
}
```

---

## 🔗 프론트엔드-백엔드 연결

### Step 1: vercel.json 업데이트
`vercel.json` 파일에서 백엔드 URL 변경:
```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "cd client && npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://mind-fit-backend.onrender.com/api/:path*"
    }
  ]
}
```

### Step 2: 환경 변수 추가
Vercel 대시보드:
1. 프로젝트 선택 → **Settings** → **Environment Variables**
2. 추가:
   ```
   VITE_API_URL = https://mind-fit-backend.onrender.com
   ```
3. **Save** 클릭

### Step 3: 재배포
#### 방법 A: 자동 배포 (GitHub)
```bash
git add .
git commit -m "Update backend URL"
git push
```
Vercel이 자동으로 감지하고 재배포!

#### 방법 B: 수동 배포 (CLI)
```bash
vercel --prod
```

---

## ✅ 배포 확인 체크리스트

### 백엔드 확인
- [ ] Render 대시보드에서 "Live" 상태 확인
- [ ] `https://your-backend.onrender.com/health` 접속 → JSON 응답 확인
- [ ] MongoDB Atlas → Database → Browse Collections → 연결 확인

### 프론트엔드 확인
- [ ] Vercel 대시보드에서 "Ready" 상태 확인
- [ ] `https://your-project.vercel.app` 접속
- [ ] 랜딩 페이지 로드 확인
- [ ] "시작하기" 버튼 → 대시보드 이동
- [ ] 차트 데이터 로드 확인
- [ ] 개발자 도구(F12) → Console → 에러 없음 확인
- [ ] Network 탭 → API 요청 성공 확인

---

## 🐛 문제 해결

### 1. 빌드 실패
**에러**: `Command failed: npm run build`

**해결**:
```bash
# 로컬에서 빌드 테스트
cd client
npm install
npm run build
```
성공하면 `client/dist` 폴더 생성 확인

### 2. API 호출 실패 (404)
**원인**: vercel.json의 rewrites 설정 누락

**해결**: vercel.json 확인, 재배포

### 3. CORS 에러
**에러**: `Access-Control-Allow-Origin`

**해결**: `server/index.js`에서 CORS 설정 확인
```javascript
app.use(cors({
  origin: [
    "https://your-project.vercel.app",
    "http://localhost:5174"
  ]
}));
```

### 4. MongoDB 연결 실패
**에러**: `MongoNetworkError`

**해결**:
1. MongoDB Atlas → Network Access → IP 화이트리스트에 0.0.0.0/0 있는지 확인
2. 연결 문자열 비밀번호 확인
3. Render 환경 변수 `MONGO_URI` 확인

### 5. 환경 변수 미적용
**해결**:
1. Vercel/Render 대시보드에서 변수 확인
2. 재배포 필요 (환경 변수 변경 후)

---

## 📊 배포 후 모니터링

### Vercel
- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: 프로젝트 → Analytics 탭
- **Logs**: Deployments → 최신 배포 → Logs

### Render
- **Dashboard**: https://dashboard.render.com
- **Logs**: 서비스 선택 → Logs 탭 (실시간)
- **Metrics**: Metrics 탭 (CPU, 메모리 사용량)

### MongoDB Atlas
- **Dashboard**: https://cloud.mongodb.com
- **Metrics**: Clusters → Metrics 탭
- **Collections**: Browse Collections

---

## 🎉 축하합니다!

성공적으로 배포되었습니다!

### 배포된 URL
- **프론트엔드**: `https://mind-fit-xxxxx.vercel.app`
- **백엔드**: `https://mind-fit-backend.onrender.com`
- **Health Check**: `https://mind-fit-backend.onrender.com/health`

### 다음 단계
1. **커스텀 도메인** 연결 (선택)
   - Vercel: Settings → Domains
   - 예: `mindfit.com` → `mind-fit.vercel.app`

2. **성능 최적화**
   - Vercel Analytics 활성화
   - Lighthouse 점수 확인

3. **공유하기**
   - GitHub README에 Live Demo 링크 추가
   - 공모전 제출 자료에 URL 포함

---

**배포 완료! 🚀**

문제가 발생하면 다음을 확인하세요:
1. Vercel Deployment Logs
2. Render Service Logs
3. MongoDB Atlas Metrics
4. 브라우저 개발자 도구 Console/Network

Good luck! 💪

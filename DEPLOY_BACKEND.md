# 백엔드 서버 호스팅 배포 가이드 (Render 사용)

Vercel은 프론트엔드(화면)만 보여주는 곳입니다. 로그인과 저장 기능을 사용하려면 백엔드(서버)를 **Render**나 **Railway** 같은 곳에 따로 배포해야 합니다. 무료로 쉽게 할 수 있는 **Render** 배포 방법을 알려드릴게요.

## 1단계: Render 가입 및 접속
1. [Render.com](https://render.com/) 에 접속하여 회원가입/로그인 하세요 (GitHub 아이디로 로그인 추천).

## 2단계: Web Service 생성
1. 대시보드에서 **[New +]** 버튼 클릭 -> **[Web Service]** 선택.
2. **[Build and deploy from a Git repository]** 선택.
3. 연결된 GitHub 계정에서 `Mind-Fit` (현재 프로젝트) 레포지토리를 찾아 **[Connect]** 클릭.

## 3단계: 설정 입력 (중요!)
다음 내용을 정확하게 입력하세요.

*   **Name**: `mind-fit-server` (원하는 이름)
*   **Region**: `Singapore` (속도가 꽤 빠릅니다)
*   **Root Directory**: `server` 
    *   ⚠️ **매우 중요**: 우리는 `server` 폴더 안에 백엔드 코드가 있으므로 반드시 `server`라고 적어야 합니다.
*   **Runtime**: `Node`
*   **Build Command**: `npm install`
*   **Start Command**: `node index.js`
*   **Free Plan** 선택 (무료)

## 4단계: 환경변수 설정
설정 페이지 아래쪽 **[Environment Variables]** 섹션에서 다음 변수를 추가합니다.

1.  **Key**: `MONGO_URI`
    *   **Value**: (사용하시는 MongoDB Atlas 주소. 예: `mongodb+srv://...`)
    *   *팁: 로컬 `.env` 파일에 있는 주소를 그대로 복사하세요.*

**[Create Web Service]** 버튼을 눌러 배포를 시작합니다.

## 5단계: 배포 완료 및 URL 확인
1. 배포가 시작되면 로그가 올라갑니다. `Mind-Fit Server Started` 로그가 보이면 성공입니다.
2. 화면 좌측 상단에 `https://mind-fit-server-xxxx.onrender.com` 같은 **주소(URL)**가 생깁니다. 이 주소를 복사하세요.

## 6단계: 프론트엔드(Vercel)와 연결
이제 Vercel에게 백엔드가 어디 있는지 알려줘야 합니다.

1. **Vercel 대시보드** 접속 -> 해당 프로젝트 -> **[Settings]** -> **[Environment Variables]**.
2. 새로운 변수 추가:
    *   **Key**: `VITE_API_URL`
    *   **Value**: (방금 복사한 Render 서버 주소 ✅)
        *   *주의: 주소 뒤에 `/api`를 붙이지 마세요. 그냥 `.com`으로 끝나야 합니다.*
3. **[Save]** 누르고, Vercel **[Deployments]** 탭으로 가서 최신 배포를 **[Redeploy]** 하거나, Git에 아무 수정사항을 `push` 하면 적용됩니다.

이제 Vercel 사이트에서도 로그인이 정상 작동할 것입니다! 🎉

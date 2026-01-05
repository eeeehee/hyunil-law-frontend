# 🚀 현일 법무법인 프로젝트 - CMD 실행 가이드

## 📁 프로젝트 구조
```
hyunil-law/
├── index.html              # 메인 페이지
├── assets/
│   └── img/               # 이미지 파일들
├── js/                    # JavaScript 파일들
│   ├── firebase-config.js
│   ├── Header.js
│   └── ...
└── pages/
    ├── public/            # 공개 페이지 (로그인, 회원가입 등)
    ├── user/              # 사용자 페이지
    └── admin/             # 관리자 페이지
```

---

## ⚡ 빠른 시작 (3단계)

### 1️⃣ CMD 열기
- `Win + R` → `cmd` 입력 → 엔터

### 2️⃣ 프로젝트 폴더로 이동
```cmd
cd C:\Users\사용자명\Desktop\프로젝트폴더
```

예시:
```cmd
cd C:\Users\eeeeh\Desktop\오픈플로이\법무법인현일\corp_new
```

### 3️⃣ 서버 실행
```cmd
npx http-server -p 8000 -o
```

---

## 🎯 접속 URL

서버가 실행되면 브라우저가 자동으로 열립니다:
```
http://localhost:8000/              # 메인 페이지
http://localhost:8000/pages/public/login.html    # 로그인
http://localhost:8000/pages/admin/admin.html     # 관리자
```

---

## 🔧 다른 실행 방법들

### 방법 A: package.json 사용 (더 빠름)
```cmd
# 1. 처음 한 번만 실행
npm install

# 2. 서버 실행 (이후부터는 이것만!)
npm start
```

### 방법 B: http-server 전역 설치
```cmd
# 1. 전역 설치 (처음 한 번만)
npm install -g http-server

# 2. 서버 실행
http-server -p 8000 -o
```

---

## ⚠️ 현재 발견된 문제 및 해결

### 문제 1: 경로 오류 (중요!)
**증상:** 이미지가 안 보이거나 링크가 안 됨

**원인:** HTML 파일에 `src="="` 같은 잘못된 경로

**해결 방법:**

#### A. 임시 해결 (일단 실행해보기)
- 서버는 정상 실행됨
- 일부 이미지/링크만 작동 안 할 수 있음
- 기능 테스트는 가능

#### B. 완전 해결 (수정 필요)
모든 HTML 파일에서 다음을 찾아 수정:

**찾을 내용:**
```html
src="="
href="="
```

**바꿀 내용:**
```html
src="
href="
```

---

## 🛠️ 자동 수정 스크립트

### PowerShell에서 일괄 수정:
```powershell
# PowerShell 관리자 권한으로 실행 후
Get-ChildItem -Path . -Recurse -Filter *.html | ForEach-Object {
    (Get-Content $_.FullName) -replace 'src="="', 'src="' -replace 'href="="', 'href="' | Set-Content $_.FullName
}
```

### 또는 VS Code에서:
1. `Ctrl + Shift + F` (전체 찾기)
2. "src="=" 검색
3. "src="" 로 모두 바꾸기
4. "href="=" 검색
5. "href="" 로 모두 바꾸기

---

## 📋 실행 체크리스트

### 실행 전 확인:
- [ ] Node.js 설치 확인 (`node -v`)
- [ ] CMD로 프로젝트 폴더 이동
- [ ] `index.html` 파일이 보이는지 확인 (`dir` 입력)

### 실행 후 확인:
- [ ] "Available on:" 메시지 표시
- [ ] http://localhost:8000 접속 가능
- [ ] 메인 페이지 로드 (이미지는 안 보일 수 있음)
- [ ] 콘솔에 치명적 에러 없음

---

## 💡 개발하면서 사용하기

### 캐시 없이 실행 (추천):
```cmd
npx http-server -p 8000 -c-1 -o
```
- `-c-1`: 캐시 비활성화 (수정 사항 즉시 반영)
- `-o`: 브라우저 자동 열기

### 포트 변경:
```cmd
npx http-server -p 3000 -o
```

### 조용히 실행 (로그 최소화):
```cmd
npx http-server -p 8000 -s
```

---

## ❌ 문제 해결

### "npx를 찾을 수 없습니다"
**해결:**
```cmd
npm install -g npx
```

### "포트 8000이 사용 중"
**해결:**
```cmd
# 다른 포트 사용
npx http-server -p 3000 -o
```

### 이미지가 안 보임
**원인:** 경로 오류 (`src="="`)
**해결:** 위의 자동 수정 스크립트 실행

### 페이지 간 이동이 안 됨
**원인:** 링크 경로 오류 (`href="="`)
**해결:** 위의 자동 수정 스크립트 실행

### Firebase 연결 안 됨
**원인:** 
1. 인터넷 연결 확인
2. `js/firebase-config.js` 파일 확인
**해결:** 
- 콘솔에서 정확한 에러 확인 (F12)
- Firebase 설정 검토

---

## 🎓 폴더별 설명

### `/pages/public/`
- 로그인, 회원가입, FAQ 등 공개 페이지
- 누구나 접근 가능

### `/pages/user/`
- 대시보드, 자문 신청 등 사용자 페이지
- 로그인 후 접근 가능

### `/pages/admin/`
- 관리자 전용 페이지
- 관리자 권한 필요

### `/assets/img/`
- 모든 이미지 파일
- 로고, 아이콘, 배경 등

### `/js/`
- 공통 JavaScript 파일
- Firebase 설정, 헤더/푸터 등

---

## 🚀 다음 단계

1. **경로 오류 수정** (위의 스크립트 사용)
2. **기능 테스트**
   - 로그인
   - 페이지 이동
   - Firebase 연결
3. **개발 시작**
   - 파일 수정
   - 브라우저에서 확인
   - 반복

---

## 📞 도움이 필요하면

**확인할 정보:**
1. CMD 스크린샷
2. 브라우저 콘솔 에러 (F12)
3. 어떤 기능이 안 되는지
4. Node.js 버전 (`node -v`)

---

## ✅ 정리

**가장 쉬운 실행 방법:**
```cmd
cd 프로젝트폴더
npx http-server -p 8000 -o
```

**경로 오류 수정 후 사용 추천!**

끝! 🎉

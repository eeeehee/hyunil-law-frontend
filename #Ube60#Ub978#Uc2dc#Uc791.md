# 🚀 초간단 시작 가이드

## ⚡ 가장 쉬운 방법 (클릭 한 번!)

### 방법 1: 배치 파일 사용 (제일 쉬움!)
1. `실행.bat` 파일 **더블클릭**
2. 끝! 자동으로:
   - 경로 오류 수정
   - 서버 시작
   - 브라우저 열림

---

## 📝 CMD로 직접 실행하기

### 1️⃣ CMD 열기
`Win + R` → `cmd` → 엔터

### 2️⃣ 프로젝트 폴더로 이동
```cmd
cd C:\Users\사용자명\Desktop\프로젝트폴더
```

### 3️⃣ 경로 수정 (한 번만)
```cmd
node fix-paths.js
```

### 4️⃣ 서버 실행
```cmd
npx http-server -p 8000 -o
```

---

## 🎯 접속 주소

```
http://localhost:8000/                          메인
http://localhost:8000/pages/public/login.html  로그인
http://localhost:8000/pages/admin/admin.html   관리자
```

---

## ✅ 체크리스트

실행 전:
- [ ] Node.js 설치됨 (CMD에서 `node -v` 확인)
- [ ] 프로젝트 폴더에 `index.html` 있음

실행 후:
- [ ] 브라우저 열림
- [ ] 메인 페이지 표시됨
- [ ] 이미지 잘 보임
- [ ] 링크 클릭 가능

---

## ❌ 문제 생기면

### Node.js 없다고 나옴
→ https://nodejs.org 에서 설치

### 포트 8000 사용 중
→ `npx http-server -p 3000 -o` 다른 포트 사용

### 여전히 이미지 안 보임
→ `node fix-paths.js` 다시 실행

---

## 💡 개발하면서 쓰기

파일 수정 후 바로 반영되게:
```cmd
npx http-server -p 8000 -c-1
```

---

**제일 쉬운 방법: `실행.bat` 더블클릭! 🎉**

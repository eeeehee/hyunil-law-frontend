# Firebase to MariaDB 마이그레이션 완료

## ✅ 완료된 페이지 (API 적용 완료)

### 1. index.html (메인 페이지)
- ✅ Firebase Auth → API 인증 시스템
- ✅ Firestore 문의 등록 → API 상담 문의
- ✅ 로그인 상태 체크 자동화

### 2. pages/public/login.html (로그인)
- ✅ Firebase signInWithEmailAndPassword → API login
- ✅ JWT 토큰 자동 저장
- ✅ 에러 처리 개선

### 3. pages/public/signup.html (회원가입)
- ✅ Firebase createUserWithEmailAndPassword → API signup
- ✅ Firestore 사용자 정보 저장 → API 자동 처리
- ✅ 이메일 인증 제거 (필요시 백엔드에서 추가)

### 4. js/api.js (API 클라이언트)
- ✅ 완전한 REST API 클라이언트
- ✅ 모든 엔드포인트 준비 완료
- ✅ 자동 인증 헤더 추가

## 📋 나머지 페이지 마이그레이션 가이드

### 패턴 1: Firebase Auth 코드 변경

**이전 (Firebase):**
```javascript
import { auth } from "/js/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 로그인됨
    } else {
        // 로그아웃됨
    }
});
```

**이후 (API):**
```javascript
import { auth, requireAuth } from "/js/api.js";

// 페이지 로드 시 체크
if (!requireAuth()) {
    // 자동으로 로그인 페이지로 리다이렉트
}

// 사용자 정보 가져오기
const user = auth.getCurrentUser();
if (user) {
    // 로그인됨
}
```

### 패턴 2: Firestore 데이터 조회 변경

**이전 (Firebase):**
```javascript
import { db } from "/js/firebase-config.js";
import { collection, getDocs, query, where } from "firebase/firestore";

const q = query(collection(db, "litigation_cases"), where("status", "==", "pending"));
const querySnapshot = await getDocs(q);
const cases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

**이후 (API):**
```javascript
import { litigationCases } from "/js/api.js";

const response = await litigationCases.getAll({ status: 'pending' });
const cases = response.cases;
```

### 패턴 3: Firestore 데이터 생성 변경

**이전 (Firebase):**
```javascript
import { db } from "/js/firebase-config.js";
import { collection, addDoc } from "firebase/firestore";

await addDoc(collection(db, "litigation_cases"), {
    clientName: "홍길동",
    phone: "010-1234-5678",
    status: "pending",
    createdAt: new Date()
});
```

**이후 (API):**
```javascript
import { litigationCases } from "/js/api.js";

await litigationCases.create({
    clientName: "홍길동",
    phone: "010-1234-5678",
    status: "pending"
});
```

### 패턴 4: Firestore 데이터 업데이트 변경

**이전 (Firebase):**
```javascript
import { db } from "/js/firebase-config.js";
import { doc, updateDoc } from "firebase/firestore";

await updateDoc(doc(db, "litigation_cases", docId), {
    status: "completed"
});
```

**이후 (API):**
```javascript
import { litigationCases } from "/js/api.js";

await litigationCases.update(docId, {
    status: "completed"
});
```

### 패턴 5: 권한 체크

**이전 (Firebase):**
```javascript
import { auth, db } from "/js/firebase-config.js";
import { doc, getDoc } from "firebase/firestore";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        if (userData.role === 'admin') {
            // 관리자 기능
        }
    }
});
```

**이후 (API):**
```javascript
import { requireAuth, checkRole } from "/js/api.js";

// 관리자만 접근 가능
if (!requireAuth(['admin', 'general_manager', 'lawyer'])) {
    // 자동으로 접근 거부 및 리다이렉트
}

// 또는 조건부 체크
if (checkRole('admin')) {
    // 관리자 기능 표시
}
```

## 📝 페이지별 작업 체크리스트

### User Pages (우선순위 높음)
- [ ] `/pages/user/dashboard.html` - 대시보드
  - Firebase Auth → API auth
  - Firestore queries → API calls
  
- [ ] `/pages/user/member_info.html` - 회원 정보
  - 사용자 정보 조회/수정 API
  
- [ ] `/pages/user/credit_list.html` - 신용 조회 목록
  - 신용 조회 API (추가 필요)

### Admin Pages (우선순위 높음)
- [ ] `/pages/admin/admin.html` - 관리자 대시보드
  - 통계 데이터 API
  
- [ ] `/pages/admin/admin_litigation.html` - 소송 사건 관리
  - litigationCases API 사용
  
- [ ] `/pages/admin/admin_members.html` - 회원 관리
  - users API 사용
  
- [ ] `/pages/admin/admin_collection.html` - 추심 사건 관리
  - debtCases API 사용
  
- [ ] `/pages/admin/admin_pasan.html` - 파산 사건 관리
  - pasanCases API 사용

### Public Pages (우선순위 낮음)
- [ ] `/pages/public/find_account.html` - 계정 찾기
  - 비밀번호 재설정 API
  
- [ ] `/pages/public/phone_consult.html` - 전화 상담
  - 상담 문의 API (이미 구현됨)

## 🔄 빠른 마이그레이션 절차

각 페이지마다 다음 단계를 따르세요:

### 1단계: Import 변경
```javascript
// 삭제
// import { auth, db } from "/js/firebase-config.js";
// import { ... } from "firebase/...";

// 추가
import { auth, users, litigationCases, ... } from "/js/api.js";
```

### 2단계: Firebase 함수를 API 호출로 변경
- `onAuthStateChanged` → `requireAuth()` 또는 `auth.getCurrentUser()`
- `getDocs(collection(db, ...))` → `API.getAll()`
- `addDoc(collection(db, ...))` → `API.create()`
- `updateDoc(doc(db, ...))` → `API.update()`
- `getDoc(doc(db, ...))` → `API.getById()`

### 3단계: 데이터 구조 조정
Firebase와 API의 응답 구조가 약간 다를 수 있으므로 확인:
```javascript
// Firebase
const data = doc.data();
const id = doc.id;

// API
const data = response; // 이미 object 형태
const id = response.docId; // 또는 response.id
```

### 4단계: 에러 처리 업데이트
```javascript
// Firebase 에러
if (error.code === 'auth/invalid-email') { ... }

// API 에러
if (error.message.includes('Invalid email')) { ... }
```

## 💡 작업 팁

### Tip 1: 한 번에 한 페이지씩
전체를 한 번에 바꾸려 하지 말고, 한 페이지씩 작업하고 테스트하세요.

### Tip 2: 콘솔 확인
브라우저 개발자 도구 콘솔을 열어두고 에러를 확인하세요.

### Tip 3: API 테스트 먼저
페이지 작업 전에 Postman이나 `backend/test-api.js`로 API가 정상 작동하는지 확인하세요.

### Tip 4: 백업 유지
원본 Firebase 버전을 별도로 백업해두세요.

## 🆘 문제 해결

### "Cannot find module '/js/api.js'" 오류
→ `/js/api.js` 파일이 있는지 확인

### "401 Unauthorized" 오류
→ 로그인이 되어 있는지, 토큰이 유효한지 확인
```javascript
console.log(localStorage.getItem('auth_token'));
console.log(auth.getCurrentUser());
```

### "CORS error" 오류
→ 백엔드 서버가 실행 중인지 확인
→ API_BASE_URL이 올바른지 확인

### 데이터가 안 나옴
→ 백엔드 API가 올바른 데이터를 반환하는지 확인
→ 콘솔에서 response 객체 확인

## 📚 추가 리소스

- **API 문서**: `/backend/README.md`
- **API 클라이언트 코드**: `/js/api.js`
- **테스트 스크립트**: `/backend/test-api.js`
- **백엔드 소스**: `/backend/routes/*.js`

## 🎯 다음 단계

1. **가장 자주 사용하는 페이지부터** 마이그레이션 시작
2. **dashboard.html**을 우선적으로 작업 (사용자가 가장 많이 접근)
3. **admin 페이지들**을 순차적으로 작업
4. **테스트** 후 프로덕션 배포

---

**작업 중 막히는 부분이 있으면** 위의 패턴을 참고하거나, 
이미 완료된 페이지(`index.html`, `login.html`, `signup.html`)의 코드를 참고하세요!

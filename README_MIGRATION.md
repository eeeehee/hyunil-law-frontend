# Corporate Hyunil Law Frontend

법무그룹 현일 기업 관리 시스템 프론트엔드

## 변경 사항

Firebase에서 MariaDB 기반 REST API로 마이그레이션되었습니다.

## 주요 변경 파일

### 새로 추가된 파일
- `/js/api.js` - REST API 클라이언트 (Firebase 대체)

### 수정된 파일
- `/pages/public/login.html` - API 기반 로그인으로 변경
- 기타 페이지들도 순차적으로 수정 필요

### 제거 예정 파일
- `/js/firebase-config.js` - 더 이상 사용하지 않음

## API 서버 설정

`/js/api.js` 파일의 첫 번째 줄에서 API 서버 주소를 설정할 수 있습니다:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

### 환경별 설정

**로컬 개발 환경:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

**프로덕션 환경:**
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

## 백엔드 서버 실행

프론트엔드를 사용하기 전에 백엔드 서버를 먼저 실행해야 합니다:

```bash
cd backend
npm install
npm run dev
```

## 로컬 서버 실행

프론트엔드는 정적 파일이므로 간단한 HTTP 서버로 실행할 수 있습니다:

### 방법 1: Python 사용
```bash
python -m http.server 8080
```

### 방법 2: Node.js http-server 사용
```bash
npm install -g http-server
http-server -p 8080
```

### 방법 3: VS Code Live Server 확장 사용
VS Code에서 `index.html` 파일을 열고 "Go Live" 버튼 클릭

## 인증 시스템

### 로그인 프로세스

1. 사용자가 이메일/비밀번호 입력
2. `/api/auth/login` 엔드포인트로 POST 요청
3. 성공 시 JWT 토큰과 사용자 정보 반환
4. 토큰을 localStorage에 저장
5. 이후 모든 API 요청에 토큰 포함

### 토큰 저장

```javascript
// 토큰은 자동으로 localStorage에 저장됩니다
localStorage.setItem('auth_token', token);
localStorage.setItem('current_user', JSON.stringify(user));
```

### 로그아웃

```javascript
import { auth } from '/js/api.js';
auth.logout(); // localStorage에서 토큰 제거
```

## API 사용 예시

### 로그인
```javascript
import { auth } from '/js/api.js';

try {
    const response = await auth.login('user@example.com', 'password');
    console.log('로그인 성공:', response.user);
} catch (error) {
    console.error('로그인 실패:', error.message);
}
```

### 사용자 정보 조회
```javascript
import { users } from '/js/api.js';

const currentUser = await users.getMe();
console.log('현재 사용자:', currentUser);
```

### 소송 사건 목록 조회
```javascript
import { litigationCases } from '/js/api.js';

const cases = await litigationCases.getAll({ 
    caseType: 'collection',
    limit: 20 
});
console.log('사건 목록:', cases);
```

### 소송 사건 생성
```javascript
import { litigationCases } from '/js/api.js';

const newCase = await litigationCases.create({
    clientName: '홍길동',
    phone: '010-1234-5678',
    caseName: '손해배상청구',
    caseNumber: '2024가단12345',
    court: '서울중앙지방법원',
    caseType: 'collection',
    status: 'pending'
});
```

## 권한 체크

```javascript
import { requireAuth, checkRole } from '/js/api.js';

// 페이지 로드 시 로그인 체크
if (!requireAuth()) {
    // 자동으로 로그인 페이지로 리다이렉트
}

// 관리자 권한 필요
if (!requireAuth(['admin', 'general_manager'])) {
    // 자동으로 접근 거부 및 리다이렉트
}

// 역할 체크만 (리다이렉트 없음)
if (checkRole('admin')) {
    // 관리자 기능 표시
}
```

## 페이지별 마이그레이션 체크리스트

### 완료된 페이지
- ✅ `/pages/public/login.html` - API 로그인으로 변경

### 작업 필요 페이지

#### Public Pages
- ⬜ `/pages/public/signup.html` - 회원가입
- ⬜ `/pages/public/find_account.html` - 계정 찾기
- ⬜ `/pages/public/phone_consult.html` - 전화 상담 문의

#### User Pages
- ⬜ `/pages/user/dashboard.html` - 대시보드
- ⬜ `/pages/user/member_info.html` - 회원 정보
- ⬜ `/pages/user/credit_list.html` - 신용 조회 목록

#### Admin Pages
- ⬜ `/pages/admin/admin.html` - 관리자 대시보드
- ⬜ `/pages/admin/admin_clients.html` - 고객 관리
- ⬜ `/pages/admin/admin_litigation.html` - 소송 사건 관리
- ⬜ `/pages/admin/admin_collection.html` - 추심 사건 관리
- ⬜ `/pages/admin/admin_pasan.html` - 파산 사건 관리
- ⬜ `/pages/admin/admin_members.html` - 회원 관리

## 개발 가이드라인

### Firebase → API 마이그레이션 패턴

**이전 (Firebase):**
```javascript
import { db } from '/js/firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

const querySnapshot = await getDocs(collection(db, 'litigation_cases'));
const cases = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
}));
```

**이후 (REST API):**
```javascript
import { litigationCases } from '/js/api.js';

const response = await litigationCases.getAll();
const cases = response.cases;
```

### 실시간 업데이트

Firebase의 실시간 리스너는 제거되었습니다. 필요한 경우 폴링 또는 WebSocket을 구현해야 합니다.

### 파일 업로드

Firebase Storage 대신 별도의 파일 업로드 API가 필요합니다.

## 문제 해결

### CORS 오류

백엔드 서버의 CORS 설정을 확인하세요:
```env
CORS_ORIGIN=http://localhost:8080
```

### 401 Unauthorized

- 로그인이 되어 있는지 확인
- localStorage에 토큰이 있는지 확인
- 토큰이 만료되지 않았는지 확인

### 네트워크 오류

- 백엔드 서버가 실행 중인지 확인
- API_BASE_URL이 올바른지 확인

## 다음 단계

1. 나머지 페이지들을 API 기반으로 마이그레이션
2. 에러 처리 개선
3. 로딩 상태 표시 추가
4. 실시간 업데이트 구현 (필요시)
5. 파일 업로드 기능 구현

## 참고 사항

- JWT 토큰은 24시간 후 만료됩니다
- 토큰 만료 시 자동으로 로그아웃되며 로그인 페이지로 리다이렉트됩니다
- 모든 API 요청은 JSON 형식을 사용합니다

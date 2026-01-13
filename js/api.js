// js/api.js - Firebase를 대체하는 REST API 클라이언트

// 환경에 따라 API URL 자동 설정
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'  // 로컬 개발 환경
    : 'https://hyunil-law-backend.onrender.com/api';  // 배포 환경 (Render)

// 로컬 스토리지에서 토큰 가져오기
function getToken() {
    return localStorage.getItem('auth_token');
}

// 로컬 스토리지에 토큰 저장
function setToken(token) {
    localStorage.setItem('auth_token', token);
}

// 로컬 스토리지에서 토큰 제거
function removeToken() {
    localStorage.removeItem('auth_token');
}

// 로컬 스토리지에서 사용자 정보 가져오기
function getCurrentUser() {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
}

// 로컬 스토리지에 사용자 정보 저장
function setCurrentUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
}

// 로컬 스토리지에서 사용자 정보 제거
function removeCurrentUser() {
    localStorage.removeItem('current_user');
}

// API 요청 헬퍼 함수
async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token && !options.skipAuth) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || '요청 처리 중 오류가 발생했습니다.');
        }

        return await response.json();
    } catch (error) {
        console.error('API 요청 오류:', error);
        throw error;
    }
}

// ============================================
// apiRequest를 window에 export (payment.html에서 사용)
// ============================================
if (typeof window !== 'undefined') {
    window.apiRequest = apiRequest;
}

// ========== 인증 API ==========

export const auth = {
    // 회원가입
    async signup(userData) {
        const response = await apiRequest('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
            skipAuth: true
        });
        
        if (response.token) {
            setToken(response.token);
            setCurrentUser(response.user);
        }
        
        return response;
    },

    // 로그인
    async login(email, password) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuth: true
        });
        
        if (response.token) {
            setToken(response.token);
            setCurrentUser(response.user);
        }
        
        return response;
    },

    // 로그아웃
    logout() {
        removeToken();
        removeCurrentUser();
    },

    // 현재 로그인한 사용자 확인
    isLoggedIn() {
        return !!getToken();
    },

    // 현재 사용자 정보
    getCurrentUser() {
        return getCurrentUser();
    },

    // 비밀번호 재설정
    async resetPassword(email, newPassword) {
        return await apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, newPassword }),
            skipAuth: true
        });
    }
};

// ========== 사용자 API ==========

export const users = {
    // 현재 사용자 정보 조회
    async getMe() {
        return await apiRequest('/users/me');
    },

    // 사용자 목록 조회 (관리자)
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return await apiRequest(`/users?${params}`);
    },

    // 특정 사용자 조회 (관리자)
    async getById(uid) {
        return await apiRequest(`/users/${uid}`);
    },

    // 사용자 정보 업데이트
    async updateMe(userData) {
        return await apiRequest('/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    // 사용자 역할/플랜 업데이트 (관리자)
    async update(uid, updates) {
        return await apiRequest(`/users/${uid}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    },

    // 사용자 삭제 (관리자)
    async delete(uid) {
        return await apiRequest(`/users/${uid}`, {
            method: 'DELETE'
        });
    }
};

// ========== 소송 사건 API ==========

export const litigationCases = {
    // 소송 사건 목록 조회
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return await apiRequest(`/litigation-cases?${params}`);
    },

    // 특정 소송 사건 조회
    async getById(docId) {
        return await apiRequest(`/litigation-cases/${docId}`);
    },

    // 소송 사건 생성
    async create(caseData) {
        return await apiRequest('/litigation-cases', {
            method: 'POST',
            body: JSON.stringify(caseData)
        });
    },

    // 소송 사건 업데이트
    async update(docId, updates) {
        return await apiRequest(`/litigation-cases/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    },

    // 소송 사건 삭제
    async delete(docId) {
        return await apiRequest(`/litigation-cases/${docId}`, {
            method: 'DELETE'
        });
    },

    // 청구 내역 조회
    async getBillingHistory(docId) {
        return await apiRequest(`/litigation-cases/${docId}/billing-history`);
    },

    // 청구 내역 추가
    async addBillingHistory(docId, billingData) {
        return await apiRequest(`/litigation-cases/${docId}/billing-history`, {
            method: 'POST',
            body: JSON.stringify(billingData)
        });
    }
};

// ========== 채무 사건 API ==========

export const debtCases = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return await apiRequest(`/cases/debt?${params}`);
    },

    async create(caseData) {
        return await apiRequest('/cases/debt', {
            method: 'POST',
            body: JSON.stringify(caseData)
        });
    },

    async update(docId, updates) {
        return await apiRequest(`/cases/debt/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }
};

// ========== 파산 사건 API ==========

export const pasanCases = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return await apiRequest(`/cases/pasan?${params}`);
    },

    async create(caseData) {
        return await apiRequest('/cases/pasan', {
            method: 'POST',
            body: JSON.stringify(caseData)
        });
    },

    async update(docId, updates) {
        return await apiRequest(`/cases/pasan/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }
};

// ========== 상담 문의 API ==========

export const consultationInquiries = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters);
        return await apiRequest(`/cases/consultation?${params}`);
    },

    async create(inquiryData) {
        return await apiRequest('/cases/consultation', {
            method: 'POST',
            body: JSON.stringify(inquiryData),
            skipAuth: true
        });
    },

    async update(docId, updates) {
        return await apiRequest(`/cases/consultation/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }
};

// 권한 체크 헬퍼
export function checkRole(requiredRoles) {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(requiredRoles)) {
        return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
}

// 페이지 권한 체크 (리다이렉트 포함)
export function requireAuth(requiredRoles = null) {
    if (!auth.isLoggedIn()) {
        window.location.href = '/pages/public/login.html';
        return false;
    }

    if (requiredRoles && !checkRole(requiredRoles)) {
        alert('접근 권한이 없습니다.');
        window.location.href = '/pages/user/dashboard.html';
        return false;
    }

    return true;
}

// ============================================
// Posts API (게시글/자문 내역)
// ============================================
export const posts = {
    // 게시글 목록 조회
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.department) params.append('department', filters.department);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);
        
        return await apiRequest(`/posts?${params.toString()}`);
    },

    // 게시글 상세 조회
    getById: async (docId) => {
        return await apiRequest(`/posts/${docId}`);
    },

    // 게시글 생성
    create: async (data) => {
        return await apiRequest('/posts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 게시글 수정
    update: async (docId, data) => {
        return await apiRequest(`/posts/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // 게시글 삭제
    delete: async (docId) => {
        return await apiRequest(`/posts/${docId}`, {
            method: 'DELETE'
        });
    },

    // 카운트 조회 (답변대기중/답변완료)
    getCounts: async () => {
        return await apiRequest('/posts/counts');
    },

    // [NEW] 부서 변경 요청 승인
    approveDepartmentChange: async (docId) => {
        return await apiRequest(`/posts/${docId}/approve-department-change`, {
            method: 'PUT'
        });
    },

    // [NEW] 부서 변경 요청 거절
    rejectDepartmentChange: async (docId, reason) => {
        return await apiRequest(`/posts/${docId}/reject-department-change`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    }
};

// ============================================
// Reports API (보고서)
// ============================================
export const reports = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);
        
        return await apiRequest(`/reports?${params.toString()}`);
    },

    getById: async (docId) => {
        return await apiRequest(`/reports/${docId}`);
    },

    create: async (data) => {
        return await apiRequest('/reports', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (docId, data) => {
        return await apiRequest(`/reports/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete: async (docId) => {
        return await apiRequest(`/reports/${docId}`, {
            method: 'DELETE'
        });
    }
};

// ============================================
// Payments API (결제)
// ============================================
export const payments = {
    getAll: async () => {
        return await apiRequest('/payments');
    },

    create: async (data) => {
        return await apiRequest('/payments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// ============================================
// Leave Requests API (휴가 신청)
// ============================================
export const leaveRequests = {
    getAll: async () => {
        return await apiRequest('/leave-requests');
    },

    create: async (data) => {
        return await apiRequest('/leave-requests', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (docId, data) => {
        return await apiRequest(`/leave-requests/${docId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

// ============================================
// Expenses API (경비)
// ============================================
export const expenses = {
    getAll: async () => {
        return await apiRequest('/expenses');
    },

    create: async (data) => {
        return await apiRequest('/expenses', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// ============================================
// Credit Reports API (신용 조회)
// ============================================
export const creditReports = {
    getAll: async () => {
        return await apiRequest('/credit-reports');
    },

    create: async (data) => {
        return await apiRequest('/credit-reports', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// ============================================
// Cases API (사건 관리)
// ============================================
export const cases = {
    getDebtCases: async () => {
        return await apiRequest('/cases/debt');
    },
    getPasanCases: async () => {
        return await apiRequest('/cases/pasan');
    },
    getConsultCases: async () => {
        return await apiRequest('/cases/consult');
    },
    getById: async (id) => {
        return await apiRequest(`/cases/${id}`);
    }
};

// ============================================
// Admin API (관리자)
// ============================================
export const admin = {
    // 회사 목록 조회
    getCompanies: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/admin/companies${queryString ? '?' + queryString : ''}`);
    },

    // 회사별 직원 목록
    getEmployees: async (bizNum) => {
        return await apiRequest(`/admin/companies/${bizNum}/employees`);
    },

    // ✅ 여러 회사의 직원 목록 일괄 조회 (성능 최적화)
    getEmployeesBatch: async (bizNums) => {
        return await apiRequest('/admin/employees/batch', {
            method: 'POST',
            body: JSON.stringify({ bizNums })
        });
    },

    // 직원 생성 (관리자)
    createEmployee: async (data) => {
        return await apiRequest('/admin/employees', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 플랜 변경
    updateCompanyPlan: async (uid, plan) => {
        return await apiRequest(`/admin/companies/${uid}/plan`, {
            method: 'PUT',
            body: JSON.stringify({ plan })
        });
    },

    // 활성화 상태 변경
    updateCompanyStatus: async (uid, isActive) => {
        return await apiRequest(`/admin/companies/${uid}/status`, {
            method: 'PUT',
            body: JSON.stringify({ isActive })
        });
    },

    // 회사 정보 수정
    updateCompanyInfo: async (uid, data) => {
        return await apiRequest(`/admin/companies/${uid}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // 사용량 증가
    incrementUsage: async (uid, type) => {
        return await apiRequest(`/admin/companies/${uid}/increment-usage`, {
            method: 'POST',
            body: JSON.stringify({ type })
        });
    },

    // Enterprise 한도 수정
    updateCompanyLimits: async (uid, data) => {
        return await apiRequest(`/admin/companies/${uid}/limits`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // 직원 권한 중지/복구
    suspendEmployee: async (uid, suspend) => {
        return await apiRequest(`/admin/employees/${uid}/suspend`, {
            method: 'PUT',
            body: JSON.stringify({ suspend })
        });
    },

    // 직원 정보 수정
    updateEmployee: async (uid, data) => {
        return await apiRequest(`/admin/employees/${uid}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // 회사 로그 추가
    addCompanyLog: async (uid, message) => {
        return await apiRequest(`/admin/companies/${uid}/logs`, {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    },

    // 관리자 로그 조회
    getLogs: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/admin/logs${queryString ? '?' + queryString : ''}`);
    }
};

// ============================================
// Biz Soda API
// ============================================
export const bizSoda = {
    // Biz Soda 요청 생성
    createRequest: async (data) => {
        return await apiRequest('/biz-soda/requests', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 요청 목록 조회
    getRequests: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/biz-soda/requests${queryString ? '?' + queryString : ''}`);
    },

    // 요청 상세 조회
    getRequest: async (docId) => {
        return await apiRequest(`/biz-soda/requests/${docId}`);
    },

    // 결과 등록
    submitResult: async (docId, data) => {
        return await apiRequest(`/biz-soda/requests/${docId}/result`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Legal Asset 요청 생성
    createLegalRequest: async (data) => {
        return await apiRequest('/biz-soda/legal-requests', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Legal 요청 목록
    getLegalRequests: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/biz-soda/legal-requests${queryString ? '?' + queryString : ''}`);
    },

    // Legal 승인
    approveLegal: async (docId, data) => {
        return await apiRequest(`/biz-soda/legal-requests/${docId}/approve`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // Legal 반려
    rejectLegal: async (docId, reason) => {
        return await apiRequest(`/biz-soda/legal-requests/${docId}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ rejectReason: reason })
        });
    },

    // 통계 조회
    getStats: async () => {
        return await apiRequest('/biz-soda/stats');
    }
};

// ============================================
// Billing API (청구서/영수증)
// ============================================
export const billing = {
    // 청구서 발송 로그 생성
    createLog: async (data) => {
        return await apiRequest('/billing/logs', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 발송 이력 조회
    getLogs: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/billing/logs${queryString ? '?' + queryString : ''}`);
    },

    // 사용자 청구/결제 내역 조회
    getMyLogs: async () => {
        return await apiRequest('/billing/my-logs');
    },

    // 청구서 상세 조회
    getLog: async (docId) => {
        return await apiRequest(`/billing/logs/${docId}`);
    },

    // 매출 연동
    linkPayment: async (docId, paymentId) => {
        return await apiRequest(`/billing/logs/${docId}/link-payment`, {
            method: 'PUT',
            body: JSON.stringify({ paymentId })
        });
    },

    // 발송 및 매출 자동 등록
    sendAndRegister: async (data) => {
        return await apiRequest('/billing/send-and-register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 통계 조회
    getStats: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/billing/stats${queryString ? '?' + queryString : ''}`);
    }
};

// ============================================
// Approval Requests API (승인 요청)
// ============================================
export const approvalRequests = {
    // 승인 요청 목록 조회
    getRequests: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/approval-requests${queryString ? '?' + queryString : ''}`);
    },

    // 승인 요청 상세 조회
    getRequest: async (id) => {
        return await apiRequest(`/approval-requests/${id}`);
    },

    // 승인 요청 생성
    createRequest: async (data) => {
        return await apiRequest('/approval-requests', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 승인 요청 승인
    approve: async (id) => {
        return await apiRequest(`/approval-requests/${id}/approve`, {
            method: 'PUT'
        });
    },

    // 승인 요청 거절
    reject: async (id, reason) => {
        return await apiRequest(`/approval-requests/${id}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    },

    // 승인 요청 삭제
    deleteRequest: async (id) => {
        return await apiRequest(`/approval-requests/${id}`, {
            method: 'DELETE'
        });
    },

    // 여러 요청 일괄 승인
    bulkApprove: async (requestIds) => {
        return await apiRequest('/approval-requests/bulk-approve', {
            method: 'PUT',
            body: JSON.stringify({ requestIds })
        });
    }
};

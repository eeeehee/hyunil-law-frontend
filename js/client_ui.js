// client_ui.js
// 고객용 페이지의 사이드바와 프로필 정보를 관리하는 스크립트
// ✅ 요구사항: "두번째 파일"의 기능/노출 로직은 유지하고, "첫번째 파일"의 사이드바 디자인(스타일)은 유지
//  - 따라서 페이지별 공용 스타일 강제 주입(딱지 스타일 덮어쓰기 등)은 제거
//  - HTML 구조/클래스는 기존(first UI) 형태를 유지하면서 role/메뉴 노출은 최신 로직 적용

export function renderClientSidebar(currentPage, userData) {
    // 1) 권한 이름 한글 변환 (두번째 로직 유지)
    let roleName = "일반 직원";
    let roleBadgeClass = "badge-staff"; // CSS 클래스 (기존 디자인 CSS가 이 클래스를 사용한다고 가정)

    if (userData.role === 'master') {
        roleName = "⭐ 최고 관리자 (Master)";
        roleBadgeClass = "badge-owner";
    } else if (userData.role === 'admin') {
        roleName = "🔧 시스템 관리자 (Admin)";
        roleBadgeClass = "badge-owner";
    } else if (userData.role === 'owner') {
        roleName = "👑 대표 (CEO)";
        roleBadgeClass = "badge-owner";
    } else if (userData.role === 'manager') {
        roleName = "💼 부서장 (Manager)";
        roleBadgeClass = "badge-manager";
    }

    // 2) 직원 관리 메뉴 노출 (두번째 로직 유지)
    const ceoMenu = ['master', 'admin', 'owner'].includes(userData.role)
        ? `<li><a href="company_members.html" class="menu-link ${currentPage === 'company_members' ? 'active' : ''}" style="color:#d46b08; font-weight:bold;">👥 직원 관리 (CEO)</a></li>`
        : '';

    // 3) 사이드바 HTML 생성 (첫번째 UI 구조/클래스 유지)
    const sidebarHTML = `
    <nav class="sidebar">
        <div class="sidebar-logo">
            <a href="../../index.html"><img src="../../assets/img/logo.png" alt="법무그룹 현일"></a>
        </div>

        <div class="user-profile-area">
            <div class="user-name">${userData.managerName} 님</div>
            <div class="user-email">${userData.email}</div>
            <div class="user-role ${roleBadgeClass}">${roleName}</div>
        </div>

        <ul class="menu-list">
            <li><a href="dashboard.html" class="menu-link ${currentPage === 'dashboard' ? 'active' : ''}">대시보드</a></li>
            <li><a href="board_list.html" class="menu-link ${currentPage === 'board_list' ? 'active' : ''}">나의 자문 내역</a></li>
            <li><a href="payment.html" class="menu-link ${currentPage === 'payment' ? 'active' : ''}">결제/구독 관리</a></li>
            <li><a href="member_info.html" class="menu-link ${currentPage === 'member_info' ? 'active' : ''}">회원 정보 수정</a></li>
            <li><a href="../public/user_guide.html" class="menu-link ${currentPage === 'user_guide' ? 'active' : ''}">📘 이용 가이드 (FAQ)</a></li>
            ${ceoMenu}
        </ul>

        <div class="logout-btn" id="logoutBtn">로그아웃</div>
    </nav>
    `;

    // 4) 기존 사이드바 교체/삽입 (두번째 로직 유지)
    const oldSidebar = document.querySelector('.sidebar');
    if (oldSidebar) {
        oldSidebar.outerHTML = sidebarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    // 5) 로그아웃 기능 연결
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (window.handleLogout) window.handleLogout();
            else location.href = '../../index.html';
        });
    }
}

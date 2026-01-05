// admin_ui.js
// 관리자용 페이지의 사이드바 관리

export function renderAdminSidebar(currentPage, userData) {
    let roleName = "관리자";
    let roleBadgeClass = "badge-admin";

    if (userData.role === 'master') {
        roleName = "⭐ 최고 관리자";
    } else if (userData.role === 'admin') {
        roleName = "🔧 시스템 관리자";
    } else if (userData.role === 'general_manager') {
        roleName = "👔 총괄 관리자";
    } else if (userData.role === 'lawyer') {
        roleName = "⚖️ 변호사";
    }

    const sidebarHTML = `
    <nav class="sidebar" style="width: 260px; background-color: #1a1a2e; color: #fff; padding: 40px 20px; position: fixed; height: 100vh; left: 0; top: 0; display: flex; flex-direction: column;">
        <div class="sidebar-logo" style="margin-bottom: 30px;">
            <a href="admin.html">
                <img src="../../assets/img/logo.png" alt="법무그룹 현일" style="height: 32px; filter: brightness(0) invert(1);">
            </a>
        </div>

        <div class="user-profile-area" style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; margin-bottom: 30px;">
            <div class="user-name" style="font-size: 16px; font-weight: 800; margin-bottom: 4px;">${userData.managerName || userData.name || '관리자'} 님</div>
            <div class="user-email" style="font-size: 12px; opacity: 0.7; word-break: break-all;">${userData.email}</div>
            <div class="user-role ${roleBadgeClass}" style="display: inline-block; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 700; margin-top: 8px; background: rgba(255,255,255,0.2);">${roleName}</div>
        </div>

        <ul class="menu-list" style="flex: 1;">
            <li style="margin-bottom: 8px;"><a href="admin.html" class="menu-link ${currentPage === 'dashboard' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'dashboard' ? 'background-color: #2c5bf2; color: #fff;' : ''}">📊 대시보드</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_members.html" class="menu-link ${currentPage === 'members' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'members' ? 'background-color: #2c5bf2; color: #fff;' : ''}">👥 회원 관리</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_requests.html" class="menu-link ${currentPage === 'requests' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'requests' ? 'background-color: #2c5bf2; color: #fff;' : ''}">📝 자문 요청</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_litigation.html" class="menu-link ${currentPage === 'litigation' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'litigation' ? 'background-color: #2c5bf2; color: #fff;' : ''}">⚖️ 소송 관리</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_collection.html" class="menu-link ${currentPage === 'collection' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'collection' ? 'background-color: #2c5bf2; color: #fff;' : ''}">💰 채권 추심</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_pasan.html" class="menu-link ${currentPage === 'pasan' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'pasan' ? 'background-color: #2c5bf2; color: #fff;' : ''}">📋 파산 관리</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_payments.html" class="menu-link ${currentPage === 'payments' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'payments' ? 'background-color: #2c5bf2; color: #fff;' : ''}">💳 매출/CMS 관리</a></li>
            <li style="margin-bottom: 8px;"><a href="admin_clients.html" class="menu-link ${currentPage === 'clients' ? 'active' : ''}" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); transition: 0.2s; text-decoration: none; ${currentPage === 'clients' ? 'background-color: #2c5bf2; color: #fff;' : ''}">🏢 고객사 관리</a></li>
            <li style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                <a href="../user/dashboard.html" class="menu-link" style="display: block; padding: 14px 15px; border-radius: 8px; color: rgba(255,255,255,0.5); transition: 0.2s; text-decoration: none;">← 사용자 화면으로</a>
            </li>
        </ul>

        <div class="logout-btn" id="logoutBtn" style="padding: 15px 20px; color: rgba(255,255,255,0.5); font-size: 14px; cursor: pointer; text-align: center;">로그아웃</div>
    </nav>
    `;

    const oldSidebar = document.querySelector('.sidebar');
    if (oldSidebar) {
        oldSidebar.outerHTML = sidebarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(window.handleLogout) window.handleLogout();
            else {
                localStorage.removeItem('token');
                location.href = '../../index.html';
            }
        });
    }
}

// admin_sidebar.js - Firebase 버전 기반으로 재작성
// MariaDB API 연동 버전

function renderAdminSidebar() {
    // 토큰 체크
    const token = localStorage.getItem('auth_token');
    if (!token) {
        console.warn('⚠️ 관리자 토큰이 없습니다.');
    }

    // 스타일 주입 (기존과 동일)
    const sidebarStyles = `
        .sidebar { width: 260px; background-color: #1a1a2e; color: #fff; display: flex; flex-direction: column; position: fixed; height: 100vh; left: 0; top: 0; z-index: 1000; overflow-y: auto; box-shadow: 2px 0 10px rgba(0,0,0,0.1); font-family: "Pretendard Variable", Pretendard, sans-serif; }
        .sidebar a { text-decoration: none; color: inherit; display: block; }
        .sidebar ul, .sidebar li { list-style: none; padding: 0; margin: 0; }
        .sidebar-brand { font-size: 20px; font-weight: 800; padding: 25px 20px 10px 20px; color: #fff; letter-spacing: 1px; }
        .sidebar-profile { padding: 20px; border-bottom: 1px solid #2c2c45; margin-bottom: 10px; background: rgba(0,0,0,0.1); }
        .profile-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .profile-avatar { width: 38px; height: 38px; background: #2c5bf2; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .profile-text { display: flex; flex-direction: column; overflow: hidden; }
        .profile-name { color: #fff; font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-email { color: #888; font-size: 11px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-role { font-size: 10px; color: #4dabf7; margin-top: 2px; font-weight: 600; }
        .btn-logout-mini { width: 100%; padding: 8px 0; background: #2c2c45; color: #ccc; border: 1px solid #3a3a5e; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; text-align: center; }
        .btn-logout-mini:hover { background: #ff4d4f; color: #fff; border-color: #ff4d4f; }
        .sidebar-menu { padding: 10px; }
        .menu-category { display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; color: #a6a6b5; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 8px; margin-bottom: 4px; transition: 0.2s; }
        .menu-category:hover { background-color: rgba(255, 255, 255, 0.05); color: #fff; }
        .menu-category.active { color: #fff; font-weight: 700; background-color: #2c5bf2; }
        .menu-category.open { color: #fff; background-color: #2c2c45; }
        .menu-icon { margin-right: 8px; width: 20px; text-align: center; display: inline-block; }
        .submenu { display: none; background-color: rgba(0,0,0,0.2); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
        .submenu li a { padding: 10px 15px 10px 48px; font-size: 13px; color: #a6a6b5; transition: 0.2s; }
        .submenu li a:hover { color: #fff; background-color: rgba(255,255,255,0.05); }
        .submenu li a.active { color: #fff; font-weight: 700; background-color: #2c5bf2; }
        .menu-divider { border-top: 1px solid #2c2c45; margin: 15px 10px; }
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-track { background: #1a1a2e; }
        .sidebar::-webkit-scrollbar-thumb { background: #2c2c45; border-radius: 3px; }
    `;

    if (!document.getElementById('admin-sidebar-css')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'admin-sidebar-css';
        styleEl.innerHTML = sidebarStyles;
        document.head.appendChild(styleEl);
    }
    
    // --- 메뉴 데이터와 동적 생성 로직 ---
    const currentPath = window.location.pathname;

    const menuData = [
        {
            id: 'groupCorp', title: '🏢 기업자문센터',
            children: [
                { href: 'admin_members.html', title: '👥 회원/기업 관리' },
                { href: 'admin_payments.html', title: '💳 매출/CMS 관리' },
                { href: 'admin.html', title: '📝 자문 관리 (전체)' },
                { href: 'admin_requests.html', title: '📩 요청 관리함' },
                { href: 'admin_report.html', title: '📊 리포트 발송' },
                { href: 'admin_corpbilling.html', title: '💰 자문료 청구/발송' }
            ]
        },
        {
            id: 'groupLitigation', title: '⚖️ 전자소송/사건',
            children: [
                { href: '../public/real_data_upload.html', title: '📥 엑셀 데이터 업로드', style: 'color:#52c41a; font-weight:700;' },
                { href: 'admin_litigation.html', title: '🔎 전자소송 데이터 확인' },
                { href: 'admin_clients.html', title: '📇 당사자(고객) 관리' },
                { href: 'admin_submit.html', title: '📤 문서 제출/발송' },
                { href: 'admin_billing.html', title: '💰 비용/청구 관리', style: 'color:#d32f2f; font-weight:700;' },
                { href: 'admin_casereport.html', title: '📢 사건 리포트 발송' }
            ]
        },
        {
            id: 'groupSpecial', title: '📞 파산/추심 센터',
            children: [
                { href: 'admin_collection_consult.html', title: '💰 채권 추심 상담' },
                { href: 'admin_collection.html', title: '💰 채권 추심 사건' },
                { href: 'admin_pasan_consult.html', title: '📉 파산/회생 상담' },
                { href: 'admin_pasan.html', title: '📉 파산/회생 사건' }
            ]
        },
        {
            id: 'groupEtc', title: '⚔️ 분쟁 및 종결',
            children: [
                { href: 'admin_conflict.html', title: '⚔️ 분쟁/협상 (Conflict)', style: 'color:#fa8c16; font-weight:700;' },
                { href: 'admin_finished.html', title: '🏁 종결 사건 (Archive)', style: 'color:#999; font-weight:700;' }
            ]
        },
        { isDivider: true },
        { href: 'admin_settings.html', title: '⚙️ 환경 설정' },
        { isDivider: true },
        { href: 'http://www.hyunillaw.com', title: '🌐 법무그룹 현일 홈페이지', isExternal: true },
        { href: '../../index.html', title: '🏢 기업자문 홈페이지' },
        { href: '../user/dashboard.html', title: '🖥️ 기업자문 사용자 모드', style: 'color:#2c5bf2; font-weight:700;' }
    ];

    let menuHtml = '';
    menuData.forEach(item => {
        if (item.isDivider) {
            menuHtml += `<li><div class="menu-divider"></div></li>`;
            return;
        }

        if (item.children) {
            const isCategoryActive = item.children.some(child => currentPath.includes(child.href));
            const categoryClasses = `menu-category ${isCategoryActive ? 'open' : ''}`;
            const submenuStyle = `display: ${isCategoryActive ? 'block' : 'none'};`;
            
            const childrenHtml = item.children.map(child => {
                const childIsActive = currentPath.includes(child.href);
                return `<li><a href="${child.href}" class="${childIsActive ? 'active' : ''}" style="${child.style || ''}">${child.title}</a></li>`;
            }).join('');

            menuHtml += `
                <li>
                    <div class="${categoryClasses}" id="cat_${item.id}" onclick="toggleAdminMenu('${item.id}', this)">
                        <div><span class="menu-icon">${item.title.split(' ')[0]}</span> ${item.title.split(' ').slice(1).join(' ')}</div>
                        <span style="font-size:10px;">▼</span>
                    </div>
                    <ul id="${item.id}" class="submenu" style="${submenuStyle}">${childrenHtml}</ul>
                </li>
            `;
        } else {
            const isActive = currentPath.includes(item.href);
            const target = item.isExternal ? 'target="_blank"' : '';
            menuHtml += `<li><a href="${item.href}" class="menu-category ${isActive ? 'active' : ''}" ${target} style="${item.style || ''}">${item.title}</a></li>`;
        }
    });

    const sidebarHTML = `
    <nav class="sidebar">
        <div class="sidebar-brand">ADMINISTRATOR</div>
        <div class="sidebar-profile">
            <div class="profile-info">
                <div class="profile-avatar">👤</div>
                <div class="profile-text">
                    <span class="profile-name" id="sb_userName">Guest</span>
                    <span class="profile-email" id="sb_userEmail">로그인 필요</span>
                    <span class="profile-role" id="sb_userRole"></span>
                    <!-- legacy id 호환 (admin.html 일부 코드가 찾을 수 있음) -->
                    <span id="adminUserName" style="display:none;"></span>
                    <span id="adminUserEmail" style="display:none;"></span>
                    <span id="adminUserRole" style="display:none;"></span>
                </div>
            </div>
            <button class="btn-logout-mini" id="adminLogoutBtn" onclick="adminLogout()">로그아웃</button>
        </div>
        <ul class="sidebar-menu">${menuHtml}</ul>
    </nav>
    `;

    // 기존 사이드바 제거 후 삽입
    const existingSidebar = document.querySelector('.sidebar');
    if (existingSidebar) {
        existingSidebar.remove();
    }
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    // 사용자 정보 로드 및 표시
    loadAdminUserInfo();

    // legacy id 동기화 (adminUserName/adminUserEmail/adminUserRole)
    try {
        const sbName = document.getElementById('sb_userName');
        const sbEmail = document.getElementById('sb_userEmail');
        const sbRole = document.getElementById('sb_userRole');
        const lgName = document.getElementById('adminUserName');
        const lgEmail = document.getElementById('adminUserEmail');
        const lgRole = document.getElementById('adminUserRole');
        if (sbName && lgName) lgName.textContent = sbName.textContent;
        if (sbEmail && lgEmail) lgEmail.textContent = sbEmail.textContent;
        if (sbRole && lgRole) lgRole.textContent = sbRole.textContent;
    } catch (e) {}
}

// 카테고리 토글 함수
window.toggleAdminMenu = function(menuId, catElement) {
    const submenu = document.getElementById(menuId);
    if (submenu) {
        const isVisible = submenu.style.display === 'block';
        submenu.style.display = isVisible ? 'none' : 'block';
        
        // active 클래스 토글
        if (catElement) {
            if (isVisible) {
                catElement.classList.remove('active');
            } else {
                catElement.classList.add('active');
            }
        }
    }
};

// 관리자 정보 로드
async function loadAdminUserInfo() {
    try {
        // 토큰 확인
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.log('관리자 토큰 없음');
            return;
        }

        // 환경별 API URL 설정
        const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api'
            : 'https://hyunil-law-backend.onrender.com/api';

        // API 호출
        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();

            // 프로필 업데이트
            const nameEl = document.getElementById('sb_userName');
            const emailEl = document.getElementById('sb_userEmail');
            const roleEl = document.getElementById('sb_userRole');

            if (nameEl) nameEl.innerText = data.managerName || data.name || 'Admin';
            if (emailEl) emailEl.innerText = data.email || '';

            if (roleEl) {
                let roleText = '관리자';
                if (data.role === 'master') roleText = '최고 관리자';
                else if (data.role === 'admin') roleText = '시스템 관리자';
                else if (data.role === 'general_manager') roleText = '총괄 관리자';
                else if (data.role === 'lawyer') roleText = '변호사';

                roleEl.innerText = roleText;
            }
        }
    } catch (error) {
        console.error('관리자 정보 로드 실패:', error);
    }
}

// 로그아웃 함수
window.adminLogout = function() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('auth_token');
        location.href = '../public/login.html';
    }
};

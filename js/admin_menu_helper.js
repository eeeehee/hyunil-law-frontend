// 관리자 메뉴 헬퍼 함수

/**
 * 변호사 권한일 경우 특정 메뉴를 숨김
 * @param {string} userRole - 사용자의 role
 */
export function hideLawyerRestrictedMenus(userRole) {
    if (userRole !== 'lawyer') return;

    const hideMenus = [
        'admin_report.html',
        'admin_corpbilling.html',
        'admin_members.html',
        'admin_payments.html'
    ];

    hideMenus.forEach(menuFile => {
        const menuLink = document.querySelector(`a[href="${menuFile}"]`);
        if (menuLink) {
            menuLink.parentElement.style.display = 'none';
        }
    });
}

/**
 * 변호사가 접근 불가능한 페이지인지 확인하고 차단
 * @param {string} userRole - 사용자의 role
 */
export function checkLawyerPageAccess(userRole) {
    if (userRole !== 'lawyer') return;

    const restrictedPages = [
        'admin_report.html',
        'admin_corpbilling.html',
        'admin_members.html',
        'admin_payments.html'
    ];

    const currentPage = window.location.pathname.split('/').pop();

    if (restrictedPages.includes(currentPage)) {
        alert('변호사 권한으로는 해당 페이지에 접근할 수 없습니다.\n자문 관리 페이지로 이동합니다.');
        location.href = 'admin.html';
    }
}

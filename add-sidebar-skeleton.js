const fs = require('fs');
const path = require('path');

// Skeleton 사이드바 HTML
const skeletonSidebar = `
    <!-- Sidebar Skeleton (깜빡임 방지) -->
    <nav class="sidebar">
        <div class="sidebar-logo">
            <a href="/"><img src="/assets/img/logo.png" alt="법무그룹 현일"></a>
        </div>
        <div class="user-profile-area">
            <div class="user-name">로딩중...</div>
            <div class="user-email">...</div>
            <div class="user-role badge-staff">...</div>
        </div>
        <ul class="menu-list">
            <li><a href="/pages/user/dashboard.html" class="menu-link">대시보드</a></li>
            <li><a href="/pages/user/board_list.html" class="menu-link">나의 자문 내역</a></li>
            <li><a href="/pages/user/payment.html" class="menu-link">결제/구독 관리</a></li>
            <li><a href="/pages/user/member_info.html" class="menu-link">회원 정보 수정</a></li>
            <li><a href="/pages/public/user_guide.html" class="menu-link">📘 이용 가이드 (FAQ)</a></li>
        </ul>
        <div class="logout-btn" id="logoutBtn">로그아웃</div>
    </nav>

`;

// 수정할 파일 목록
const files = [
    'pages/user/board_list.html',
    'pages/user/board_write.html',
    'pages/user/credit_list.html',
    'pages/user/member_info.html',
    'pages/user/payment.html',
    'pages/user/company_members.html'
];

let modifiedCount = 0;

files.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  파일 없음: ${filePath}`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 이미 skeleton이 있는지 확인
    if (content.includes('<!-- Sidebar Skeleton')) {
        console.log(`✓  이미 적용됨: ${filePath}`);
        return;
    }
    
    // <body> 다음에 skeleton 삽입
    const bodyRegex = /(<\/head>\s*<body>\s*)/;
    
    if (bodyRegex.test(content)) {
        content = content.replace(bodyRegex, `$1${skeletonSidebar}`);
        fs.writeFileSync(fullPath, content, 'utf8');
        modifiedCount++;
        console.log(`✅ 수정 완료: ${filePath}`);
    } else {
        console.log(`⚠️  <body> 태그 찾을 수 없음: ${filePath}`);
    }
});

console.log(`\n📊 총 ${modifiedCount}개 파일 수정 완료!`);
console.log('\n✨ 이제 사이드바 깜빡임이 완전히 사라집니다!');
console.log('\n🚀 다음 단계:');
console.log('   1. 서버 재시작: npm start');
console.log('   2. 브라우저 완전히 닫기');
console.log('   3. 강력 새로고침: Ctrl + Shift + R');
console.log('   4. 페이지 이동 시 사이드바 관찰');

// Header.js
import { auth } from './api.js';

// GitHub Pages와 로컬 환경 모두 지원하는 Base URL
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : '/hyunil-law-frontend';

// 2. 이 함수 안에 HTML 내용이 가득 들어있습니다! (빈 게 아님)
export function loadHeader() {
    const headerHtml = `
    <header>
        <div class="logo"><a href="${BASE_URL}/index.html"><img src="${BASE_URL}/assets/img/logo.png" alt="법무그룹 현일"></a></div>
        <nav class="nav-links">
            <a href="${BASE_URL}/pages/public/service_intro.html">자문서비스 소개</a>
            <a href="${BASE_URL}/pages/public/pricing.html">자문요금제</a>
            <a href="#" id="authBtn">로그인</a>
        </nav>
    </header>
    `;

    // 3. 여기서 화면(body)의 맨 앞에 끼워 넣습니다.
    document.body.insertAdjacentHTML("afterbegin", headerHtml);

    // 4. 현재 페이지 메뉴 활성화 로직
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/' && currentPath === '/') {
            link.classList.add('active');
        } else if (href !== '#' && href !== '/' && currentPath.includes(href)) {
            link.classList.add('active');
        }
    });

    // 5. 로그인/로그아웃 버튼 로직
    const authBtn = document.getElementById("authBtn");

    if (auth.isLoggedIn()) {
        authBtn.innerText = "로그아웃";
        authBtn.href = "#";
        authBtn.onclick = (e) => {
            e.preventDefault();
            auth.logout();
            alert("로그아웃 되었습니다.");
            window.location.href = BASE_URL + "/index.html";
        };
    } else {
        authBtn.innerText = "로그인";
        authBtn.href = BASE_URL + "/pages/public/login.html";
        authBtn.onclick = null;
    }
}
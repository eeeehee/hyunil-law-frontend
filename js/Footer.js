// components/Footer.js

// GitHub Pages와 로컬 환경 모두 지원하는 Base URL
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? ''
    : '/hyunil-law-frontend';

export function loadFooter() {
    const footerHtml = `
    <footer>
        <div class="footer-container">
            <div class="social-icons">
                <a href="https://blog.naver.com/lawgrouphyunil" target="_blank">
                    <img src="${BASE_URL}/assets/img/naver-blog.png" alt="네이버 블로그">
                </a>
                <a href="http://pf.kakao.com/_MxbdNn" target="_blank">
                    <img src="${BASE_URL}/assets/img/icon_kakao.png" alt="카카오">
                </a>
                <a href="https://www.instagram.com/hyunillaw_official?igsh=ZTN6MHM1NmU5NjR4" target="_blank">
                    <img src="${BASE_URL}/assets/img/icon_insta.png" alt="인스타">
                </a>
            </div>

            <div class="footer-info">
                <h2>법무그룹 현일 기업자문센터</h2>
                <div class="info-row">
                    대표변호사 : 신현정 <span>|</span> 주소 : 서울특별시 강남구 테헤란로 521 29층 suite 39-c <span>|</span> 대표번호 : 1533-6092
                </div>
                <div class="info-row">
                    사업자등록번호 : 211-51-06741 <span>|</span> 통신판매업신고번호 : 2025-서울강남-04334
                </div>
            </div>

            <div class="footer-links">
                <a href="${BASE_URL}/pages/public/terms.html">이용약관</a> <span>|</span> <a href="${BASE_URL}/pages/public/privacy.html" class="bold">개인정보처리방침</a>
            </div>

            <p class="copyright">Copyright ⓒ 2025 법무그룹 현일 기업자문센터 All rights reserved.</p>
        </div>
    </footer>
    `;

    // 푸터를 body의 맨 끝에 삽입
    document.body.insertAdjacentHTML("beforeend", footerHtml);
}
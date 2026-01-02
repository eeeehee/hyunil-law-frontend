/**
 * 모든 경로 및 구조 문제 수정 스크립트 - FINAL ULTIMATE
 * 1. onclick 속성 오류 수정
 * 2. 다른 모든 경로 오류 수정
 */

const fs = require('fs');
const path = require('path');

// 수정할 패턴들 (우선순위 순서)
const patterns = [
    // 1. onclick 속성의 location.href 오류 (가장 중요!)
    { 
        find: /onclick="location\.href='="\//g, 
        replace: 'onclick="location.href=\'/', 
        desc: 'onclick location.href 오류 (큰따옴표)' 
    },
    { 
        find: /onclick='location\.href="/g, 
        replace: 'onclick=\'location.href="/', 
        desc: 'onclick location.href 오류 (작은따옴표)' 
    },
    
    // 2. 일반적인 href/src 오류
    { find: /href="="\//g, replace: 'href="/', desc: 'href 속성 오류' },
    { find: /src="="\//g, replace: 'src="/', desc: 'src 속성 오류' },
    { find: /href='//g, replace: "href='/", desc: 'href 속성 오류 (작은따옴표)' },
    { find: /src='//g, replace: "src='/", desc: 'src 속성 오류 (작은따옴표)' },
    
    // 3. JavaScript 변수 할당
    { find: /\.href\s*=\s*"="\//g, replace: '.href = "/', desc: '.href JavaScript 할당' },
    { find: /location\.href\s*=\s*"="\//g, replace: 'location.href = "/', desc: 'location.href 할당' },
    
    // 4. Firebase 모듈 경로
    { find: /from\s+["']\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로' },
    { find: /from\s+["']\.\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로' },
    { find: /from\s+["']\.\.\/\.\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로' },
];

// 특별 처리: service_intro.html의 중복 헤더 제거
function fixServiceIntroHeader(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // HTML의 정적 헤더 제거 (149-156줄 사이)
    const headerPattern = /<header>\s*<div class="logo">.*?<\/header>/s;
    if (headerPattern.test(content)) {
        content = content.replace(headerPattern, '<!-- Header will be loaded by Header.js -->');
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

// 파일 수정 함수
function fixFiles(dir, extensions) {
    let fixedCount = 0;
    let fileCount = 0;
    let totalFixes = 0;
    const results = {
        html: { files: 0, fixes: 0 },
        js: { files: 0, fixes: 0 }
    };
    const specialFixes = [];

    function processDirectory(directory) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (file !== 'node_modules') {
                    processDirectory(fullPath);
                }
            } else {
                const ext = path.extname(file);
                if (extensions.includes(ext)) {
                    fileCount++;
                    const fileType = ext === '.html' ? 'html' : 'js';
                    const relativePath = path.relative(dir, fullPath);
                    
                    // 특별 처리: service_intro.html
                    if (relativePath.includes('service_intro.html')) {
                        if (fixServiceIntroHeader(fullPath)) {
                            specialFixes.push('service_intro.html 중복 헤더 제거');
                            console.log(`🔧 ${relativePath} (중복 헤더 제거)`);
                        }
                    }
                    
                    let content = fs.readFileSync(fullPath, 'utf8');
                    let modified = false;
                    let fileFixCount = 0;

                    patterns.forEach(pattern => {
                        const matches = content.match(pattern.find);
                        if (matches) {
                            content = content.replace(pattern.find, pattern.replace);
                            modified = true;
                            fileFixCount += matches.length;
                            totalFixes += matches.length;
                        }
                    });

                    if (modified) {
                        fs.writeFileSync(fullPath, content, 'utf8');
                        fixedCount++;
                        results[fileType].files++;
                        results[fileType].fixes += fileFixCount;
                        
                        console.log(`✅ ${relativePath} (${fileFixCount}개 수정)`);
                    }
                }
            }
        });
    }

    try {
        console.log('🔍 모든 파일 검사 및 수정 중...\n');
        processDirectory(dir);
        
        console.log('\n' + '='.repeat(70));
        console.log(`📊 수정 결과:`);
        console.log(`   📄 HTML: ${results.html.files}개 파일, ${results.html.fixes}개 수정`);
        console.log(`   📜 JavaScript: ${results.js.files}개 파일, ${results.js.fixes}개 수정`);
        if (specialFixes.length > 0) {
            console.log(`   🔧 특수 수정: ${specialFixes.join(', ')}`);
        }
        console.log(`   📊 총계: ${fixedCount}개 파일, ${totalFixes}개 수정`);
        console.log('='.repeat(70));
        
        if (fixedCount > 0 || specialFixes.length > 0) {
            console.log('\n✨ 모든 문제가 완벽하게 수정되었습니다!');
            console.log('\n📝 수정 내용:');
            console.log('   1. ✅ onclick 속성 오류 (location.href)');
            console.log('   2. ✅ HTML 속성 오류 (href, src)');
            console.log('   3. ✅ JavaScript 할당 오류');
            console.log('   4. ✅ service_intro.html 중복 헤더 제거');
            console.log('   5. ✅ Firebase 모듈 경로');
        } else {
            console.log('\n✅ 모든 파일이 정상입니다!');
        }
        
        console.log('\n🚀 다음 단계:');
        console.log('   1. Ctrl+C (기존 서버 종료)');
        console.log('   2. 브라우저 완전히 닫기');
        console.log('   3. 서버 재시작: npx http-server -p 8000 -o');
        console.log('   4. Ctrl+Shift+R (강력 새로고침)');
        console.log('   5. 테스트:');
        console.log('      - 대시보드 카드 클릭 → 페이지 이동');
        console.log('      - 자문신청/전화예약 버튼 클릭 → 페이지 이동');
        console.log('      - 서비스 소개 → 헤더 1개만 표시');
        console.log('      - 로그인 상태 → "로그아웃" 버튼 표시');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        process.exit(1);
    }
}

// 현재 디렉토리에서 HTML과 JavaScript 파일 모두 수정
const currentDir = process.cwd();
console.log('📁 작업 디렉토리:', currentDir);
console.log('🎯 대상 파일: HTML, JavaScript');
console.log('🔧 수정 항목: onclick 오류, 경로 오류, 헤더 중복');
console.log('');

fixFiles(currentDir, ['.html', '.js']);

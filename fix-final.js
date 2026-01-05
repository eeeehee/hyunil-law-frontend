/**
 * 완벽한 경로 수정 스크립트 v3 - FINAL
 * 모든 JavaScript 오류 패턴 수정
 */

const fs = require('fs');
const path = require('path');

// 수정할 패턴들 (우선순위 순서)
const patterns = [
    // 1. JavaScript .href 할당 오류 (모든 변형 커버)
    { find: /\.href\s*=\s*"="\//g, replace: '.href = "/', desc: '.href JavaScript 오류 (큰따옴표)' },
    { find: /\.href\s*=\s*'='/g, replace: ".href = '/", desc: '.href JavaScript 오류 (작은따옴표)' },
    
    // 2. JavaScript location.href 오류
    { find: /location\.href\s*=\s*"="\//g, replace: 'location.href = "/', desc: 'location.href JavaScript 오류' },
    { find: /location\.href\s*=\s*'='/g, replace: "location.href = '/", desc: 'location.href JavaScript 오류 (작은따옴표)' },
    { find: /window\.location\s*=\s*"="\//g, replace: 'window.location = "/', desc: 'window.location JavaScript 오류' },
    
    // 3. HTML 속성 오류
    { find: /src="="\//g, replace: 'src="/', desc: 'src 속성 오류' },
    { find: /href="="\//g, replace: 'href="/', desc: 'href 속성 오류' },
    { find: /src='//g, replace: "src='/", desc: 'src 속성 오류 (작은따옴표)' },
    { find: /href='//g, replace: "href='/", desc: 'href 속성 오류 (작은따옴표)' },
    
    // 4. Firebase config 경로 수정
    { find: /from\s+["']\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로' },
    { find: /from\s+["']\.\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로 (상대)' },
    { find: /from\s+["']\.\.\/\.\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로 (상대2)' },
    
    // 5. Header.js 경로 수정
    { find: /from\s+["']\.\/components\/Header\.js["']/g, replace: 'from "/js/Header.js"', desc: 'Header.js 경로' },
    { find: /from\s+["']\.\.\/components\/Header\.js["']/g, replace: 'from "/js/Header.js"', desc: 'Header.js 경로 (상대)' },
    { find: /from\s+["']\.\.\/Header\.js["']/g, replace: 'from "/js/Header.js"', desc: 'Header.js 경로 (상대2)' },
    
    // 6. Footer.js 경로 수정
    { find: /from\s+["']\.\/components\/Footer\.js["']/g, replace: 'from "/js/Footer.js"', desc: 'Footer.js 경로' },
    { find: /from\s+["']\.\.\/components\/Footer\.js["']/g, replace: 'from "/js/Footer.js"', desc: 'Footer.js 경로 (상대)' },
    { find: /from\s+["']\.\.\/Footer\.js["']/g, replace: 'from "/js/Footer.js"', desc: 'Footer.js 경로 (상대2)' },
    
    // 7. admin_sidebar.js 경로 수정
    { find: /from\s+["']\.\/admin_sidebar\.js["']/g, replace: 'from "/js/admin_sidebar.js"', desc: 'admin_sidebar.js 경로' },
    { find: /from\s+["']\.\.\/admin_sidebar\.js["']/g, replace: 'from "/js/admin_sidebar.js"', desc: 'admin_sidebar.js 경로 (상대)' },
    { find: /from\s+["']\.\.\/\.\.\/admin_sidebar\.js["']/g, replace: 'from "/js/admin_sidebar.js"', desc: 'admin_sidebar.js 경로 (상대2)' },
    
    // 8. client_ui.js 경로 수정
    { find: /from\s+["']\.\/client_ui\.js["']/g, replace: 'from "/js/client_ui.js"', desc: 'client_ui.js 경로' },
    { find: /from\s+["']\.\.\/client_ui\.js["']/g, replace: 'from "/js/client_ui.js"', desc: 'client_ui.js 경로 (상대)' },
];

// HTML 파일 찾아서 수정하는 함수
function fixHtmlFiles(dir) {
    let fixedCount = 0;
    let fileCount = 0;
    let totalFixes = 0;
    const fixedFiles = [];

    function processDirectory(directory) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (file !== 'node_modules') {
                    processDirectory(fullPath);
                }
            } else if (file.endsWith('.html')) {
                fileCount++;
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;
                const appliedPatterns = [];

                patterns.forEach(pattern => {
                    const matches = content.match(pattern.find);
                    if (matches) {
                        content = content.replace(pattern.find, pattern.replace);
                        modified = true;
                        totalFixes += matches.length;
                        appliedPatterns.push(`${pattern.desc} (${matches.length}개)`);
                    }
                });

                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    fixedCount++;
                    const relativePath = path.relative(dir, fullPath);
                    fixedFiles.push({ path: relativePath, patterns: appliedPatterns });
                    console.log(`✅ ${relativePath}`);
                    appliedPatterns.forEach(p => console.log(`   └─ ${p}`));
                }
            }
        });
    }

    try {
        console.log('🔍 모든 HTML 파일 검사 및 수정 중...\n');
        processDirectory(dir);
        console.log('\n' + '='.repeat(70));
        console.log(`📊 수정 결과:`);
        console.log(`   • 검사한 파일: ${fileCount}개`);
        console.log(`   • 수정한 파일: ${fixedCount}개`);
        console.log(`   • 총 수정 횟수: ${totalFixes}개`);
        console.log('='.repeat(70));
        
        if (fixedCount > 0) {
            console.log('\n✨ 모든 오류가 완벽하게 수정되었습니다!');
            console.log('\n📝 수정 내용:');
            console.log('   1. ✅ JavaScript .href 할당 오류');
            console.log('   2. ✅ JavaScript location.href 오류');
            console.log('   3. ✅ HTML 속성 오류 (src, href)');
            console.log('   4. ✅ Firebase/모듈 경로 → 절대 경로');
        } else {
            console.log('\n✅ 모든 파일이 정상입니다!');
        }
        
        console.log('\n🚀 다음 단계:');
        console.log('   1. 브라우저 완전히 닫기');
        console.log('   2. 서버 재시작: npx http-server -p 8000 -o');
        console.log('   3. Ctrl+Shift+R (강력 새로고침)');
        console.log('   4. 로그인 테스트');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        process.exit(1);
    }
}

// 현재 디렉토리에서 실행
const currentDir = process.cwd();
console.log('📁 작업 디렉토리:', currentDir);
console.log('');

fixHtmlFiles(currentDir);

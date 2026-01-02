/**
 * 완벽한 경로 수정 스크립트 v2
 * HTML 속성과 JavaScript 코드 모두 수정
 */

const fs = require('fs');
const path = require('path');

// 수정할 패턴들
const patterns = [
    // 1. JavaScript 코드 내 잘못된 location.href 수정 (우선순위 높음)
    { find: /location\.href\s*=\s*"="\//g, replace: 'location.href = "/', desc: 'location.href JavaScript 오류' },
    { find: /location\.href\s*=\s*'='/g, replace: "location.href = '/", desc: 'location.href JavaScript 오류 (작은따옴표)' },
    { find: /window\.location\s*=\s*"="\//g, replace: 'window.location = "/', desc: 'window.location JavaScript 오류' },
    
    // 2. HTML 속성 오류 수정
    { find: /src="="\//g, replace: 'src="/', desc: 'src 속성 오류' },
    { find: /href="="\//g, replace: 'href="/', desc: 'href 속성 오류' },
    
    // 3. Firebase config 경로 수정
    { find: /from\s+["']\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로' },
    { find: /from\s+["']\.\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로 (상대)' },
    { find: /from\s+["']\.\.\/\.\.\/firebase-config\.js["']/g, replace: 'from "/js/firebase-config.js"', desc: 'Firebase config 경로 (상대2)' },
    
    // 4. Header.js 경로 수정
    { find: /from\s+["']\.\/components\/Header\.js["']/g, replace: 'from "/js/Header.js"', desc: 'Header.js 경로' },
    { find: /from\s+["']\.\.\/components\/Header\.js["']/g, replace: 'from "/js/Header.js"', desc: 'Header.js 경로 (상대)' },
    { find: /from\s+["']\.\.\/Header\.js["']/g, replace: 'from "/js/Header.js"', desc: 'Header.js 경로 (상대2)' },
    
    // 5. Footer.js 경로 수정
    { find: /from\s+["']\.\/components\/Footer\.js["']/g, replace: 'from "/js/Footer.js"', desc: 'Footer.js 경로' },
    { find: /from\s+["']\.\.\/components\/Footer\.js["']/g, replace: 'from "/js/Footer.js"', desc: 'Footer.js 경로 (상대)' },
    { find: /from\s+["']\.\.\/Footer\.js["']/g, replace: 'from "/js/Footer.js"', desc: 'Footer.js 경로 (상대2)' },
    
    // 6. admin_sidebar.js 경로 수정
    { find: /from\s+["']\.\/admin_sidebar\.js["']/g, replace: 'from "/js/admin_sidebar.js"', desc: 'admin_sidebar.js 경로' },
    { find: /from\s+["']\.\.\/admin_sidebar\.js["']/g, replace: 'from "/js/admin_sidebar.js"', desc: 'admin_sidebar.js 경로 (상대)' },
    { find: /from\s+["']\.\.\/\.\.\/admin_sidebar\.js["']/g, replace: 'from "/js/admin_sidebar.js"', desc: 'admin_sidebar.js 경로 (상대2)' },
    
    // 7. client_ui.js 경로 수정
    { find: /from\s+["']\.\/client_ui\.js["']/g, replace: 'from "/js/client_ui.js"', desc: 'client_ui.js 경로' },
    { find: /from\s+["']\.\.\/client_ui\.js["']/g, replace: 'from "/js/client_ui.js"', desc: 'client_ui.js 경로 (상대)' },
];

// HTML 파일 찾아서 수정하는 함수
function fixHtmlFiles(dir) {
    let fixedCount = 0;
    let fileCount = 0;
    const fixedFiles = [];

    function processDirectory(directory) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // node_modules 제외
                if (file !== 'node_modules') {
                    processDirectory(fullPath);
                }
            } else if (file.endsWith('.html')) {
                fileCount++;
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;
                const appliedPatterns = [];

                patterns.forEach(pattern => {
                    if (pattern.find.test(content)) {
                        content = content.replace(pattern.find, pattern.replace);
                        modified = true;
                        appliedPatterns.push(pattern.desc);
                    }
                });

                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    fixedCount++;
                    const relativePath = path.relative(dir, fullPath);
                    fixedFiles.push({ path: relativePath, patterns: appliedPatterns });
                    console.log(`✅ 수정됨: ${relativePath}`);
                    appliedPatterns.forEach(p => console.log(`   - ${p}`));
                }
            }
        });
    }

    try {
        console.log('🔍 HTML 파일 검사 및 수정 중...\n');
        processDirectory(dir);
        console.log('\n' + '='.repeat(60));
        console.log(`📊 결과:`);
        console.log(`   - 검사한 파일: ${fileCount}개`);
        console.log(`   - 수정한 파일: ${fixedCount}개`);
        console.log('='.repeat(60));
        
        if (fixedCount > 0) {
            console.log('\n✨ 모든 경로 오류가 수정되었습니다!');
            console.log('\n📝 수정된 주요 내용:');
            console.log('   1. JavaScript location.href 오류 수정');
            console.log('   2. HTML 속성 오류 (src="=", href="=")');
            console.log('   3. Firebase config 경로 → /js/firebase-config.js');
            console.log('   4. Header/Footer 경로 → /js/Header.js, /js/Footer.js');
            console.log('   5. 기타 JS 모듈 경로 → 절대 경로로 변경');
        } else {
            console.log('\n✅ 경로 오류가 없습니다!');
        }
        
        console.log('\n🚀 이제 서버를 실행하세요:');
        console.log('   npx http-server -p 8000 -o');
        console.log('\n💡 Firebase Console에 localhost 추가했다면:');
        console.log('   http://localhost:8000 에서 로그인 가능!');
        
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

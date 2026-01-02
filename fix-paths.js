/**
 * 경로 오류 자동 수정 스크립트
 * src="=" 및 href="=" 를 src=" 및 href=" 로 수정
 */

const fs = require('fs');
const path = require('path');

// 수정할 패턴
const patterns = [
    { find: /src="/g, replace: 'src="' },
    { find: /href="/g, replace: 'href="' }
];

// HTML 파일 찾아서 수정하는 함수
function fixHtmlFiles(dir) {
    let fixedCount = 0;
    let fileCount = 0;

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

                patterns.forEach(pattern => {
                    if (pattern.find.test(content)) {
                        content = content.replace(pattern.find, pattern.replace);
                        modified = true;
                    }
                });

                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    fixedCount++;
                    console.log(`✅ 수정됨: ${fullPath}`);
                }
            }
        });
    }

    try {
        console.log('🔍 HTML 파일 검사 중...\n');
        processDirectory(dir);
        console.log('\n' + '='.repeat(50));
        console.log(`📊 결과:`);
        console.log(`   - 검사한 파일: ${fileCount}개`);
        console.log(`   - 수정한 파일: ${fixedCount}개`);
        console.log('='.repeat(50));
        
        if (fixedCount > 0) {
            console.log('\n✨ 모든 경로 오류가 수정되었습니다!');
        } else {
            console.log('\n✅ 경로 오류가 없습니다!');
        }
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

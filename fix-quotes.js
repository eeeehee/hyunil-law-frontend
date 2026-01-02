/**
 * onclick 따옴표 문제 완벽 수정 스크립트
 * 문제: onclick="location.href='...'"">
 * 해결: onclick="location.href='...'">
 */

const fs = require('fs');
const path = require('path');

// 수정할 패턴들
const patterns = [
    // onclick 속성의 잘못된 따옴표 닫기
    { 
        find: /'"">/g, 
        replace: `'">`, 
        desc: 'onclick 따옴표 오류 수정' 
    },
    // 추가 안전장치: 명시적인 onclick 패턴
    { 
        find: /(onclick="location\.href='[^']+)'"">/g, 
        replace: `$1'">`, 
        desc: 'onclick location.href 따옴표 수정' 
    },
];

// 파일 수정 함수
function fixFiles(dir) {
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
                let fileFixCount = 0;
                const appliedPatterns = [];

                patterns.forEach(pattern => {
                    const matches = content.match(pattern.find);
                    if (matches) {
                        content = content.replace(pattern.find, pattern.replace);
                        modified = true;
                        fileFixCount += matches.length;
                        totalFixes += matches.length;
                        appliedPatterns.push(`${pattern.desc} (${matches.length}개)`);
                    }
                });

                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    fixedCount++;
                    const relativePath = path.relative(dir, fullPath);
                    fixedFiles.push({ path: relativePath, count: fileFixCount });
                    console.log(`✅ ${relativePath} (${fileFixCount}개 수정)`);
                }
            }
        });
    }

    try {
        console.log('🔍 onclick 따옴표 문제 수정 중...\n');
        processDirectory(dir);
        
        console.log('\n' + '='.repeat(70));
        console.log(`📊 수정 결과:`);
        console.log(`   - 검사한 파일: ${fileCount}개`);
        console.log(`   - 수정한 파일: ${fixedCount}개`);
        console.log(`   - 총 수정 횟수: ${totalFixes}개`);
        console.log('='.repeat(70));
        
        if (fixedCount > 0) {
            console.log('\n✨ onclick 따옴표 문제가 모두 수정되었습니다!');
            console.log('\n📝 수정 내용:');
            fixedFiles.forEach(file => {
                console.log(`   - ${file.path}: ${file.count}개`);
            });
            console.log('\n🔧 수정된 형태:');
            console.log('   ❌ onclick="location.href=\\'...\\'""');
            console.log('   ✅ onclick="location.href=\\'...\\'"');
        } else {
            console.log('\n✅ 모든 파일이 정상입니다!');
        }
        
        console.log('\n🚀 다음 단계:');
        console.log('   1. 브라우저 완전히 닫기');
        console.log('   2. 서버 재시작: npx http-server -p 8000 -o');
        console.log('   3. Ctrl+Shift+R (강력 새로고침)');
        console.log('   4. 대시보드 카드 클릭 테스트');
        console.log('   5. F12 콘솔 확인 (에러 없어야 함)');
        
    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
        process.exit(1);
    }
}

// 현재 디렉토리에서 실행
const currentDir = process.cwd();
console.log('📁 작업 디렉토리:', currentDir);
console.log('🎯 대상: onclick 속성의 따옴표 오류');
console.log('');

fixFiles(currentDir);

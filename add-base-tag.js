const fs = require('fs');
const path = require('path');

// pages 디렉토리의 모든 HTML 파일 찾기
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// HTML 파일에 base 태그 추가
function addBaseTag(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // 이미 base 태그가 있는지 확인
    if (content.includes('<base href=')) {
        console.log(`⏭️  건너뜀: ${path.relative(process.cwd(), filePath)} (이미 base 태그 존재)`);
        return;
    }

    // <head> 태그 찾기
    const headRegex = /(<head[^>]*>)/i;
    const match = content.match(headRegex);

    if (!match) {
        console.log(`⚠️  경고: ${path.relative(process.cwd(), filePath)} (head 태그 없음)`);
        return;
    }

    // <head> 다음에 base 태그 추가
    const metaCharsetRegex = /(<meta\s+charset[^>]*>)/i;
    const metaViewportRegex = /(<meta\s+name="viewport"[^>]*>)/i;

    if (content.match(metaViewportRegex)) {
        // viewport 메타 태그 다음에 추가
        content = content.replace(
            metaViewportRegex,
            '$1\n    <base href="/hyunil-law-frontend/">'
        );
    } else if (content.match(metaCharsetRegex)) {
        // charset 메타 태그 다음에 추가
        content = content.replace(
            metaCharsetRegex,
            '$1\n    <base href="/hyunil-law-frontend/">'
        );
    } else {
        // head 태그 다음에 추가
        content = content.replace(
            headRegex,
            '$1\n    <base href="/hyunil-law-frontend/">'
        );
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 수정됨: ${path.relative(process.cwd(), filePath)}`);
}

// 메인 실행
console.log('🚀 HTML 파일에 base 태그 추가 시작...\n');

const pagesDir = path.join(__dirname, 'pages');
const htmlFiles = findHtmlFiles(pagesDir);

console.log(`📁 찾은 HTML 파일: ${htmlFiles.length}개\n`);

htmlFiles.forEach(addBaseTag);

console.log('\n✨ 완료!');

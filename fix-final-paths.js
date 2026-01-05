const fs = require('fs');
const path = require('path');

// 모든 HTML 파일 찾기
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && file !== 'node_modules') {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// 파일별로 올바른 상대 경로 계산
function fixPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(__dirname, filePath);
    
    // 파일이 어느 폴더에 있는지 확인
    const isInPages = filePath.includes(path.sep + 'pages' + path.sep);
    const isRoot = !isInPages;
    
    let modified = false;
    
    if (isInPages) {
        // pages 폴더의 파일들 - ../../를 사용
        const prefix = '../../';
        
        // import 문의 절대 경로를 상대 경로로
        if (content.includes('import') && content.includes('from "/')) {
            content = content.replace(/from "\/js\//g, 'from "' + prefix + 'js/');
            modified = true;
        }
        
        // script src의 절대 경로를 상대 경로로
        if (content.includes('src="/js/')) {
            content = content.replace(/src="\/js\//g, 'src="' + prefix + 'js/');
            modified = true;
        }
        
        // 이미지 및 asset 경로
        if (content.includes('="/assets/')) {
            content = content.replace(/="\/assets\//g, '="' + prefix + 'assets/');
            modified = true;
        }
        
        // 페이지 링크
        if (content.includes('href="/pages/')) {
            content = content.replace(/href="\/pages\//g, 'href="' + prefix + 'pages/');
            modified = true;
        }
        
        // 홈 링크
        if (content.includes('href="/"') && !content.includes('href="/">')){
            content = content.replace(/href="\/"/g, 'href="' + prefix + 'index.html"');
            modified = true;
        }
        if (content.includes('href="/index.html"')) {
            content = content.replace(/href="\/index\.html"/g, 'href="' + prefix + 'index.html"');
            modified = true;
        }
        
        // base href 제거
        if (content.includes('<base href=')) {
            content = content.replace(/<base href="[^"]*">\n?\s*/g, '');
            modified = true;
        }
    } else if (isRoot) {
        // 루트의 index.html - 이미 상대 경로로 되어 있으면 그대로
        // base href만 제거
        if (content.includes('<base href=')) {
            content = content.replace(/<base href="[^"]*">\n?\s*/g, '');
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ 수정됨: ' + relativePath);
    } else {
        console.log('⏭️  변경없음: ' + relativePath);
    }
}

console.log('🚀 모든 경로를 상대 경로로 통일 시작...\n');
const htmlFiles = findHtmlFiles(__dirname);
console.log('📁 찾은 HTML 파일: ' + htmlFiles.length + '개\n');
htmlFiles.forEach(fixPaths);
console.log('\n✨ 완료! 모든 경로가 상대 경로로 통일되었습니다.');
console.log('base href도 모두 제거되었습니다.');

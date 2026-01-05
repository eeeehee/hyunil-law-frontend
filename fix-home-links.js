const fs = require('fs');
const path = require('path');

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

function fixHomeLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(__dirname, filePath);
    const isInPages = filePath.includes(path.sep + 'pages' + path.sep);
    
    let modified = false;
    
    if (isInPages) {
        const prefix = '../../';
        
        // href="/" 패턴 수정 (홈 링크)
        // <a href="/"> -> <a href="../../index.html">
        if (content.includes('href="/">')) {
            content = content.replace(/href="\/">/g, 'href="' + prefix + 'index.html">');
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

console.log('🚀 홈 링크 (href="/") 수정 시작...\n');
const htmlFiles = findHtmlFiles(__dirname);
console.log('📁 찾은 HTML 파일: ' + htmlFiles.length + '개\n');
htmlFiles.forEach(fixHomeLinks);
console.log('\n✨ 완료!');

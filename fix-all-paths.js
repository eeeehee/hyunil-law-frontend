const fs = require('fs');
const path = require('path');

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

function fixPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(__dirname, filePath);
    const isInPages = filePath.includes(path.sep + 'pages' + path.sep);

    if (isInPages) {
        const prefix = '../../';
        let modified = false;

        if (content.includes('from "/js/api.js"')) {
            content = content.replace(/from "\/js\/api\.js"/g, 'from "' + prefix + 'js/api.js"');
            modified = true;
        }
        if (content.includes('="/assets/')) {
            content = content.replace(/="\/assets\//g, '="' + prefix + 'assets/');
            modified = true;
        }
        if (content.includes('src="/js/')) {
            content = content.replace(/src="\/js\//g, 'src="' + prefix + 'js/');
            modified = true;
        }
        if (content.includes('href="/pages/')) {
            content = content.replace(/href="\/pages\//g, 'href="' + prefix + 'pages/');
            modified = true;
        }
        if (content.includes('href="/"') || content.includes('href="/index.html"')) {
            content = content.replace(/href="\/"/g, 'href="' + prefix + 'index.html"');
            content = content.replace(/href="\/index\.html"/g, 'href="' + prefix + 'index.html"');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('✅ 수정됨: ' + relativePath);
        } else {
            console.log('⏭️  변경없음: ' + relativePath);
        }
    }
}

console.log('🚀 경로 수정 시작...\n');
const pagesDir = path.join(__dirname, 'pages');
const htmlFiles = findHtmlFiles(pagesDir);
console.log('📁 찾은 HTML 파일: ' + htmlFiles.length + '개\n');
htmlFiles.forEach(fixPaths);
console.log('\n✨ 완료!');

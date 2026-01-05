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

function fixJsRedirects(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(__dirname, filePath);
    const isInPages = filePath.includes(path.sep + 'pages' + path.sep);
    
    let modified = false;
    
    if (isInPages) {
        const prefix = '../../';
        
        // location.href = "/pages/..." -> location.href = "../../pages/..."
        if (content.includes('location.href = "/pages/')) {
            content = content.replace(/location\.href = "\/pages\//g, 'location.href = "' + prefix + 'pages/');
            modified = true;
        }
        
        // location.href = "/index.html" -> location.href = "../../index.html"
        if (content.includes('location.href = "/index.html"')) {
            content = content.replace(/location\.href = "\/index\.html"/g, 'location.href = "' + prefix + 'index.html"');
            modified = true;
        }
        
        // location.href = "/" -> location.href = "../../index.html"
        const homePattern = /location\.href = "\/";(?!\w)/g;
        if (homePattern.test(content)) {
            content = content.replace(/location\.href = "\/";/g, 'location.href = "' + prefix + 'index.html";');
            modified = true;
        }
        
        // window.location.href = "/..." 패턴도 수정
        if (content.includes('window.location.href = "/pages/')) {
            content = content.replace(/window\.location\.href = "\/pages\//g, 'window.location.href = "' + prefix + 'pages/');
            modified = true;
        }
        
        if (content.includes('window.location.href = "/index.html"')) {
            content = content.replace(/window\.location\.href = "\/index\.html"/g, 'window.location.href = "' + prefix + 'index.html"');
            modified = true;
        }
        
        if (content.includes('window.location.href = "/"')) {
            content = content.replace(/window\.location\.href = "\/"/g, 'window.location.href = "' + prefix + 'index.html"');
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

console.log('🚀 JavaScript 리다이렉트 경로 수정 시작...\n');
const htmlFiles = findHtmlFiles(__dirname);
console.log('📁 찾은 HTML 파일: ' + htmlFiles.length + '개\n');
htmlFiles.forEach(fixJsRedirects);
console.log('\n✨ 완료!');

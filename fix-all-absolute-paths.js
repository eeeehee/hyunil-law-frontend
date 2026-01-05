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

function fixAllPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(__dirname, filePath);

    // pages 폴더 내의 파일인지 확인
    const isInPages = filePath.includes(path.sep + 'pages' + path.sep);

    if (!isInPages) {
        console.log('⏭️  건너뜀 (루트): ' + relativePath);
        return;
    }

    let modified = false;
    const prefix = '../../';

    // 1. import from "/js/..." → from "../../js/..."
    if (content.includes('from "/js/')) {
        content = content.replace(/from "\/js\//g, 'from "' + prefix + 'js/');
        modified = true;
    }

    // 2. import from "/pages/..." → from "../../pages/..."
    if (content.includes('from "/pages/')) {
        content = content.replace(/from "\/pages\//g, 'from "' + prefix + 'pages/');
        modified = true;
    }

    // 3. location.href = "/pages/..." → location.href = "../../pages/..."
    if (content.includes('location.href = "/pages/')) {
        content = content.replace(/location\.href = "\/pages\//g, 'location.href = "' + prefix + 'pages/');
        modified = true;
    }

    // 4. location.href = "/index.html" → location.href = "../../index.html"
    if (content.includes('location.href = "/index.html"')) {
        content = content.replace(/location\.href = "\/index\.html"/g, 'location.href = "' + prefix + 'index.html"');
        modified = true;
    }

    // 5. location.href = "/" → location.href = "../../index.html"
    const homePattern = /location\.href = "\/";(?!\w)/g;
    if (homePattern.test(content)) {
        content = content.replace(/location\.href = "\/";/g, 'location.href = "' + prefix + 'index.html";');
        modified = true;
    }

    // 6. href="/pages/..." → href="../../pages/..."
    if (content.includes('href="/pages/')) {
        content = content.replace(/href="\/pages\//g, 'href="' + prefix + 'pages/');
        modified = true;
    }

    // 7. href="/index.html" → href="../../index.html"
    if (content.includes('href="/index.html"')) {
        content = content.replace(/href="\/index\.html"/g, 'href="' + prefix + 'index.html"');
        modified = true;
    }

    // 8. src="/js/..." → src="../../js/..."
    if (content.includes('src="/js/')) {
        content = content.replace(/src="\/js\//g, 'src="' + prefix + 'js/');
        modified = true;
    }

    // 9. src="/assets/..." → src="../../assets/..."
    if (content.includes('src="/assets/')) {
        content = content.replace(/src="\/assets\//g, 'src="' + prefix + 'assets/');
        modified = true;
    }

    // 10. href="/assets/..." → href="../../assets/..."
    if (content.includes('href="/assets/')) {
        content = content.replace(/href="\/assets\//g, 'href="' + prefix + 'assets/');
        modified = true;
    }

    // 11. 작은따옴표 버전들
    if (content.includes("from '/js/")) {
        content = content.replace(/from '\/js\//g, "from '" + prefix + "js/");
        modified = true;
    }

    if (content.includes("from '/pages/")) {
        content = content.replace(/from '\/pages\//g, "from '" + prefix + "pages/");
        modified = true;
    }

    if (content.includes("location.href = '/pages/")) {
        content = content.replace(/location\.href = '\/pages\//g, "location.href = '" + prefix + "pages/");
        modified = true;
    }

    if (content.includes("location.href = '/index.html'")) {
        content = content.replace(/location\.href = '\/index\.html'/g, "location.href = '" + prefix + "index.html'");
        modified = true;
    }

    const homePattern2 = /location\.href = '\/';(?!\w)/g;
    if (homePattern2.test(content)) {
        content = content.replace(/location\.href = '\/';/g, "location.href = '" + prefix + "index.html';");
        modified = true;
    }

    if (content.includes("href='/pages/")) {
        content = content.replace(/href='\/pages\//g, "href='" + prefix + "pages/");
        modified = true;
    }

    if (content.includes("href='/index.html'")) {
        content = content.replace(/href='\/index\.html'/g, "href='" + prefix + "index.html'");
        modified = true;
    }

    if (content.includes("src='/js/")) {
        content = content.replace(/src='\/js\//g, "src='" + prefix + "js/");
        modified = true;
    }

    if (content.includes("src='/assets/")) {
        content = content.replace(/src='\/assets\//g, "src='" + prefix + "assets/");
        modified = true;
    }

    if (content.includes("href='/assets/")) {
        content = content.replace(/href='\/assets\//g, "href='" + prefix + "assets/");
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('✅ 수정됨: ' + relativePath);
    } else {
        console.log('⏭️  변경없음: ' + relativePath);
    }
}

console.log('🚀 모든 절대 경로를 상대 경로로 수정 시작...\n');
const htmlFiles = findHtmlFiles(__dirname);
console.log('📁 찾은 HTML 파일: ' + htmlFiles.length + '개\n');
htmlFiles.forEach(fixAllPaths);
console.log('\n✨ 완료!');

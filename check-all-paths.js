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

function checkAbsolutePaths(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(__dirname, filePath);

    const issues = [];

    // 1. href="/..." 패턴 (이메일 보호 제외)
    const hrefPattern = /href=["']\/(?!cdn-cgi)/g;
    let match;
    while ((match = hrefPattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push(`Line ${line}: ${match[0]}`);
    }

    // 2. src="/..." 패턴
    const srcPattern = /src=["']\/(?!\/)/g;
    while ((match = srcPattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push(`Line ${line}: ${match[0]}`);
    }

    // 3. from "/..." 패턴
    const fromPattern = /from ["']\/(?!\/)/g;
    while ((match = fromPattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push(`Line ${line}: ${match[0]}`);
    }

    // 4. location.href = "/..." 패턴
    const locationPattern = /location\.href\s*=\s*["']\/(?!\/)/g;
    while ((match = locationPattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push(`Line ${line}: ${match[0]}`);
    }

    // 5. onclick="location.href='/..." 패턴
    const onclickPattern = /onclick=["'][^"']*location\.href\s*=\s*['"]\/(?!\/)/g;
    while ((match = onclickPattern.exec(content)) !== null) {
        const line = content.substring(0, match.index).split('\n').length;
        issues.push(`Line ${line}: ${match[0]}`);
    }

    if (issues.length > 0) {
        console.log(`\n❌ ${relativePath}`);
        issues.forEach(issue => console.log(`   ${issue}`));
    }
}

console.log('🔍 전체 HTML 파일에서 절대 경로 패턴 검색 중...\n');
const htmlFiles = findHtmlFiles(__dirname);
console.log(`📁 찾은 HTML 파일: ${htmlFiles.length}개\n`);

let hasIssues = false;
htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const issues = [];

    // 절대 경로 패턴 체크
    const patterns = [
        /href=["']\/(?!cdn-cgi)/g,
        /src=["']\/(?!\/)/g,
        /from ["']\/(?!\/)/g,
        /location\.href\s*=\s*["']\/(?!\/)/g,
        /onclick=["'][^"']*location\.href\s*=\s*['"]\/(?!\/)/g
    ];

    patterns.forEach(pattern => {
        if (pattern.test(content)) {
            hasIssues = true;
        }
    });

    checkAbsolutePaths(file);
});

if (!hasIssues) {
    console.log('\n✅ 모든 파일이 깨끗합니다! 절대 경로가 발견되지 않았습니다.');
} else {
    console.log('\n⚠️  위에 표시된 파일들에 절대 경로가 남아있습니다.');
}

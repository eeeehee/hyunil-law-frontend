@echo off
chcp 65001 > nul
cls

echo ========================================
echo   현일 법무법인 프로젝트 실행
echo ========================================
echo.

REM 현재 디렉토리 확인
echo 📁 현재 위치: %CD%
echo.

REM Node.js 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo 1. https://nodejs.org 접속
    echo 2. LTS 버전 다운로드
    echo 3. 설치 후 이 파일 다시 실행
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 버전: 
node -v
echo.

echo ========================================
echo 🚀 서버 시작 중...
echo ========================================
echo.
echo 📍 접속 URL:
echo    http://localhost:8000/
echo    http://localhost:8000/pages/public/login.html
echo    http://localhost:8000/pages/admin/admin.html
echo.
echo 💡 팁:
echo    - 페이지 간 이동: 메뉴 클릭
echo    - 새로고침: F5
echo    - 종료: Ctrl+C
echo.

echo ⚠️  참고: localhost에서 로그인이 안 되면
echo    Firebase Console에서 localhost를 승인된 도메인에 추가하세요!
echo.

REM 로컬 IP 주소 표시
ipconfig | findstr "IPv4"
echo.

REM 브라우저 자동 열기 (로컬 IP 사용 - 로그인 작동)
for /f "tokens=14" %%i in ('ipconfig ^| findstr "IPv4"') do (
    start http://%%i:8000/
    goto :opened
)
:opened

REM http-server 실행 (캐시 비활성화)
npx http-server -p 8000 -c-1

pause

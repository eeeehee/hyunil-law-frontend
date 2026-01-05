@echo off
chcp 65001 > nul
cls

echo ========================================
echo   현일 법무법인 - 로컬 IP로 실행
echo ========================================
echo.

REM Node.js 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo    https://nodejs.org 에서 설치하세요.
    pause
    exit /b 1
)

echo ✅ Node.js 발견
echo.

REM 로컬 IP 주소 찾기
echo 🔍 로컬 IP 주소 확인 중...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%i
    goto :found
)

:found
REM 공백 제거
set IP=%IP: =%
echo ✅ 로컬 IP: %IP%
echo.

echo ========================================
echo 🚀 서버 시작
echo ========================================
echo.
echo 📍 접속 주소:
echo    http://%IP%:8000/
echo    http://%IP%:8000/pages/public/login.html
echo.
echo 💡 이 주소를 사용하면 로그인이 정상 작동합니다!
echo.
echo ⏹️  종료: Ctrl+C
echo.

REM 브라우저 열기
start http://%IP%:8000/

REM 서버 실행
npx http-server -p 8000 -c-1

pause

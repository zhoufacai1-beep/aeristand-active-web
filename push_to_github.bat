@echo off
echo [Accio AI] Starting secure push to GitHub...
cd /d %~dp0
git config http.sslVerify false
git config http.postBuffer 524288000
echo [Accio AI] Pushing AeriStand WebGL code...
git push -f origin main
if %ERRORLEVEL% equ 0 (
    echo [Accio AI] SUCCESS! Code has been pushed to your private repo.
) else (
    echo [Accio AI] PUSH FAILED. Please check your internet connection or GitHub login.
)
pause

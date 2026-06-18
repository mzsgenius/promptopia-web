@echo off
chcp 65001 >nul
echo ========================================
echo  PrompTopia 生产部署 — 一键推送
echo ========================================
echo.

echo [1/4] Push 到 GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ❌ GitHub Push 失败，请检查网络
    pause
    exit /b 1
)
echo ✅ Push 成功
echo.

echo [2/4] SSH 连接服务器部署...
echo 密码: Mmzzss060112
echo.
ssh ubuntu@150.109.70.58 "cd /root/promptopia-web && git pull && npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build && pm2 restart promptopia"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 服务器部署失败
    pause
    exit /b 1
)
echo.

echo [3/4] 验证服务状态...
ssh ubuntu@150.109.70.58 "pm2 status"
echo.

echo ========================================
echo ✅ 部署完成！访问 http://promptopia.cn
echo ========================================
pause

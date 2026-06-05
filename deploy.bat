@echo off
chcp 65001 >nul
echo ========================================
echo  PrompTopia 一键部署脚本
echo  服务器: 150.109.70.58
echo ========================================
echo.

:: 检测 ssh 是否可用
where ssh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 找不到 ssh 命令，请安装 OpenSSH Client
    echo Windows 设置 → 应用 → 可选功能 → 添加 OpenSSH Client
    pause
    exit /b 1
)

echo ✅ SSH 已安装
echo.
echo 正在部署到服务器，请输入密码: Mmzzss060112
echo.

:: 复制部署脚本到服务器
echo 📤 上传部署脚本...
scp deploy.sh root@150.109.70.58:/root/deploy.sh

:: 在服务器上执行
echo 🚀 开始部署...
ssh root@150.109.70.58 "chmod +x /root/deploy.sh && bash /root/deploy.sh"

echo.
echo ✅ 部署完成！
echo 访问 http://150.109.70.58
pause

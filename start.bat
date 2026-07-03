@echo off
chcp 65001 >nul
echo ==========================================
echo   拼席月度结算管理系统 - 本地启动脚本
echo ==========================================
echo.

:: 查找可用端口
set PORT=8080

:: 启动 Python HTTP 服务器（后台）
echo 正在启动本地服务器 http://localhost:%PORT% ...
start /min "拼席结算系统服务器" cmd /c "python -m http.server %PORT% >nul 2>&1"

:: 等待服务器启动
timeout /t 2 /nobreak >nul

:: 打开浏览器
echo 正在打开浏览器...
start http://localhost:%PORT%

echo.
echo 系统已启动，请在浏览器中使用。
echo 如需关闭服务器，请关闭弹出的命令行窗口。
echo.
pause

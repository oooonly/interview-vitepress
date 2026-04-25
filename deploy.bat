@echo off
chcp 65001 >nul
echo ================================================
echo   VitePress GitHub Pages 一键部署脚本 (quiz)
echo ================================================
echo.

cd /d "C:\Users\11848\Downloads\tmp\opencode\interview-vitepress"

echo [1/6] 检查并添加所有更改到 git...
git add .
if errorlevel 1 (
    echo git add 失败！
    pause
    exit /b 1
)

echo [2/6] 提交更改...
git commit -m "chore: rename repo to quiz"
if errorlevel 1 (
    echo 没有需要提交的更改，继续...
)

echo [3/6] 推送到远程 master 分支...
git push origin master
if errorlevel 1 (
    echo 推送失败！
    pause
    exit /b 1
)

echo [4/6] 安装依赖并构建 VitePress 站点...
call bun install
if errorlevel 1 (
    echo 依赖安装失败！
    pause
    exit /b 1
)

call bun run build
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

echo [5/6] 创建 .nojekyll 文件...
type nul > "docs\.vitepress\dist\.nojekyll"

echo [6/6] 部署到 gh-pages 分支...
cd docs\.vitepress\dist
if exist .git rmdir /s /q .git
git init
git add -A
git commit -m "deploy: update gh-pages"
git push -f https://github.com/oooonly/quiz.git master:gh-pages
if errorlevel 1 (
    echo 部署失败！
    pause
    exit /b 1
)

cd /d "C:\Users\11848\Downloads\tmp\opencode\interview-vitepress"

echo.
echo ================================================
echo   部署成功！
echo   访问地址: https://oooonly.github.io/quiz/
echo   注意：部署后可能需要等待 1-2 分钟生效
echo ================================================
pause

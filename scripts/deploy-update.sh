#!/bin/bash
# PrompTopia 增量部署脚本 — 在服务器上执行
# 用法（在服务器上）:
#   cd /root/promptopia-web
#   bash scripts/deploy-update.sh

set -e

echo "========================================"
echo " PrompTopia 增量更新"
echo "========================================"

cd /root/promptopia-web

echo ""
echo "=== 1. 拉取最新代码 ==="
git pull

echo ""
echo "=== 2. 安装依赖 ==="
npm install

echo ""
echo "=== 3. 生成 Prisma 客户端 ==="
npx prisma generate

echo ""
echo "=== 4. 构建 ==="
npm run build

echo ""
echo "=== 5. 重启 PM2 进程 ==="
pm2 restart promptopia

echo ""
echo "=== 6. 查看状态 ==="
pm2 status

echo ""
echo "========================================"
echo " ✅ 部署完成！"
echo "    访问 http://promptopia.cn"
echo "========================================"

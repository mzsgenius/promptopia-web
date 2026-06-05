#!/bin/bash
# PrompTopia 部署脚本 — 在服务器上执行
# 用法: ssh root@150.109.70.58 'bash -s' < deploy.sh

set -e

echo "=== 1. 安装 Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v
npm -v

echo "=== 2. 安装 PM2（进程管理）==="
npm install -g pm2

echo "=== 3. 克隆代码 ==="
cd /root
git clone https://github.com/mzsgenius/promptopia-web.git
cd promptopia-web

echo "=== 4. 创建环境变量 ==="
cat > .env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL="https://rqlyuxjttfjndkmafypm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbHl1eGp0dGZqbmRrbWFmeXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzMzODYsImV4cCI6MjA5NjA0OTM4Nn0.xqjE1PYWb9INXMdVTOy_MmBL-qLhtQgxONVnLfcn11s"
DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@db.rqlyuxjttfjndkmafypm.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://150.109.70.58"
EOF

echo "=== 5. 安装依赖 ==="
npm install

echo "=== 6. 生成 Prisma 客户端 ==="
npx prisma generate

echo "=== 7. 构建 ==="
npm run build

echo "=== 8. 启动（PM2）==="
pm2 delete promptopia 2>/dev/null || true
PORT=3000 pm2 start npm --name "promptopia" -- start
pm2 save
pm2 startup

echo "=== 9. 部署完成 ==="
echo "访问: http://150.109.70.58"

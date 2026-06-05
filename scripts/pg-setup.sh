#!/bin/bash
# pg-setup.sh — run directly on the server
set -e

echo "=== 1. Restart PostgreSQL ==="
systemctl restart postgresql
sleep 2

echo "=== 2. Create database ==="
su - postgres -c "psql -c \"CREATE DATABASE promptopia OWNER postgres;\"" 2>/dev/null || true

echo "=== 3. Push Prisma schema ==="
cd /root/promptopia-web
DATABASE_URL="postgresql://postgres@localhost:5432/promptopia" npx prisma db push --accept-data-loss 2>&1 | tail -3

echo "=== 4. Export + Import data ==="
cat > /tmp/copy-data.mjs << 'SCRIPT'
import pg from "pg";
const remote = new pg.Pool({connectionString:"postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"});
const local = new pg.Pool({connectionString:"postgresql://postgres@localhost:5432/promptopia"});
async function run(){
  const users = (await remote.query('SELECT * FROM "User"')).rows;
  for(const u of users){
    await local.query('INSERT INTO "User"(id,"supabaseId",email,name,avatar,"createdAt","updatedAt") VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING',[u.id,u.supabaseId,u.email,u.name,u.avatar,u.createdAt,u.updatedAt]);
  }
  console.log("Users: "+users.length);
  const cases = (await remote.query('SELECT * FROM "Case"')).rows;
  for(const c of cases){
    await local.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","primaryTool",difficulty,lessons,"viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) ON CONFLICT(slug) DO NOTHING',[c.id,c.slug,c.title,c.category,JSON.stringify(c.tags||[]),JSON.stringify(c.tools||[]),c.summary,c.content,JSON.stringify(c.seoKeywords||[]),c.authorId,c.intent,c.resultType,c.primaryTool,c.difficulty,c.lessons,c.viewCount,c.likeCount,c.bookmarkCount,c.publishedAt,c.createdAt,c.updatedAt]);
  }
  console.log("Cases: "+cases.length);
  await remote.end(); await local.end();
  console.log("DONE");
}
run().catch(e=>{console.log("ERR: "+e.message)});
SCRIPT

cd /root/promptopia-web && node /tmp/copy-data.mjs

echo "=== 5. Update .env ==="
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://postgres@localhost:5432/promptopia\"|" /root/promptopia-web/.env
sed -i "s|DIRECT_URL=.*|DIRECT_URL=\"postgresql://postgres@localhost:5432/promptopia\"|" /root/promptopia-web/.env

echo "=== 6. Rebuild ==="
cd /root/promptopia-web && npm run build 2>&1 | tail -3
pm2 restart promptopia

echo "ALL_DONE"

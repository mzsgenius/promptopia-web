// install-pg.mjs — install PostgreSQL on server + migrate data
import { Client } from "ssh2";
const c = new Client();

async function exec(cmd) {
  return new Promise((resolve) => {
    c.exec(cmd, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.stderr.on("data", (d) => o += d.toString());
      s.on("close", () => resolve(o));
    });
  });
}

c.on("ready", async () => {
  console.log("✅ SSH\n");

  // Step 1: Install PostgreSQL on the server
  console.log("📦 1/5 安装 PostgreSQL...");
  const r1 = await exec(`echo Mmzzss060112 | sudo -S bash -c '
apt-get update -qq && apt-get install -y -qq postgresql postgresql-client
sleep 2
'`);
  console.log(r1.slice(-200));

  // Step 2: Start PostgreSQL and create database
  console.log("\n🗄️ 2/5 启动 PostgreSQL + 创建数据库...");
  const r2 = await exec(`echo Mmzzss060112 | sudo -S bash -c '
systemctl start postgresql
systemctl enable postgresql
sleep 1
su - postgres -c "psql -c \\"CREATE USER promptopia WITH PASSWORD \\\\\\"promptopia123\\\\\\";\\""
su - postgres -c "psql -c \\"CREATE DATABASE promptopia OWNER promptopia;\\""
su - postgres -c "psql -c \\"GRANT ALL PRIVILEGES ON DATABASE promptopia TO promptopia;\\""
echo "DB_READY"
'`);
  console.log(r2.slice(-200));

  // Step 3: Create tables
  console.log("\n📋 3/5 创建表结构...");
  const r3 = await exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web
DATABASE_URL="postgresql://promptopia:promptopia123@localhost:5432/promptopia" npx prisma db push --accept-data-loss --schema=prisma/schema.prisma 2>&1
echo "TABLES_READY=$?"
'`);
  console.log(r3.slice(-500));

  // Step 4: Export data from Supabase and import to local
  console.log("\n🔁 4/5 从 Supabase 迁移数据到本地...");
  const exportScript = `
const { PrismaClient: PClient } = require('/root/promptopia-web/src/generated/prisma/client.js');
const { PrismaPg } = require('/root/promptopia-web/node_modules/@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');

async function run() {
  // Export from Supabase
  const remote = new PClient({
    adapter: new PrismaPg({
      connectionString: 'postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
    }),
  });

  const cases = await remote.case.findMany({ include: { author: true } });
  const users = await remote.user.findMany();
  console.log('Exported: ' + users.length + ' users, ' + cases.length + ' cases');
  fs.writeFileSync('/tmp/migrate-data.json', JSON.stringify({ users, cases }));
  await remote.$disconnect();

  // Import to local
  const local = new Pool({
    connectionString: 'postgresql://promptopia:promptopia123@localhost:5432/promptopia',
  });

  for (const u of users) {
    await local.query(
      'INSERT INTO "User" (id, "supabaseId", email, name, avatar, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING',
      [u.id, u.supabaseId, u.email, u.name, u.avatar, u.createdAt, u.updatedAt]
    );
  }
  console.log('Imported ' + users.length + ' users');

  for (const c of cases) {
    await local.query(
      'INSERT INTO "Case" (id, slug, title, category, tags, tools, summary, content, "seoKeywords", "authorId", intent, "resultType", "primaryTool", difficulty, lessons, "viewCount", "likeCount", "bookmarkCount", "publishedAt", "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) ON CONFLICT (slug) DO NOTHING',
      [c.id, c.slug, c.title, c.category, JSON.stringify(c.tags || []), JSON.stringify(c.tools || []), c.summary, c.content, JSON.stringify(c.seoKeywords || []), c.authorId, c.intent, c.resultType, c.primaryTool, c.difficulty, c.lessons, c.viewCount, c.likeCount, c.bookmarkCount, c.publishedAt, c.createdAt, c.updatedAt]
    );
  }
  console.log('Imported ' + cases.length + ' cases');
  await local.end();
  console.log('MIGRATE_DONE');
}
run().catch(function(e) { console.log('ERR: ' + e.message); process.exit(1); });
`;

  // Write and run migration script
  const b64 = Buffer.from(exportScript).toString("base64");
  const r4 = await exec(`echo ${b64} | base64 -d > /tmp/migrate.js && echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://promptopia:promptopia123@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && node /tmp/migrate.js' 2>&1`);
  console.log(r4.slice(-500));

  // Step 5: Update .env and restart
  console.log("\n⚙️ 5/5 更新环境变量 + 重启...");
  await exec(`echo Mmzzss060112 | sudo -S bash -c '
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://promptopia:promptopia123@localhost:5432/promptopia\"|" /root/promptopia-web/.env
sed -i "s|DIRECT_URL=.*|DIRECT_URL=\"postgresql://promptopia:promptopia123@localhost:5432/promptopia\"|" /root/promptopia-web/.env
cd /root/promptopia-web && npm run build 2>&1 | tail -3
pm2 restart promptopia
echo "ALL_DONE"
'`);
  console.log("✅ 迁移完成！");

  // Verify
  const v = await exec(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>&1`);
  console.log("HTTP:", v);

  c.end();
});

c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

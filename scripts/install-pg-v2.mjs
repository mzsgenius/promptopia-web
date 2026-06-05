// install-pg-v2.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const migrateTs = `
import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { writeFileSync, readFileSync } from "fs";

async function run() {
  const remote = new PrismaClient({
    adapter: new PrismaPg({ connectionString: "postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" }),
  });
  const users = await remote.user.findMany();
  const cases = await remote.case.findMany({ include: { author: true } });
  console.log("Exported: " + users.length + " users, " + cases.length + " cases");
  writeFileSync("/tmp/seed.json", JSON.stringify({ users, cases }));
  await remote.$disconnect();

  const local = new pg.Pool({ connectionString: "postgresql://promptopia:promptopia123@localhost:5432/promptopia" });
  for (const u of users) {
    await local.query(\`INSERT INTO "User" (id, "supabaseId", email, name, avatar, "createdAt", "updatedAt") VALUES(\$1,\$2,\$3,\$4,\$5,\$6,\$7) ON CONFLICT (id) DO NOTHING\`, [u.id, u.supabaseId, u.email, u.name, u.avatar, u.createdAt, u.updatedAt]);
  }
  for (const c of cases) {
    await local.query(\`INSERT INTO "Case" (id, slug, title, category, tags, tools, summary, content, "seoKeywords", "authorId", intent, "resultType", "primaryTool", difficulty, lessons, "viewCount", "likeCount", "bookmarkCount", "publishedAt", "createdAt", "updatedAt") VALUES(\$1,\$2,\$3,\$4,\$5::jsonb,\$6::jsonb,\$7,\$8,\$9::jsonb,\$10,\$11,\$12,\$13,\$14,\$15,\$16,\$17,\$18,\$19,\$20,\$21) ON CONFLICT (slug) DO NOTHING\`, [c.id, c.slug, c.title, c.category, JSON.stringify(c.tags||[]), JSON.stringify(c.tools||[]), c.summary, c.content, JSON.stringify(c.seoKeywords||[]), c.authorId, c.intent, c.resultType, c.primaryTool, c.difficulty, c.lessons, c.viewCount, c.likeCount, c.bookmarkCount, c.publishedAt, c.createdAt, c.updatedAt]);
  }
  console.log("Imported " + cases.length + " cases");
  await local.end();
  console.log("MIGRATE_DONE");
}
run().catch(function(e) { console.log("ERR: " + e.message); process.exit(1); });
`;
const tsB64 = Buffer.from(migrateTs).toString("base64");

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

  // 1. Install PostgreSQL
  console.log("📦 1/5 安装 PostgreSQL...");
  let r = await exec(`echo Mmzzss060112 | sudo -S apt-get install -y -qq postgresql postgresql-client 2>&1`);
  console.log(r.slice(-200));

  // 2. Start + create user/db
  console.log("\n🗄️ 2/5 创建数据库...");
  r = await exec(`echo Mmzzss060112 | sudo -S bash -c '
systemctl start postgresql 2>/dev/null; sleep 1
su - postgres -c "psql -c \\"CREATE USER promptopia WITH PASSWORD \\\\\\"promptopia123\\\\\\";\\"" 2>/dev/null
su - postgres -c "psql -c \\"CREATE DATABASE promptopia OWNER promptopia;\\"" 2>/dev/null
su - postgres -c "psql -c \\"GRANT ALL PRIVILEGES ON DATABASE promptopia TO promptopia;\\"" 2>/dev/null
echo PG_READY
'`);
  console.log(r.slice(-200));

  // 3. Create tables
  console.log("\n📋 3/5 建表...");
  r = await exec(`echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://promptopia:promptopia123@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && npx prisma db push --accept-data-loss 2>&1 | tail -3'`);
  console.log(r.slice(-400));

  // 4. Migrate data
  console.log("\n🔁 4/5 迁移数据...");
  r = await exec(`echo ${tsB64} | base64 -d > /tmp/migrate.ts && echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npx tsx /tmp/migrate.ts' 2>&1`);
  console.log(r.slice(-500));

  // 5. Update .env + rebuild
  console.log("\n⚙️ 5/5 更新配置...");
  r = await exec(`echo Mmzzss060112 | sudo -S bash -c '
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://promptopia:promptopia123@localhost:5432/promptopia\"|" /root/promptopia-web/.env
sed -i "s|DIRECT_URL=.*|DIRECT_URL=\"postgresql://promptopia:promptopia123@localhost:5432/promptopia\"|" /root/promptopia-web/.env
cd /root/promptopia-web && npx prisma generate 2>&1 | tail -2
npm run build 2>&1 | tail -3
pm2 restart promptopia 2>/dev/null
echo ALL_DONE
'`);
  console.log(r.slice(-500));

  // Verify
  await new Promise(r => setTimeout(r, 5000));
  const v = await exec(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>&1`);
  console.log("\n✅ HTTP:", v);

  c.end();
});

c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

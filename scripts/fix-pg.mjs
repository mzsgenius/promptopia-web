// fix-pg.mjs
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
  console.log("✅ SSH");

  // Reset user + password properly
  let r = await exec(`echo Mmzzss060112 | sudo -S bash -c '
systemctl restart postgresql
sleep 2
su - postgres -c "psql -c \\"ALTER USER postgres PASSWORD \\\\\\"postgres\\\\\\";\\""
su - postgres -c "psql -c \\"CREATE DATABASE promptopia OWNER postgres;\\"" 2>/dev/null
echo OK
'`);
  console.log("PG:", r.slice(-200));

  // Push schema
  r = await exec(`echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && npx prisma db push --accept-data-loss 2>&1 | tail -3'`);
  console.log("Schema:", r.slice(-300));

  // Now write migrate script and run it
  const migrateCode = `
import { readFileSync, writeFileSync } from "fs";
import pg from "pg";
const remote = new pg.Pool({ connectionString: "postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" });
const local = new pg.Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });

async function run() {
  // Export users
  const users = (await remote.query("SELECT * FROM \\"User\\"")).rows;
  for (const u of users) {
    await local.query("INSERT INTO \\"User\\" (id,\\"supabaseId\\",email,name,avatar,\\"createdAt\\",\\"updatedAt\\") VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO NOTHING", [u.id,u.supabaseId,u.email,u.name,u.avatar,u.createdAt,u.updatedAt]);
  }
  console.log("Users:", users.length);

  // Export cases
  const cases = (await remote.query("SELECT * FROM \\"Case\\"")).rows;
  for (const c of cases) {
    await local.query("INSERT INTO \\"Case\\" (id,slug,title,category,tags,tools,summary,content,\\"seoKeywords\\",\\"authorId\\",intent,\\"resultType\\",\\"primaryTool\\",difficulty,lessons,\\"viewCount\\",\\"likeCount\\",\\"bookmarkCount\\",\\"publishedAt\\",\\"createdAt\\",\\"updatedAt\\") VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9::jsonb,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) ON CONFLICT(slug) DO NOTHING", [c.id,c.slug,c.title,c.category,JSON.stringify(c.tags||[]),JSON.stringify(c.tools||[]),c.summary,c.content,JSON.stringify(c.seoKeywords||[]),c.authorId,c.intent,c.resultType,c.primaryTool,c.difficulty,c.lessons,c.viewCount,c.likeCount,c.bookmarkCount,c.publishedAt,c.createdAt,c.updatedAt]);
  }
  console.log("Cases:", cases.length);
  await remote.end(); await local.end();
  console.log("MIGRATE_DONE");
}
run().catch(function(e) { console.log("ERR: " + e.message); });
`;
  const b64 = Buffer.from(migrateCode).toString("base64");

  r = await exec(`echo ${b64} | base64 -d > /tmp/migrate-local.mjs && echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && node /tmp/migrate-local.mjs' 2>&1`);
  console.log("Migrate:", r.slice(-500));

  // Update .env + rebuild
  r = await exec(`echo Mmzzss060112 | sudo -S bash -c '
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/promptopia\"|" /root/promptopia-web/.env
sed -i "s|DIRECT_URL=.*|DIRECT_URL=\"postgresql://postgres:postgres@localhost:5432/promptopia\"|" /root/promptopia-web/.env
cd /root/promptopia-web && npm run build 2>&1 | tail -3
pm2 restart promptopia
echo DONE
'`);
  console.log("Build:", r.slice(-300));

  await new Promise(r => setTimeout(r, 5000));
  const v = await exec(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>&1`);
  console.log("HTTP:", v);

  c.end();
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

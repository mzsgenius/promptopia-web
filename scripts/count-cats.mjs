// count-by-cat.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" node -e "
const { PrismaClient } = require('/root/promptopia-web/src/generated/prisma/client.js');
const { PrismaPg } = require('/root/promptopia-web/node_modules/@prisma/adapter-pg');
async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const all = await p.case.groupBy({ by: ['category'], _count: true });
  for (const r of all.sort((a,b) => b._count - a._count)) {
    console.log(r.category + ': ' + r._count);
  }
  await p.\$disconnect();
}
main().catch(e => { console.log('ERR: ' + e.message); process.exit(1); });
" 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

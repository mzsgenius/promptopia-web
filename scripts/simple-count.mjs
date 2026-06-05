// simple-count.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" node -e "
const { PrismaClient } = require('/root/promptopia-web/src/generated/prisma/client.js');
const { PrismaPg } = require('/root/promptopia-web/node_modules/@prisma/adapter-pg');
async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const cats = await p.case.findMany({ select: { category: true } });
  const m = {};
  cats.forEach(c => { m[c.category] = (m[c.category] || 0) + 1; });
  Object.entries(m).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(k + ': ' + v));
  await p.\$disconnect();
}
main().catch(e => console.log('ERR: ' + e.message));
" 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

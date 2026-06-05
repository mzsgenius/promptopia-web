// imp2.mjs — write to tmp, then sudo move
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const json = readFileSync("promptopia-web/scripts/cases-new.json", "utf-8");
const b64 = Buffer.from(json).toString("base64");

c.on("ready", () => {
  console.log("✅ SSH");
  c.exec(`echo ${b64} | base64 -d | tee /tmp/cases-new.json > /dev/null && echo OK_WRITE`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      if (!o.includes("OK_WRITE")) { console.log("❌ write failed"); c.end(); return; }
      // sudo move + run import
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'mv /tmp/cases-new.json /root/cases-new.json && cd /root/promptopia-web && node -e "
const { PrismaClient } = require(\\\"@prisma/client\\\");
const { PrismaPg } = require(\\\"@prisma/adapter-pg\\\");
const fs = require(\\\"fs\\\");
const cases = JSON.parse(fs.readFileSync(\\\"/root/cases-new.json\\\", \\\"utf-8\\\"));

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const user = await prisma.user.findFirst();
  if (!user) { console.log(\\\"No user\\\"); return; }
  console.log(\\\"User:\\\", user.id);
  let ok = 0, skip = 0;
  for (const c of cases) {
    const exists = await prisma.case.findUnique({ where: { slug: c.slug } });
    if (exists) { skip++; continue; }
    await prisma.case.create({ data: { slug: c.slug, title: c.title, category: c.category, tags: c.tags, tools: c.tools, summary: c.summary, content: c.content, seoKeywords: c.seoKeywords, intent: c.intent, resultType: c.resultType, primaryTool: c.primaryTool, authorId: user.id, publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000) } });
    ok++;
  }
  console.log(\`Done: \${ok} imported, \${skip} skipped\`);
  await prisma.\$disconnect();
}
main().catch(e => { console.log(\\\"Error:\\\", e.message); process.exit(1); });
"'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.stderr.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2.slice(-500)); c.end(); });
      });
    });
    s.stderr.on("data", (d) => o += d.toString());
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

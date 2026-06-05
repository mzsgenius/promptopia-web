// imp3.mjs — write files in sequence, then import
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const json = readFileSync("promptopia-web/scripts/cases-new.json", "utf-8");
const jsonB64 = Buffer.from(json).toString("base64");

const importScript = `
const { PrismaClient } = require('/root/promptopia-web/src/generated/prisma/client.js');
const { PrismaPg } = require('/root/promptopia-web/node_modules/@prisma/adapter-pg');
const cases = require('/tmp/cases-new.json');
async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const user = await prisma.user.findFirst();
  if (!user) { console.log('No user'); return; }
  console.log('User:', user.id);
  let ok = 0, skip = 0;
  for (const c of cases) {
    const exists = await prisma.case.findUnique({ where: { slug: c.slug } });
    if (exists) { skip++; continue; }
    await prisma.case.create({ data: { slug: c.slug, title: c.title, category: c.category, tags: c.tags, tools: c.tools, summary: c.summary, content: c.content, seoKeywords: c.seoKeywords, intent: c.intent, resultType: c.resultType, primaryTool: c.primaryTool, authorId: user.id, publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000) } });
    ok++;
  }
  console.log('Done: ' + ok + ' imported, ' + skip + ' skipped');
  await prisma.$disconnect();
}
main().catch(e => { console.log('Error:', e.message); process.exit(1); });
`.trim();
const scriptB64 = Buffer.from(importScript).toString("base64");

c.on("ready", () => {
  console.log("✅ SSH");

  // Write files via sudo
  c.exec(`echo ${jsonB64} | base64 -d | sudo tee /tmp/cases-new.json > /dev/null && echo JSON_OK`, (e1, s1) => {
    let o1 = "";
    s1.on("close", (c1) => {
      s1.on("data", (d) => o1 += d.toString());
      if (!o1.includes("JSON_OK") && c1 !== 0) { setTimeout(() => {
        if (!o1.includes("JSON_OK")) { console.log("❌ JSON write failed"); c.end(); return; }
      }, 1000); }

      c.exec(`echo ${scriptB64} | base64 -d | sudo tee /tmp/import-cases.js > /dev/null && echo SCRIPT_OK`, (e2, s2) => {
        let o2 = "";
        s2.on("close", (c2) => {
          s2.on("data", (d) => o2 += d.toString());

          // Run import
          c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && node /tmp/import-cases.js'`, (e3, s3) => {
            let o3 = "";
            s3.on("data", (d) => o3 += d.toString());
            s3.stderr.on("data", (d) => o3 += d.toString());
            s3.on("close", () => { console.log(o3); c.end(); });
          });
        });
        s2.stderr.on("data", (d) => o2 += d.toString());
        s2.on("data", (d) => o2 += d.toString());
      });
    });
    s1.stderr.on("data", (d) => o1 += d.toString());
    s1.on("data", (d) => o1 += d.toString());
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

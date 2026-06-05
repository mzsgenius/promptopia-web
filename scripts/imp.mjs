// imp.mjs — simpler: write json + run a script on server
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

// Read and encode
const jsonB64 = readFileSync("promptopia-web/scripts/cases-new.json", "base64");

// A simple node script to run on the server
const scriptB64 = Buffer.from(`
const { PrismaClient } = require('/root/promptopia-web/node_modules/@prisma/client');
const { PrismaPg } = require('/root/promptopia-web/node_modules/@prisma/adapter-pg');
const cases = require('/root/cases-new.json');

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const user = await prisma.user.findFirst();
  if (!user) { console.log('No user found'); return; }
  console.log('User:', user.id);

  let ok = 0, skip = 0;
  for (const c of cases) {
    const exists = await prisma.case.findUnique({ where: { slug: c.slug } });
    if (exists) { skip++; continue; }

    await prisma.case.create({
      data: {
        slug: c.slug, title: c.title, category: c.category,
        tags: c.tags, tools: c.tools, summary: c.summary,
        content: c.content, seoKeywords: c.seoKeywords,
        intent: c.intent, resultType: c.resultType,
        primaryTool: c.primaryTool,
        authorId: user.id,
        viewCount: Math.floor(Math.random() * 200),
        likeCount: Math.floor(Math.random() * 50),
        bookmarkCount: Math.floor(Math.random() * 20),
        publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000),
      },
    });
    ok++;
    console.log('OK:', c.slug);
  }
  console.log(\`Done: \${ok} imported, \${skip} skipped\`);
  await prisma.\$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
`.trim()).toString("base64");

c.on("ready", () => {
  console.log("✅ SSH");

  // Upload JSON + script, then run
  const cmds = `
echo ${jsonB64} | base64 -d > /root/cases-new.json && \
echo ${scriptB64} | base64 -d > /root/import.js && \
echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && node /root/import.js'
  `.trim().replace(/\n/g, " ");

  c.exec(cmds, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", (code) => { console.log(o.slice(-500)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

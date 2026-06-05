// imp4.mjs — use tsx on server to run import
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const jsonB64 = readFileSync("promptopia-web/scripts/cases-new.json", "base64");

const SCRIPT_PATH = "/root/promptopia-web/tmp-import.ts";
const importScriptTs = `
import { PrismaClient } from "/root/promptopia-web/src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";

const cases = JSON.parse(readFileSync("/root/promptopia-web/tmp-cases.json", "utf-8"));

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

  const user = await prisma.user.findFirst();
  if (!user) { console.log("No user"); return; }
  console.log("User:", user.id);

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
        publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000),
      },
    });
    ok++;
    console.log("OK:", c.slug.slice(0, 40));
  }
  console.log("Done:", ok, "imported,", skip, "skipped");
  await prisma.$disconnect();
}
main().catch((e) => { console.log("Error:", e.message); process.exit(1); });
`.trim();
const scriptB64 = Buffer.from(importScriptTs).toString("base64");

c.on("ready", () => {
  console.log("✅ SSH");
  // Write JSON + script to /tmp, then run with tsx
  c.exec(`echo ${jsonB64} | base64 -d | sudo tee /root/promptopia-web/tmp-cases.json > /dev/null && echo ${scriptB64} | base64 -d | sudo tee ${SCRIPT_PATH} > /dev/null && echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" bash -c 'cd /root/promptopia-web && npx tsx tmp-import.ts'`, (e, stream) => {
    let o = "";
    stream.on("data", (d) => o += d.toString());
    stream.stderr.on("data", (d) => o += d.toString());
    stream.on("close", () => { console.log(o.slice(-500)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

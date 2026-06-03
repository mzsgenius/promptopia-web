// Seed script: validate → clean → import cases
// Run (from project root):
//   set DATABASE_URL=... && npx tsx --tsconfig tsconfig.json scripts/seed.ts
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { resolve } from "path";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

async function main() {
  const raw = JSON.parse(readFileSync(resolve(__dirname, "./seed-cases.json"), "utf-8"));
  console.log(`\n📦 原始数据: ${raw.length} 条`);

  // ── Validate ────────────────
  const errors: { idx: number; title: string; issues: string[] }[] = [];
  const valid: any[] = [];

  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const issues: string[] = [];
    if (!c.title || String(c.title).length < 5) issues.push("title < 5");
    if (!c.slug) issues.push("slug missing");
    if (!c.content || String(c.content).length < 50) issues.push("content < 50");
    if (!c.summary || String(c.summary).length < 10) issues.push("summary < 10");
    if (!c.category) issues.push("category");
    if (!Array.isArray(c.tags) || c.tags.length === 0) issues.push("tags empty");
    if (!Array.isArray(c.tools) || c.tools.length === 0) issues.push("tools empty");
    if (!Array.isArray(c.seoKeywords)) issues.push("seoKeywords");

    issues.length > 0
      ? errors.push({ idx: i, title: String(c.title ?? "").slice(0, 40), issues })
      : valid.push(c);
  }

  console.log(`📊 校验: ✅ ${valid.length}  ❌ ${errors.length}`);
  errors.forEach((e) => console.log(`   [${e.idx}] ${e.title} → ${e.issues.join("; ")}`));

  // ── Clean ───────────────────
  let fixT = 0, fixL = 0, fixK = 0, fixS = 0;
  const cleaned = valid.map((c: any) => {
    if (!c.tags?.length) fixT++;
    if (!c.tools?.length) fixL++;
    if (!c.seoKeywords?.length) fixK++;
    if (c.summary?.length > 200) fixS++;
    return {
      title: c.title, slug: c.slug, category: c.category,
      intent: c.intent ?? "副业", resultType: c.resultType ?? "收入",
      primaryTool: c.primaryTool ?? null,
      summary: c.summary?.length > 200 ? c.summary.slice(0, 197) + "..." : c.summary,
      content: c.content,
      seoKeywords: c.seoKeywords?.length ? c.seoKeywords : [c.title.slice(0, 30)],
      tags: c.tags?.length ? c.tags : ["AI"],
      tools: c.tools?.length ? c.tools : ["ChatGPT"],
      difficulty: (typeof c.difficulty === "number" && c.difficulty >= 1 && c.difficulty <= 5) ? c.difficulty : null,
    };
  });
  console.log(`🛠️ 修复: tags=${fixT} tools=${fixL} kw=${fixK} summary=${fixS}`);

  // ── Seed user ───────────────
  console.log("\n👤 种子用户...");
  const user = await prisma.user.upsert({
    where: { email: "seed@promptopia.local" },
    update: {},
    create: { supabaseId: "seed-id", email: "seed@promptopia.local", name: "PrompTopia", avatar: "" },
  });
  console.log(`   ✅ ${user.id}`);

  const withAuthor = cleaned.map((c) => ({
    ...c,
    authorId: user.id,
    lessons: c.content.includes("## 踩坑")
      ? (c.content.split("## 踩坑")[1]?.split("\n##")[0]?.trim() ?? null)
      : null,
    projectLink: null, coverUrl: null, workflow: null, timeSpent: null, income: null,
    viewCount: Math.floor(Math.random() * 200),
    likeCount: Math.floor(Math.random() * 50),
    bookmarkCount: Math.floor(Math.random() * 20),
    publishedAt: new Date(Date.now() - Math.random() * 30 * 86400000),
  }));

  // ── Dedup slugs ─────────────
  const seen = new Map<string, boolean>();
  for (const c of withAuthor) {
    let slug = c.slug, i = 1;
    while (seen.has(slug)) { slug = `${c.slug}-${i}`; i++; }
    seen.set(slug, true);
    c.slug = slug;
  }

  // ── Import ─────────────────
  console.log(`\n📥 写入 ${withAuthor.length} 条...`);
  let ok = 0, fail = 0;
  for (const c of withAuthor) {
    try {
      await prisma.case.create({ data: c });
      ok++;
    } catch (err: any) {
      fail++;
      console.error(`   ❌ ${c.slug}: ${err.message?.slice(0, 60)}`);
    }
  }
  console.log(`📊 入库: ✅ ${ok}  ❌ ${fail}`);

  // ── Verify ─────────────────
  const total = await prisma.case.count();
  const samples = await prisma.case.findMany({
    take: 3, orderBy: { publishedAt: "desc" },
    select: { title: true, slug: true },
  });
  console.log(`\n🔍 验证: 共 ${total} 条案例`);
  console.log("📝 示例:");
  samples.forEach((s) => console.log(`   /case/${s.slug}`));

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });

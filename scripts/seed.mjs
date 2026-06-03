// Self-contained seed: reads .env, then imports cases
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Read .env manually
function loadEnv(path) {
  const text = readFileSync(path, "utf-8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && val) process.env[key] = val;
  }
}
loadEnv(resolve(root, ".env"));

const url = process.env.DATABASE_URL;
if (!url || url.includes("placeholder")) {
  throw new Error("DATABASE_URL not found in .env or is placeholder");
}

const { default: pg } = await import("pg");
const pool = new pg.Pool({ connectionString: url });

async function main() {
  const raw = JSON.parse(readFileSync(resolve(__dirname, "./seed-cases.json"), "utf-8"));
  process.stdout.write(`\n📦 原始数据: ${raw.length} 条\n`);

  // ── Validate ─────────────────
  const errors = [];
  const valid = [];

  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    const issues = [];
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

  process.stdout.write(`📊 校验: ✅ ${valid.length}  ❌ ${errors.length}\n`);
  errors.forEach((e) => process.stdout.write(`   [${e.idx}] ${e.title} → ${e.issues.join("; ")}\n`));

  // ── Clean ────────────────────
  let fixT = 0, fixL = 0, fixK = 0, fixS = 0;
  const cleaned = valid.map((c) => {
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
  process.stdout.write(`🛠️ 修复: tags=${fixT} tools=${fixL} kw=${fixK} summary=${fixS}\n`);

  // ── Seed user ────────────────
  process.stdout.write("\n👤 种子用户...\n");
  const userRes = await pool.query(
    `INSERT INTO "User" (id, "supabaseId", email, name, avatar, "createdAt", "updatedAt")
     VALUES (substr(md5(random()::text), 1, 25), 'seed-id', 'seed@promptopia.local', 'PrompTopia', '', NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET name = 'PrompTopia'
     RETURNING id`
  );
  const userId = userRes.rows[0].id;
  process.stdout.write(`   ✅ ${userId}\n`);

  // ── Dedup slugs ──────────────
  const seen = new Map();
  for (const c of cleaned) {
    let slug = c.slug, i = 1;
    while (seen.has(slug)) { slug = `${c.slug}-${i}`; i++; }
    seen.set(slug, true);
    c.slug = slug;
  }

  // ── Import ───────────────────
  process.stdout.write(`\n📥 写入 ${cleaned.length} 条...\n`);
  let ok = 0, fail = 0;

  for (const c of cleaned) {
    const lessons = c.content.includes("## 踩坑")
      ? (c.content.split("## 踩坑")[1]?.split("\n##")[0]?.trim() ?? null)
      : null;

    try {
      await pool.query(
        `INSERT INTO "Case" (
          id, slug, title, category, tags, tools, summary,
          content, "seoKeywords", "authorId", intent, "resultType",
          "primaryTool", difficulty, lessons,
          "viewCount", "likeCount", "bookmarkCount", "publishedAt",
          "createdAt", "updatedAt"
        ) VALUES (
          substr(md5(random()::text), 1, 25), $1, $2, $3,
          $4::jsonb, $5::jsonb, $6, $7,
          $8::jsonb, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17, NOW() - interval '1 day' * floor(random() * 30),
          NOW(), NOW()
        ) ON CONFLICT (slug) DO NOTHING`,
        [
          c.slug, c.title, c.category,
          JSON.stringify(c.tags), JSON.stringify(c.tools),
          c.summary, c.content,
          JSON.stringify(c.seoKeywords), userId,
          c.intent, c.resultType,
          c.primaryTool, c.difficulty, lessons,
          Math.floor(Math.random() * 200),
          Math.floor(Math.random() * 50),
          Math.floor(Math.random() * 20),
        ]
      );
      ok++;
    } catch (err) {
      fail++;
      process.stdout.write(`   ❌ ${c.slug}: ${err.message?.slice(0, 80)}\n`);
    }
  }
  process.stdout.write(`📊 入库: ✅ ${ok}  ❌ ${fail}\n`);

  // ── Verify ───────────────────
  const total = await pool.query(`SELECT COUNT(*)::int as count FROM "Case"`);
  const samples = await pool.query(
    `SELECT slug, title FROM "Case" ORDER BY "publishedAt" DESC LIMIT 3`
  );
  process.stdout.write(`\n🔍 验证: 共 ${total.rows[0].count} 条案例\n`);
  process.stdout.write("📝 示例:\n");
  samples.rows.forEach((s) => process.stdout.write(`   /case/${s.slug}  ← ${(s.title ?? "").slice(0, 50)}\n`));

  await pool.end();
}

main().catch((e) => { process.stdout.write(`\n❌ ${e.message}\n`); process.exit(1); });

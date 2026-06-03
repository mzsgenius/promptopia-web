// Create tables using raw SQL (Prisma schema)
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv(path) {
  const text = readFileSync(path, "utf-8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && v) process.env[k] = v;
  }
}
loadEnv(resolve(root, ".env"));

const { default: pg } = await import("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  // Create tables (no pgcrypto dependency)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY DEFAULT substr(md5(random()::text), 1, 25),
      "supabaseId" TEXT NOT NULL UNIQUE,
      name TEXT,
      email TEXT UNIQUE,
      avatar TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "Case" (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      tags JSONB NOT NULL DEFAULT '[]',
      tools JSONB NOT NULL DEFAULT '[]',
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      intent TEXT,
      "resultType" TEXT,
      "primaryTool" TEXT,
      "seoKeywords" JSONB NOT NULL DEFAULT '[]',
      "timeSpent" INTEGER,
      income INTEGER,
      workflow JSONB,
      lessons TEXT,
      "projectLink" TEXT,
      "coverUrl" TEXT,
      difficulty INTEGER,
      "authorId" TEXT NOT NULL REFERENCES "User"(id),
      "viewCount" INTEGER NOT NULL DEFAULT 0,
      "likeCount" INTEGER NOT NULL DEFAULT 0,
      "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
      "publishedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  console.log("✅ Tables created");
} catch (e) {
  console.error("❌", e.message);
}
await pool.end();

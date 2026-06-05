// Home page — redesigned with hero section
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CaseCard } from "@/components/case/case-card";
import { SearchBar } from "@/components/case/search-bar";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  if (q?.trim()) {
    return {
      title: `搜索 "${q}" 的AI案例 | PrompTopia`,
      description: `查找与 "${q}" 相关的AI副业、自动化与效率提升案例。`,
    };
  }
  return {
    title: "AI案例库 | PrompTopia — 中文AI实战案例社区",
    description: "真实AI副业、创业、自动化、编程实战案例结构化数据库。看别人怎么用AI做成事。",
    openGraph: { title: "PrompTopia — 中文AI实战案例社区", description: "真实AI副业、创业、自动化、编程实战案例结构化数据库。", type: "website" },
  };
}

const CATEGORIES = [
  { slug: "ai-fuye", name: "AI副业", desc: "赚钱、变现、副业经验", emoji: "💰" },
  { slug: "ai-zidonghua", name: "AI自动化", desc: "办公、流程、效率提升", emoji: "⚡" },
  { slug: "ai-xuexi", name: "AI学习", desc: "编程、工具、技能成长", emoji: "📚" },
  { slug: "ai-xiaolv", name: "AI效率", desc: "工作流、工具链、方法", emoji: "🚀" },
  { slug: "ai-programming", name: "AI编程", desc: "Cursor、AI IDE、开发实战", emoji: "💻" },
];

type RawRow = Record<string, unknown>;
type HydratedCase = {
  id: string; slug: string; title: string; summary: string;
  tags: unknown; category: string; likeCount: number; viewCount: number;
  publishedAt: string;
  author: { name: string | null; avatar: string | null } | null;
};

function toHydrated(r: RawRow, authorMap: Record<string, { name: string | null; avatar: string | null }>): HydratedCase {
  const a = authorMap[r.authorId as string] ?? null;
  return {
    id: r.id as string, slug: r.slug as string, title: r.title as string,
    summary: r.summary as string, tags: r.tags, category: r.category as string,
    likeCount: Number(r.likeCount ?? 0), viewCount: Number(r.viewCount ?? 0),
    publishedAt: new Date(r.publishedAt as string).toISOString(),
    author: a ? { name: a.name, avatar: a.avatar } : null,
  };
}

async function searchCases(keyword: string): Promise<HydratedCase[]> {
  const rows = await prisma.$queryRawUnsafe<RawRow[]>(
    `SELECT * FROM "Case"
     WHERE "title" ILIKE '%' || $1 || '%'
        OR "summary" ILIKE '%' || $1 || '%'
        OR "tags"::text ILIKE '%' || $1 || '%'
     ORDER BY "publishedAt" DESC LIMIT 20`,
    keyword
  );
  const authorIds = [...new Set(rows.map((r: RawRow) => r.authorId as string))];
  const authors = authorIds.length > 0
    ? await prisma.user.findMany({ where: { id: { in: authorIds } }, select: { id: true, name: true, avatar: true } })
    : [];
  const authorMap = Object.fromEntries(authors.map((a) => [a.id, a]));
  return rows.map((r: RawRow) => toHydrated(r, authorMap));
}

async function getLatestCases(): Promise<HydratedCase[]> {
  const rows = await prisma.case.findMany({
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });
  return rows.map((r) => ({
    id: r.id, slug: r.slug, title: r.title, summary: r.summary,
    tags: r.tags, category: r.category,
    likeCount: r.likeCount, viewCount: r.viewCount,
    publishedAt: r.publishedAt.toISOString(),
    author: r.author ? { name: r.author.name, avatar: r.author.avatar } : null,
  }));
}

export default async function HomePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? "";
  let isSearch = false;
  let cases: HydratedCase[] = [];

  if (keyword) {
    isSearch = true;
    cases = await searchCases(keyword);
  } else {
    cases = await getLatestCases();
  }

  return (
    <div>
      {/* ── Hero Section ─────────────── */}
      <section className="border-b bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            中文AI实战案例社区
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-xl mx-auto">
            看别人怎么用AI做成事。真实案例、结构化数据、可复制的经验。
          </p>
          <div className="max-w-lg mx-auto">
            <SearchBar initialValue={keyword} />
          </div>
        </div>
      </section>

      {/* ── Category Quick Nav ──────── */}
      {!isSearch && (
        <section className="border-b bg-card/30">
          <div className="max-w-3xl mx-auto px-4 py-5">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-muted transition-colors text-sm"
                >
                  <span className="text-base">{cat.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{cat.name}</div>
                    <div className="text-[11px] text-muted-foreground">{cat.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Case Feed ──────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {isSearch ? `搜索 "${keyword}" 的结果` : "最新案例"}
          </h2>
          {isSearch && (
            <span className="text-sm text-muted-foreground">{cases.length} 篇</span>
          )}
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border rounded-xl">
            {isSearch ? (
              <>
                <p className="text-lg mb-2">没有找到相关案例</p>
                <p className="text-sm mb-4">试试换个关键词，比如 ChatGPT、Cursor、副业</p>
                <Link href="/" className="text-primary hover:underline text-sm font-medium">
                  浏览全部案例 →
                </Link>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">还没有案例</p>
                <Link href="/case/new" className="text-primary hover:underline font-medium">
                  发布第一篇案例 →
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1">
            {cases.map((c) => (
              <CaseCard key={c.id} item={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

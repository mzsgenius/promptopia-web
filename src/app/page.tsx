// Home page — case feed with search (SSR)
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CaseCard } from "@/components/case/case-card";
import { SearchBar } from "@/components/case/search-bar";

// raw row shape from $queryRawUnsafe
type RawCaseRow = {
  id: string; slug: string; title: string; summary: string;
  tags: unknown; category: string; authorId: string;
  likeCount: number; viewCount: number; bookmarkCount: number;
  publishedAt: Date; createdAt: Date; updatedAt: Date;
  content: string; intent: string | null; resultType: string | null;
  primaryTool: string | null; seoKeywords: unknown;
  timeSpent: number | null; income: number | null;
  workflow: unknown; lessons: string | null;
  projectLink: string | null; coverUrl: string | null;
  difficulty: number | null;
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

// ── dynamic metadata for search ─────────────
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
    description:
      "真实AI副业、创业、自动化、编程实战案例结构化数据库。看别人怎么用AI做成事。",
    keywords: ["AI案例", "AI副业", "AI创业", "AI编程", "Cursor", "Claude", "SaaS"],
    openGraph: {
      title: "PrompTopia — 中文AI实战案例社区",
      description:
        "真实AI副业、创业、自动化、编程实战案例结构化数据库。",
      type: "website",
    },
  };
}

// ── helpers ─────────────────────────────────
function toCaseItem(c: {
  id: string; slug: string; title: string; summary: string;
  tags: unknown; category: string;
  likeCount: number; viewCount: number;
  publishedAt: Date;
  author: { id: string; name: string | null; avatar: string | null } | null;
}) {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    summary: c.summary,
    tags: c.tags,
    category: c.category,
    likeCount: c.likeCount,
    viewCount: c.viewCount,
    publishedAt: c.publishedAt.toISOString(),
    author: c.author ? { name: c.author.name, avatar: c.author.avatar } : { name: null, avatar: null },
  };
}

// ── page ────────────────────────────────────
export default async function HomePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? "";

  let cases: ReturnType<typeof toCaseItem>[] = [];
  let isSearch = false;

  if (keyword) {
    // ── search mode ────────────────────────────
    isSearch = true;
    const results = await prisma.$queryRawUnsafe<RawCaseRow[]>(
      `SELECT * FROM "Case"
       WHERE "title" ILIKE '%' || $1 || '%'
          OR "summary" ILIKE '%' || $1 || '%'
          OR "tags"::text ILIKE '%' || $1 || '%'
       ORDER BY "publishedAt" DESC
       LIMIT 20`,
      keyword
    );
    // fetch authors for the results
    const authorIds = [...new Set(results.map((r) => r.authorId))];
    const authors = authorIds.length > 0
      ? await prisma.user.findMany({ where: { id: { in: authorIds } }, select: { id: true, name: true, avatar: true } })
      : [];
    const authorMap = Object.fromEntries(authors.map((a) => [a.id, a]));
    const mapped = results.map((r) => toCaseItem({ ...r, author: authorMap[r.authorId] ?? null }));
    cases = mapped;
  } else {
    // ── feed mode ──────────────────────────────
    const feed = await prisma.case.findMany({
      orderBy: { publishedAt: "desc" },
      take: 20,
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    cases = feed.map(toCaseItem);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* search bar */}
      <div className="mb-6">
        <SearchBar initialValue={keyword} />
      </div>

      {/* title */}
      <h1 className="text-2xl font-bold mb-6">
        {isSearch ? `搜索 "${keyword}" 的结果` : "最新案例"}
      </h1>

      {/* result count */}
      {isSearch && (
        <p className="text-sm text-muted-foreground mb-4">
          找到 {cases.length} 篇相关案例
        </p>
      )}

      {/* case list / empty */}
      {cases.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {isSearch ? (
            <>
              <p className="text-lg mb-2">没有找到相关案例</p>
              <p className="text-sm mb-6">
                试试换个关键词，比如 &quot;ChatGPT&quot;、&quot;Cursor&quot;、&quot;副业&quot;
              </p>
              <Link href="/" className="text-primary hover:underline text-sm">
                浏览全部案例 →
              </Link>
            </>
          ) : (
            <>
              <p className="text-lg mb-2">还没有案例</p>
              <Link href="/case/new" className="text-primary hover:underline">
                发布第一篇案例 →
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cases.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      )}
    </div>
  );
}

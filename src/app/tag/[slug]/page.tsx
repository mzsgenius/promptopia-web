// Tag page — /tag/[slug] — list cases by tag
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CaseCard } from "@/components/case/case-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://promptopia.com";

type RawRow = Record<string, unknown>;
type Props = { params: Promise<{ slug: string }> };

// ── pre-generate from existing tags ──────────────
export async function generateStaticParams() {
  const cases = await prisma.case.findMany({ select: { tags: true }, take: 200 });
  const tagSet = new Set<string>();
  for (const c of cases) {
    const tags = (c.tags as string[]) ?? [];
    for (const t of tags) tagSet.add(t);
  }
  return Array.from(tagSet).map((slug) => ({ slug }));
}

// ── metadata ─────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tagLabel = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${tagLabel} AI案例库 | PrompTopia`,
    description: `浏览所有与 ${tagLabel} 相关的 AI 副业、自动化和效率提升案例。`,
    alternates: { canonical: `${SITE_URL}/tag/${slug}` },
    openGraph: {
      title: `${tagLabel} AI案例库 | PrompTopia`,
      description: `浏览所有与 ${tagLabel} 相关的 AI 案例。`,
      type: "website",
      url: `${SITE_URL}/tag/${slug}`,
    },
  };
}

// ── helpers ──────────────────────────────────────
function toCaseItem(c: {
  id: string; slug: string; title: string; summary: string;
  tags: unknown; category: string; likeCount: number; viewCount: number;
  publishedAt: Date;
  author: { id: string; name: string | null; avatar: string | null } | null;
}) {
  return {
    id: c.id, slug: c.slug, title: c.title, summary: c.summary,
    tags: c.tags, category: c.category,
    likeCount: c.likeCount, viewCount: c.viewCount,
    publishedAt: c.publishedAt.toISOString(),
    author: c.author ? { name: c.author.name, avatar: c.author.avatar } : { name: null, avatar: null },
  };
}

// ── page ─────────────────────────────────────────
export default async function TagPage({ params }: Props) {
  const { slug } = await params;
  const tagLabel = slug.charAt(0).toUpperCase() + slug.slice(1);

  const rows = await prisma.$queryRawUnsafe<RawRow[]>(
    `SELECT * FROM "Case"
     WHERE "tags"::text ILIKE '%' || $1 || '%'
     ORDER BY "publishedAt" DESC
     LIMIT 50`,
    slug
  );

  if (rows.length === 0) notFound();

  // fetch authors
  const authorIds = [...new Set(rows.map((r: RawRow) => r.authorId as string))];
  const authors = authorIds.length > 0
    ? await prisma.user.findMany({ where: { id: { in: authorIds } }, select: { id: true, name: true, avatar: true } })
    : [];
  const authorMap = Object.fromEntries(authors.map((a) => [a.id, a]));
  const cases = rows.map((r: RawRow) => ({ ...r, author: authorMap[r.authorId as string] ?? null }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">#{tagLabel} AI案例</h1>
      <p className="text-muted-foreground mb-8">
        浏览所有使用 {tagLabel} 的真实 AI 案例与实践经验。
      </p>

      <div className="flex flex-col gap-4">
        {cases.map((c: RawRow) => (
          <CaseCard key={c.id} item={toCaseItem(c)} />
        ))}
      </div>
    </div>
  );
}

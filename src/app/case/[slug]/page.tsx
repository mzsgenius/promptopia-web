// Case detail page — full SEO: metadata + OG + Twitter + canonical + meta card
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/case/md-renderer";
import { CaseMetaCard } from "@/components/case/case-meta-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://promptopia.com";

// ── helpers ────────────────────────────────────────
function arr(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === "string");
  return [];
}

function slugify(category: string): string {
  const map: Record<string, string> = {
    "AI副业": "ai-fuye", "AI自动化": "ai-zidonghua", "AI学习": "ai-xuexi",
    "AI效率": "ai-xiaolv", "AI创业": "ai-startup", "AI编程": "ai-programming",
    "AI Agent": "ai-agent", "AI工作流": "ai-workflow", "AI复盘": "ai-retrospect",
  };
  return map[category] ?? encodeURIComponent(category);
}

type Props = { params: Promise<{ slug: string }> };

// ── dynamic metadata ───────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await prisma.case.findUnique({
    where: { slug },
    select: { title: true, summary: true, tags: true, tools: true, coverUrl: true },
  });
  if (!c) return { title: "Not Found" };

  const tags = arr(c.tags);
  const tools = arr(c.tools);
  const kw = [...tags, ...tools].slice(0, 10).join(", ");

  return {
    title: `${c.title} | PrompTopia`,
    description: c.summary.slice(0, 160),
    keywords: kw,
    alternates: {
      canonical: `${SITE_URL}/case/${slug}`,
    },
    openGraph: {
      title: c.title,
      description: c.summary.slice(0, 160),
      type: "article",
      url: `${SITE_URL}/case/${slug}`,
      images: c.coverUrl
        ? [{ url: c.coverUrl, width: 1200, height: 630, alt: c.title }]
        : [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.summary.slice(0, 160),
      images: c.coverUrl ?? `${SITE_URL}/og-default.png`,
    },
  };
}

// ── page ───────────────────────────────────────────
export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;

  const c = await prisma.case.findUnique({
    where: { slug },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });

  if (!c) notFound();

  const tags = arr(c.tags);
  const tools = arr(c.tools);
  const seoKw = arr(c.seoKeywords);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* back */}
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:underline mb-4 inline-block"
      >
        ← 返回首页
      </Link>

      {/* title */}
      <h1 className="text-3xl font-bold mb-2">{c.title}</h1>

      {/* author + date */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Avatar className="h-6 w-6">
          <AvatarImage src={c.author.avatar ?? ""} />
          <AvatarFallback>{(c.author.name ?? "?")[0]}</AvatarFallback>
        </Avatar>
        <span>{c.author.name ?? "匿名"}</span>
        <span>·</span>
        <time dateTime={c.publishedAt.toISOString()}>
          {new Date(c.publishedAt).toLocaleDateString("zh-CN")}
        </time>
      </div>

      {/* ── SEO structured meta card ────────────── */}
      <CaseMetaCard
        category={c.category}
        intent={c.intent}
        resultType={c.resultType}
        difficulty={c.difficulty}
        tags={tags}
        tools={tools}
      />

      {/* breadcrumb: category link */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Link href="/" className="hover:underline">首页</Link>
        <span>/</span>
        <Link href={`/category/${slugify(c.category)}`} className="hover:underline">
          {c.category}
        </Link>
      </div>

      {/* summary */}
      <blockquote className="border-l-4 border-primary pl-4 mb-6 text-muted-foreground italic">
        {c.summary}
      </blockquote>

      {/* tags + tools inline — with links */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((t) => (
          <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/70">
              {t}
            </Badge>
          </Link>
        ))}
        {tools.map((t) => (
          <Badge key={t} variant="outline">
            🛠 {t}
          </Badge>
        ))}
      </div>

      {/* body */}
      <article className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <MarkdownRenderer content={c.content} />
      </article>

      {/* lessons */}
      {c.lessons && (
        <div className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 mb-6">
          <h2 className="font-bold text-sm mb-2">⚠️ 踩坑 / 教训</h2>
          <div className="text-sm whitespace-pre-wrap">{c.lessons}</div>
        </div>
      )}

      {/* project link */}
      {c.projectLink && (
        <div className="mb-6">
          <a
            href={c.projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            🔗 项目链接 →
          </a>
        </div>
      )}

      {/* seo keywords (hidden from humans, indexed by bots) */}
      {seoKw.length > 0 && (
        <meta name="keywords" content={seoKw.join(", ")} />
      )}

      {/* meta */}
      <div className="text-xs text-muted-foreground border-t pt-4">
        阅读 {c.viewCount} · 点赞 {c.likeCount} · 收藏 {c.bookmarkCount}
      </div>
    </div>
  );
}

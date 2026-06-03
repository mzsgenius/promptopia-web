// Category page — /category/[slug] — list cases by category
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CaseCard } from "@/components/case/case-card";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://promptopia.com";

// ── slug → Chinese category mapping ──────────────
const CATEGORY_MAP: Record<string, string> = {
  "ai-fuye": "AI副业",
  "ai-zidonghua": "AI自动化",
  "ai-xuexi": "AI学习",
  "ai-xiaolv": "AI效率",
  "ai-startup": "AI创业",
  "ai-programming": "AI编程",
  "ai-agent": "AI Agent",
  "ai-workflow": "AI工作流",
  "ai-retrospect": "AI复盘",
  "ai-side-hustle": "AI副业",
};

const CATEGORY_DESC: Record<string, string> = {
  "ai-fuye": "真实 AI 副业案例、变现经验和工作流分享。",
  "ai-zidonghua": "AI 自动化实战案例，从办公自动化到业务流程提效。",
  "ai-xuexi": "AI 学习路径、编程入门和技能提升案例。",
  "ai-xiaolv": "AI 效率提升案例，用工具和流程优化日常工作。",
  "ai-startup": "AI 创业案例、SaaS 开发和产品复盘。",
  "ai-programming": "AI 编程实战，Cursor、Claude Code 等工具使用经验。",
  "ai-agent": "AI Agent 搭建、RAG 知识库和多 Agent 协作案例。",
  "ai-workflow": "AI 工作流设计与多工具串联实战。",
  "ai-retrospect": "AI 项目复盘、工具横评和行业趋势观察。",
  "ai-side-hustle": "真实 AI 副业案例、变现经验和工作流分享。",
};

type Props = { params: Promise<{ slug: string }> };

// ── pre-generate from existing categories ────────
export async function generateStaticParams() {
  const cats = await prisma.case.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  const slugToCategory = Object.entries(CATEGORY_MAP);
  // only include slugs that match existing db categories
  const existing = new Set(cats.map((c) => c.category));
  return slugToCategory
    .filter(([, cn]) => existing.has(cn))
    .map(([slug]) => ({ slug }));
}

// ── metadata ─────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_MAP[slug] ?? slug;
  const desc = CATEGORY_DESC[slug] ?? `${label}案例与实践经验。`;
  return {
    title: `${label}案例库 | PrompTopia`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    openGraph: {
      title: `${label}案例库 | PrompTopia`,
      description: desc,
      type: "website",
      url: `${SITE_URL}/category/${slug}`,
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
export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = CATEGORY_MAP[slug];
  if (!categoryName) notFound();

  const description = CATEGORY_DESC[slug] ?? `${categoryName}案例与实践经验。`;

  const cases = await prisma.case.findMany({
    where: { category: categoryName },
    orderBy: { publishedAt: "desc" },
    take: 50,
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
        ← 返回首页
      </Link>

      <h1 className="text-3xl font-bold mb-2">{categoryName}案例</h1>
      <p className="text-muted-foreground mb-8">{description}</p>

      {cases.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">暂无相关案例</p>
          <Link href="/" className="text-primary hover:underline text-sm">浏览全部案例 →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cases.map((c) => (
            <CaseCard key={c.id} item={toCaseItem(c)} />
          ))}
        </div>
      )}
    </div>
  );
}

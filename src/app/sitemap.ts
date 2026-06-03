// Dynamic sitemap.xml — includes cases + tags + categories
import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://promptopia.com";

const CATEGORY_SLUGS = [
  "ai-fuye", "ai-zidonghua", "ai-xuexi", "ai-xiaolv",
  "ai-startup", "ai-programming", "ai-agent", "ai-workflow", "ai-retrospect",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // ── home ─────────────────────────────────────
  entries.push({
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  });

  // ── categories ───────────────────────────────
  for (const slug of CATEGORY_SLUGS) {
    entries.push({
      url: `${SITE_URL}/category/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // ── cases ────────────────────────────────────
  const cases = await prisma.case.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });
  for (const c of cases) {
    entries.push({
      url: `${SITE_URL}/case/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // ── tags (from existing case tags) ───────────
  const tagRows = await prisma.case.findMany({ select: { tags: true }, take: 500 });
  const tagSet = new Set<string>();
  for (const r of tagRows) {
    const tags = (r.tags as string[]) ?? [];
    for (const t of tags) tagSet.add(t);
  }
  for (const tag of tagSet) {
    entries.push({
      url: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}

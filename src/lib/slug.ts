// Slug generator: title → SEO-friendly unique slug
import { prisma } from "@/lib/prisma";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-") // non-alnum → dash
    .replace(/^-+|-+$/g, "")                    // trim dashes
    .slice(0, 80);                              // cap length
}

function randomSuffix(length = 6): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

export async function generateSlug(title: string): Promise<string> {
  const base = normalize(title) || "case";
  // try without suffix first
  let slug = base;
  let attempts = 0;

  while (attempts < 5) {
    const exists = await prisma.case.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${randomSuffix()}`;
    attempts++;
  }
  // fallback
  return `${base}-${randomSuffix(8)}`;
}

// GET /api/case/search?q=xxx — search cases by title, summary, tags
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RawRow = Record<string, unknown>;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 1) {
    return NextResponse.json({ cases: [], total: 0 });
  }

  const results = await prisma.$queryRawUnsafe<RawRow[]>(
    `SELECT * FROM "Case"
     WHERE "title" ILIKE '%' || $1 || '%'
        OR "summary" ILIKE '%' || $1 || '%'
        OR "tags"::text ILIKE '%' || $1 || '%'
     ORDER BY "publishedAt" DESC
     LIMIT 20`,
    q
  );

  // fetch authors
  const authorIds = [...new Set(results.map((r: RawRow) => r.authorId as string))];
  const authors = authorIds.length > 0
    ? await prisma.user.findMany({ where: { id: { in: authorIds } }, select: { id: true, name: true, avatar: true } })
    : [];
  const authorMap = Object.fromEntries(authors.map((a) => [a.id, a]));
  const cases = results.map((r: RawRow) => ({ ...r, author: authorMap[r.authorId as string] ?? null }));

  return NextResponse.json({ cases, total: cases.length });
}

// POST /api/case/create — create a new case
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // ── Auth check ─────────────────────────
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ensure Prisma user exists
    const dbUser = await prisma.user.upsert({
      where: { supabaseId: authData.user.id },
      update: {},
      create: {
        supabaseId: authData.user.id,
        email: authData.user.email ?? "",
        name: authData.user.user_metadata?.full_name ?? "User",
        avatar: authData.user.user_metadata?.avatar_url ?? "",
      },
    });

    // ── Parse body ─────────────────────────
    const body = await request.json();

    const title = String(body.title ?? "").trim();
    if (!title || title.length < 5) {
      return NextResponse.json(
        { error: "Title must be at least 5 characters" },
        { status: 400 }
      );
    }

    const slug = await generateSlug(title);

    // ── Create case ────────────────────────
    const created = await prisma.case.create({
      data: {
        slug,
        title,
        category: String(body.category ?? ""),
        tags: body.tags ?? [],
        tools: body.tools ?? [],
        summary: String(body.summary ?? ""),
        content: String(body.content ?? ""),
        timeSpent: body.timeSpent ? Number(body.timeSpent) : null,
        income: body.income ? Number(body.income) : null,
        workflow: body.workflow ?? null,
        lessons: body.lessons ?? null,
        projectLink: body.projectLink ?? null,
        coverUrl: body.coverUrl ?? null,
        difficulty: body.difficulty ? Number(body.difficulty) : null,
        intent: body.intent ?? null,
        resultType: body.resultType ?? null,
        primaryTool: body.primaryTool ?? null,
        seoKeywords: body.seoKeywords ?? [],
        authorId: dbUser.id,
      },
    });

    return NextResponse.json({ slug: created.slug }, { status: 201 });
  } catch (error) {
    console.error("POST /api/case/create", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

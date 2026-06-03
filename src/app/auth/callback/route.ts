// Auth callback — handles OAuth redirect from GitHub
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  // exchange code for session
  const response = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // sync user to Prisma
  await prisma.user.upsert({
    where: { supabaseId: data.user.id },
    update: {
      email: data.user.email ?? undefined,
      name:
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.user_name ??
        undefined,
      avatar: data.user.user_metadata?.avatar_url ?? undefined,
    },
    create: {
      supabaseId: data.user.id,
      email: data.user.email ?? "",
      name:
        data.user.user_metadata?.full_name ??
        data.user.user_metadata?.user_name ??
        "User",
      avatar: data.user.user_metadata?.avatar_url ?? "",
    },
  });

  return response;
}

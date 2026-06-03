// Utility: ensure a Prisma User row exists for the current Supabase session
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // upsert into our own User table
  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {
      email: user.email ?? undefined,
      name: user.user_metadata?.full_name ?? user.user_metadata?.user_name ?? undefined,
      avatar: user.user_metadata?.avatar_url ?? undefined,
    },
    create: {
      supabaseId: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.full_name ?? user.user_metadata?.user_name ?? "User",
      avatar: user.user_metadata?.avatar_url ?? "",
    },
  });

  return dbUser;
}

"use client";

// Login page — GitHub OAuth only
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">登录 PrompTopia</h1>
      <p className="text-muted-foreground mb-8">使用 GitHub 账号登录，开始分享AI实战案例</p>
      <Button onClick={handleLogin} disabled={loading} size="lg" className="w-full">
        {loading ? "跳转中..." : "Sign in with GitHub"}
      </Button>
    </div>
  );
}

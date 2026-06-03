"use client";

// Create Case page — structured form → POST /api/case/create
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "ai-startup", label: "AI创业" },
  { value: "ai-side-hustle", label: "AI副业" },
  { value: "ai-programming", label: "AI编程" },
  { value: "ai-agent", label: "AI Agent" },
  { value: "ai-automation", label: "AI自动化" },
  { value: "ai-workflow", label: "AI工作流" },
  { value: "ai-learning", label: "AI学习" },
  { value: "ai-retrospect", label: "AI复盘" },
];

export default function NewCasePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const body = {
      title: form.get("title"),
      category: form.get("category"),
      tags: String(form.get("tags") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: String(form.get("tools") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      summary: form.get("summary"),
      content: form.get("content"),
      timeSpent: form.get("timeSpent") ? Number(form.get("timeSpent")) : null,
      income: form.get("income") ? Number(form.get("income")) : null,
      difficulty: form.get("difficulty") ? Number(form.get("difficulty")) : null,
      intent: form.get("intent") || null,
      resultType: form.get("resultType") || null,
      primaryTool: form.get("primaryTool") || null,
      lessons: form.get("lessons"),
      projectLink: form.get("projectLink"),
    };

    const res = await fetch("/api/case/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.error ?? "创建失败");
      setSubmitting(false);
      return;
    }

    const data = await res.json();
    toast.success("案例发布成功！");
    router.push(`/case/${data.slug}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">发布AI实战案例</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* title */}
        <div>
          <Label htmlFor="title">标题 *</Label>
          <Input id="title" name="title" required minLength={5} maxLength={120} placeholder="用Cursor+Claude开发AI客服SaaS，30天从0到月入¥5000" />
        </div>

        {/* category */}
        <div>
          <Label htmlFor="category">分类 *</Label>
          <select id="category" name="category" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">选择分类</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* tags */}
        <div>
          <Label htmlFor="tags">标签（逗号分隔）*</Label>
          <Input id="tags" name="tags" required placeholder="Cursor, Claude, SaaS" />
        </div>

        {/* tools */}
        <div>
          <Label htmlFor="tools">AI工具（逗号分隔）*</Label>
          <Input id="tools" name="tools" required placeholder="Cursor, Claude 3.5 Sonnet" />
        </div>

        {/* summary */}
        <div>
          <Label htmlFor="summary">摘要 *</Label>
          <Textarea id="summary" name="summary" required minLength={20} maxLength={250} rows={2} placeholder="一句话总结你的案例..." />
        </div>

        {/* timeSpent + income + difficulty */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="timeSpent">投入时间（小时）</Label>
            <Input id="timeSpent" name="timeSpent" type="number" placeholder="120" />
          </div>
          <div>
            <Label htmlFor="income">收入/月（元）</Label>
            <Input id="income" name="income" type="number" placeholder="5000" />
          </div>
          <div>
            <Label htmlFor="difficulty">难度 (1-5)</Label>
            <select id="difficulty" name="difficulty" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">不填</option>
              <option value="1">1 - 入门</option>
              <option value="2">2 - 初级</option>
              <option value="3">3 - 中级</option>
              <option value="4">4 - 进阶</option>
              <option value="5">5 - 专家</option>
            </select>
          </div>
        </div>

        {/* intent + resultType + primaryTool — SEO fields */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="intent">目标意图</Label>
            <select id="intent" name="intent" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">不填</option>
              <option value="副业">💰 AI副业</option>
              <option value="创业">🚀 AI创业</option>
              <option value="自动化">⚡ AI自动化</option>
              <option value="学习">📚 AI学习</option>
              <option value="效率提升">⏱️ 效率提升</option>
            </select>
          </div>
          <div>
            <Label htmlFor="resultType">成果类型</Label>
            <select id="resultType" name="resultType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">不填</option>
              <option value="收入">💵 产生收入</option>
              <option value="效率">⚡ 效率提升</option>
              <option value="技能">🧠 技能增长</option>
              <option value="产品">📦 产出产品</option>
              <option value="流量">📈 获得流量</option>
            </select>
          </div>
          <div>
            <Label htmlFor="primaryTool">主工具</Label>
            <Input id="primaryTool" name="primaryTool" placeholder="Cursor" />
          </div>
        </div>

        {/* content */}
        <div>
          <Label htmlFor="content">正文（Markdown）*</Label>
          <Textarea id="content" name="content" required minLength={50} rows={12} placeholder="## 项目背景&#10;&#10;..." />
        </div>

        {/* lessons */}
        <div>
          <Label htmlFor="lessons">踩坑/教训</Label>
          <Textarea id="lessons" name="lessons" rows={3} placeholder="1. 不要过早优化&#10;2. ..." />
        </div>

        {/* projectLink */}
        <div>
          <Label htmlFor="projectLink">项目链接</Label>
          <Input id="projectLink" name="projectLink" placeholder="https://..." />
        </div>

        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? "发布中..." : "发布案例"}
        </Button>
      </form>
    </div>
  );
}

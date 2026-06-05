// CaseCard — redesigned card for case feeds
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  item: {
    slug: string;
    title: string;
    summary: string;
    tags: unknown;
    category: string;
    likeCount: number;
    viewCount: number;
    publishedAt: string;
    author: { name: string | null; avatar: string | null } | null;
  };
};

function toTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === "string");
  return [];
}

const CATEGORY_COLORS: Record<string, string> = {
  "AI副业": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "AI自动化": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "AI学习": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  "AI效率": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "AI创业": "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  "AI编程": "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  "AI Agent": "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "AI工作流": "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  "AI复盘": "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300",
};

const CATEGORY_MAP: Record<string, string> = {
  "AI副业": "ai-fuye", "AI自动化": "ai-zidonghua", "AI学习": "ai-xuexi",
  "AI效率": "ai-xiaolv", "AI创业": "ai-startup", "AI编程": "ai-programming",
  "AI Agent": "ai-agent", "AI工作流": "ai-workflow", "AI复盘": "ai-retrospect",
};

export function CaseCard({ item }: Props) {
  const tags = toTags(item.tags);
  const date = new Date(item.publishedAt).toLocaleDateString("zh-CN");
  const catSlug = CATEGORY_MAP[item.category] ?? item.category;
  const catColor = CATEGORY_COLORS[item.category] ?? "bg-gray-100 text-gray-700";

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardContent className="p-5">
        {/* top row: category + date */}
        <div className="flex items-center justify-between mb-3">
          <Link href={`/category/${catSlug}`}>
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${catColor}`}>
              {item.category}
            </span>
          </Link>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>

        {/* title */}
        <Link href={`/case/${item.slug}`} className="block mb-2">
          <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h2>
        </Link>

        {/* summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {item.summary}
        </p>

        {/* tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 4).map((t) => (
              <Link key={t} href={`/tag/${encodeURIComponent(t)}`}>
                <Badge variant="secondary" className="text-xs font-normal cursor-pointer hover:bg-secondary/70">
                  {t}
                </Badge>
              </Link>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* author */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/50">
          <Avatar className="h-5 w-5">
            <AvatarImage src={item.author?.avatar ?? ""} />
            <AvatarFallback className="text-[10px]">{(item.author?.name ?? "?")[0]}</AvatarFallback>
          </Avatar>
          <span>{item.author?.name ?? "匿名"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

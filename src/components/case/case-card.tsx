// CaseCard — reusable card for case feeds
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    author: { name: string | null; avatar: string | null };
  };
};

function toTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((t): t is string => typeof t === "string");
  return [];
}

export function CaseCard({ item }: Props) {
  const tags = toTags(item.tags);
  const date = new Date(item.publishedAt).toLocaleDateString("zh-CN");

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={item.author.avatar ?? ""} />
            <AvatarFallback>{(item.author.name ?? "?")[0]}</AvatarFallback>
          </Avatar>
          <span>{item.author.name ?? "匿名"}</span>
          <span>·</span>
          <span>{date}</span>
        </div>
        <CardTitle className="text-lg leading-snug">
          <a href={`/case/${item.slug}`} className="hover:underline">
            {item.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.summary}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((t) => (
            <Badge key={t} variant="secondary" className="text-xs">
              {t}
            </Badge>
          ))}
          {tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

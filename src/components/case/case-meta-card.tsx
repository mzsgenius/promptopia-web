// Structured SEO meta card — displayed above case body
const INTENT_LABELS: Record<string, string> = {
  "副业": "💰 AI副业",
  "创业": "🚀 AI创业",
  "自动化": "⚡ AI自动化",
  "学习": "📚 AI学习",
  "效率提升": "⏱️ 效率提升",
};

const RESULT_LABELS: Record<string, string> = {
  "收入": "💵 产生收入",
  "效率": "⚡ 效率提升",
  "技能": "🧠 技能增长",
  "产品": "📦 产出产品",
  "流量": "📈 获得流量",
};

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "⭐ 入门",
  2: "⭐⭐ 初级",
  3: "⭐⭐⭐ 中级",
  4: "⭐⭐⭐⭐ 进阶",
  5: "⭐⭐⭐⭐⭐ 专家",
};

type Props = {
  category: string;
  intent: string | null;
  resultType: string | null;
  difficulty: number | null;
  tags: string[];
  tools: string[];
};

export function CaseMetaCard({ category, intent, resultType, difficulty, tags, tools }: Props) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 p-4 rounded-xl border bg-card/60">
      <MetaItem label="📂 分类" value={category} />
      {intent && <MetaItem label="🎯 目标" value={INTENT_LABELS[intent] ?? intent} />}
      {resultType && <MetaItem label="📊 成果" value={RESULT_LABELS[resultType] ?? resultType} />}
      {difficulty != null && (
        <MetaItem label="📐 难度" value={DIFFICULTY_LABELS[difficulty] ?? `Lv.${difficulty}`} />
      )}
      {tools.length > 0 && (
        <MetaItem label="🛠️ 主工具" value={tools.slice(0, 2).join(" · ")} />
      )}
      {tags.length > 0 && (
        <MetaItem label="🏷️ 标签" value={tags.slice(0, 3).join(" · ")} />
      )}
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
        {label}
      </div>
      <div className="text-sm font-medium truncate" title={value}>
        {value}
      </div>
    </div>
  );
}

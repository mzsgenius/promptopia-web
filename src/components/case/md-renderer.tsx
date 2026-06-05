// Markdown renderer — code highlighting + custom blocks
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { CopyButton } from "@/components/shared/copy-button";
import type { Components } from "react-markdown";

type Props = {
  content: string;
};

// Custom components for react-markdown
const components: Partial<Components> = {
  // ── Code block ─────────────────────────────────
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const codeStr = String(children).replace(/\n$/, "");

    // Prompt block
    if (match?.[1] === "prompt") {
      return (
        <div className="my-6 rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-blue-200 dark:border-blue-900 bg-blue-100/50 dark:bg-blue-900/30">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Prompt
            </span>
            <CopyButton text={codeStr} />
          </div>
          <div className="p-4 text-sm whitespace-pre-wrap font-mono text-blue-900 dark:text-blue-100 leading-relaxed">
            {codeStr}
          </div>
        </div>
      );
    }

    // Workflow block
    if (match?.[1] === "workflow") {
      const steps = codeStr
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        <div className="my-6 rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-2 border-b bg-muted/30">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Workflow
            </span>
          </div>
          <div className="p-4">
            <div className="flex flex-col gap-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 text-sm">{step}</div>
                  {i < steps.length - 1 && (
                    <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Inline code
    const isInline = !match;
    if (isInline) {
      return (
        <code className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground" {...props}>
          {children}
        </code>
      );
    }

    // Code block with syntax highlighting
    return (
      <div className="relative group my-6 rounded-xl overflow-hidden border">
        <div className="flex items-center justify-between px-4 py-1.5 bg-muted/50 border-b text-xs text-muted-foreground">
          <span>{match?.[1] ?? "code"}</span>
          <CopyButton text={codeStr} />
        </div>
        <div className="overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </div>
      </div>
    );
  },

  // ── Image ─────────────────────────────────────
  img({ src, alt }) {
    return (
      <span className="block my-6">
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="rounded-xl border max-w-full h-auto object-cover"
        />
        {alt && (
          <span className="block text-center text-xs text-muted-foreground mt-1.5">
            {alt}
          </span>
        )}
      </span>
    );
  },

  // ── Table ─────────────────────────────────────
  table({ children }) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="bg-muted/50 px-4 py-2.5 text-left font-medium text-foreground border-b">
        {children}
      </th>
    );
  },
  td({ children }) {
    return <td className="px-4 py-2.5 border-t border-border/50 text-muted-foreground">{children}</td>;
  },

  // ── Blockquote ────────────────────────────────
  blockquote({ children }) {
    return (
      <blockquote className="my-6 border-l-4 border-primary/30 pl-4 py-1 text-muted-foreground italic">
        {children}
      </blockquote>
    );
  },

  // ── Headings ──────────────────────────────────
  h1({ children }) {
    return <h1 className="text-2xl font-bold mt-8 mb-4 tracking-tight">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-xl font-semibold mt-7 mb-3 tracking-tight">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-lg font-medium mt-6 mb-2">{children}</h3>;
  },

  // ── Lists ─────────────────────────────────────
  ul({ children }) {
    return <ul className="my-4 ml-6 list-disc space-y-1.5 text-muted-foreground">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="my-4 ml-6 list-decimal space-y-1.5 text-muted-foreground">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },

  // ── Paragraph ─────────────────────────────────
  p({ children }) {
    return <p className="my-3 leading-relaxed text-foreground/90">{children}</p>;
  },

  // ── Horizontal rule ───────────────────────────
  hr() {
    return <hr className="my-8 border-border/50" />;
  },
};

export function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

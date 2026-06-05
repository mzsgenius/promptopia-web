// fix-md-python.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 << 'PYEOF'
f = "/root/promptopia-web/src/app/case/[slug]/page.tsx"
c = open(f, "r").read()

# 1. Add imports (only if not already there)
if "ReactMarkdown" not in c:
    c = c.replace(
        "import { CaseMetaCard } from '@/components/case/case-meta-card'",
        "import ReactMarkdown from 'react-markdown'\nimport remarkGfm from 'remark-gfm'\nimport { CaseMetaCard } from '@/components/case/case-meta-card'"
    )

# 2. Replace article rendering
old_article = '<article className="prose prose-neutral dark:prose-invert max-w-none mb-8 whitespace-pre-wrap">\n        {c.content}\n      </article>'
new_article = '<article className="prose prose-neutral dark:prose-invert max-w-none mb-8">\n        <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.content}</ReactMarkdown>\n      </article>'

if old_article in c:
    c = c.replace(old_article, new_article)
    open(f, "w").write(c)
    print("REPLACED")
    print("ReactMarkdown:", "ReactMarkdown" in c)
    print("old_article:", old_article in c)
else:
    print("NOT_FOUND")
    print("has ReactMarkdown:", "ReactMarkdown" in c)
PYEOF`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("REPLACED")) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo BUILD_OK'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

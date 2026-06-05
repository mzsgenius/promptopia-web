// fix-md-sed.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd "/root/promptopia-web/src/app/case/[slug]"

# Add import for ReactMarkdown
sed -i "s|import { CaseMetaCard } from|import ReactMarkdown from '"'"'react-markdown'"'"'\\nimport remarkGfm from '"'"'remark-gfm'"'"'\\nimport { CaseMetaCard } from|" page.tsx

# Replace article rendering
sed -i "s|prose prose-neutral dark:prose-invert max-w-none mb-8 whitespace-pre-wrap|prose prose-neutral dark:prose-invert max-w-none mb-8|" page.tsx
sed -i "s|{c.content}|<ReactMarkdown remarkPlugins={[remarkGfm]}>{c.content}<\\/ReactMarkdown>|" page.tsx

grep -c ReactMarkdown page.tsx
echo "SED_DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

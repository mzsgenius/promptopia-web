// fix-simple.mjs
import { Client } from "ssh2";
const c = new Client();

c.on("ready", () => {
  // Step 1: Add imports
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/case/[slug]/page.tsx'
c=open(f).read()
if 'ReactMarkdown' not in c:
  c=c.replace(\"import { CaseMetaCard } from '@/components/case/case-meta-card'\",\"import ReactMarkdown from 'react-markdown'\\nimport remarkGfm from 'remark-gfm'\\nimport { CaseMetaCard } from '@/components/case/case-meta-card'\")
  open(f,'w').write(c)
  print('IMPORTS_DONE')
else:
  print('ALREADY_HAS_IMPORTS')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log("Step 1:", o);
      // Step 2: Replace the article rendering
      c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/case/[slug]/page.tsx'
c=open(f).read()
old='<article className=\"prose prose-neutral dark:prose-invert max-w-none mb-8 whitespace-pre-wrap\">\\n        {c.content}\\n      </article>'
new='<article className=\"prose prose-neutral dark:prose-invert max-w-none mb-8\">\\n        <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.content}</ReactMarkdown>\\n      </article>'
if old in c:
  c=c.replace(old,new)
  open(f,'w').write(c)
  print('ARTICLE_DONE')
else:
  print('ARTICLE_NOT_FOUND')
"`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => {
          console.log("Step 2:", o2);
          // Step 3: Rebuild
          c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo BUILD_OK'`, (e3, s3) => {
            let o3 = "";
            s3.on("data", (d) => o3 += d.toString());
            s3.on("close", () => { console.log("Step 3:", o3.slice(-200)); c.end(); });
          });
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

// fix-all.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  const cmd = `echo Mmzzss060112 | sudo -S bash -c '
python3 << "EOF"
f="/root/promptopia-web/src/app/case/[slug]/page.tsx"
c=open(f).read()
if "ReactMarkdown" not in c:
  c=c.replace("import { CaseMetaCard }","import ReactMarkdown from "+chr(39)+"react-markdown"+chr(39)+"\nimport remarkGfm from "+chr(39)+"remark-gfm"+chr(39)+"\nimport { CaseMetaCard }")
  c=c.replace('whitespace-pre-wrap">','">')
  c=c.replace('{c.content}','<ReactMarkdown remarkPlugins={[remarkGfm]}>{c.content}</ReactMarkdown>')
  open(f,"w").write(c)
  print("OK:ReactMarkdown added")
else:
  print("OK:already had it")
EOF
cd /root/promptopia-web && npm run build 2>&1 | tail -3
pm2 restart promptopia
echo DONE
'`;

  c.exec(cmd, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-400)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

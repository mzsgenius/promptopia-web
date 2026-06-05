// fix-v2.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  // Step 1: Edit file via sudo python3
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/case/[slug]/page.tsx'
c=open(f).read()
if 'ReactMarkdown' not in c:
  c=c.replace('import { CaseMetaCard }','import ReactMarkdown from '+chr(39)+'react-markdown'+chr(39)+chr(10)+'import remarkGfm from '+chr(39)+'remark-gfm'+chr(39)+chr(10)+'import { CaseMetaCard }')
  c=c.replace('whitespace-pre-wrap'+chr(34)+'>',chr(34)+'>')
  c=c.replace('{c.content}','<ReactMarkdown remarkPlugins={[remarkGfm]}>{c.content}</ReactMarkdown>')
  open(f,'w').write(c)
  print('EDITED')
else:
  print('SKIP')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log("Step1:", o);
      // Step 2: Rebuild
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log("Step2:", o2.slice(-200)); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

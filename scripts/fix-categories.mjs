// fix-categories.mjs
import { Client } from "ssh2";
const c = new Client();
const replacement = `const CATEGORIES = [
  { slug: "ai-fuye", name: "AI副业", desc: "赚钱、变现、副业经验", emoji: "💰" },
  { slug: "ai-zidonghua", name: "AI自动化", desc: "办公、流程、效率提升", emoji: "⚡" },
  { slug: "ai-xuexi", name: "AI学习", desc: "编程、工具、技能成长", emoji: "📚" },
  { slug: "ai-xiaolv", name: "AI效率", desc: "工作流、工具链、方法", emoji: "🚀" },
  { slug: "ai-startup", name: "AI创业", desc: "SaaS、产品、融资经验", emoji: "🏢" },
  { slug: "ai-programming", name: "AI编程", desc: "Cursor、AI IDE、开发实战", emoji: "💻" },
  { slug: "ai-agent", name: "AI Agent", desc: "Agent搭建、RAG、自动化", emoji: "🤖" },
  { slug: "ai-workflow", name: "AI工作流", desc: "多工具串联、流程设计", emoji: "🔗" },
];`;

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S sed -i "s|const CATEGORIES = \\[|${replacement}|" /root/promptopia-web/src/app/page.tsx 2>&1 || echo "SED_FAILED"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      if (o.includes("SED_FAILED")) {
        console.log("sed failed, using python approach");
        c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/page.tsx'
c=open(f).read()
old='const CATEGORIES = [\\n  { slug: \"ai-fuye\", name: \"AI副业\", desc: \"赚钱、变现、副业经验\", emoji: \"💰\" },\\n  { slug: \"ai-zidonghua\", name: \"AI自动化\", desc: \"办公、流程、效率提升\", emoji: \"⚡\" },\\n  { slug: \"ai-xuexi\", name: \"AI学习\", desc: \"编程、工具、技能成长\", emoji: \"📚\" },\\n  { slug: \"ai-xiaolv\", name: \"AI效率\", desc: \"工作流、工具链、方法\", emoji: \"🚀\" },\\n  { slug: \"ai-programming\", name: \"AI编程\", desc: \"Cursor、AI IDE、开发实战\", emoji: \"💻\" },\\n];'
new_cats = '''const CATEGORIES = [
  { slug: \"ai-fuye\", name: \"AI副业\", desc: \"赚钱、变现、副业经验\", emoji: \"💰\" },
  { slug: \"ai-zidonghua\", name: \"AI自动化\", desc: \"办公、流程、效率提升\", emoji: \"⚡\" },
  { slug: \"ai-xuexi\", name: \"AI学习\", desc: \"编程、工具、技能成长\", emoji: \"📚\" },
  { slug: \"ai-xiaolv\", name: \"AI效率\", desc: \"工作流、工具链、方法\", emoji: \"🚀\" },
  { slug: \"ai-startup\", name: \"AI创业\", desc: \"SaaS、产品、融资经验\", emoji: \"🏢\" },
  { slug: \"ai-programming\", name: \"AI编程\", desc: \"Cursor、AI IDE、开发实战\", emoji: \"💻\" },
  { slug: \"ai-agent\", name: \"AI Agent\", desc: \"Agent搭建、RAG、自动化\", emoji: \"🤖\" },
  { slug: \"ai-workflow\", name: \"AI工作流\", desc: \"多工具串联、流程设计\", emoji: \"🔗\" },
];'''
if old in c:
    c = c.replace(old, new_cats)
    open(f,'w').write(c)
    print('OK')
else:
    print('OLD_NOT_FOUND')
"`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => {
            console.log(o2);
            if (o2.includes("OK")) {
              c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e3, s3) => {
                let o3 = "";
                s3.on("data", (d) => o3 += d.toString());
                s3.on("close", () => { console.log(o3.slice(-200)); c.end(); });
              });
            } else c.end();
          });
        });
      } else {
        console.log(o);
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
        });
      }
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

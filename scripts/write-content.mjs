// write-content.mjs
import { Client } from "ssh2";
const c = new Client();

const content = `## 什么是 PrompTopia？

**PrompTopia 是一个中文 AI 实战案例社区。** 在这里，用户分享用 AI 工具解决真实问题的完整过程。

> 一句话定位：看别人怎么用 AI 做成事。

---

## 网站功能

### 浏览案例

首页展示最新案例，支持按**分类**和**标签**筛选。

### 发布案例

每篇案例包含标题、分类、标签、摘要、正文和难度。

---

## Markdown 样式展示

### 文字样式

**粗体** *斜体* ~~删除线~~

### 列表

- 无序列表项
- 另一项

1. 有序列表
2. 第二项

### 引用

> 这是一段引用文本。

### 代码

行内：\`console.log("hello")\`

代码块：

\`\`\`javascript
function hello() {
  console.log("Hello PrompTopia!");
}
\`\`\`

### 表格

| 功能 | 状态 |
|------|------|
| 浏览 | ✅ |
| 搜索 | ✅ |

### 分割线

---

### 链接

[PrompTopia](http://promptopia.cn)

---

*PrompTopia 中文AI实战案例社区*`;

const b64 = Buffer.from(content).toString("base64");

c.on("ready", () => {
  c.exec(`base64 -d > /tmp/about-case.md`, (e, stream) => {
    if (e || !stream) { console.error("ERR"); c.end(); return; }
    stream.on("close", () => {
      console.log("Written, now importing...");
      // Now write the import script and run it
      const script = [
        'const { PrismaClient } = require("/root/promptopia-web/src/generated/prisma/client.js");',
        'const { PrismaPg } = require("/root/promptopia-web/node_modules/@prisma/adapter-pg");',
        "const fs = require('fs');",
        "async function main() {",
        "  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });",
        "  const user = await p.user.findFirst();",
        "  const content = fs.readFileSync('/tmp/about-case.md', 'utf-8');",
        "  const c = await p.case.create({",
        "    data: { slug: 'promptopia-gongneng-jieshao-markdown-ceshi', title: 'PrompTopia 功能介绍与Markdown样式测试', category: 'AI效率',",
        "      tags: ['AI','PrompTopia','Markdown'], tools: ['ChatGPT','Cursor'],",
        "      summary: 'PrompTopia功能介绍与Markdown样式展示。', content: content,",
        "      seoKeywords: ['AI案例社区','PrompTopia','Markdown测试'],",
        "      intent: '学习', resultType: '技能', authorId: user.id,",
        "      viewCount: 999, likeCount: 88, bookmarkCount: 66, publishedAt: new Date()",
        "    }",
        "  });",
        "  console.log('OK: ' + c.slug);",
        "  await p.$disconnect();",
        "}",
        "main().catch(function(e) { console.log('ERR: ' + e.message); });"
      ].join("\n");
      
      // Write script to /tmp
      const scriptB64 = Buffer.from(script).toString("base64");
      ss = c.exec(`base64 -d > /tmp/import.js`, (e2, stream2) => {
        if (e2 || !stream2) { console.error("Script upload ERR"); c.end(); return; }
        stream2.on("close", () => {
          console.log("Script uploaded, executing...");
          c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && node /tmp/import.js' 2>&1`, (e3, s3) => {
            let o3 = "";
            s3.on("data", (d) => o3 += d.toString());
            s3.on("close", () => { console.log("Result:", o3); c.end(); });
          });
        });
        stream2.stdin.end(scriptB64);
      });
    });
    stream.stdin.end(b64);
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

// create-about-case.mjs
import { Client } from "ssh2";
const c = new Client();

const article = `## 什么是 PrompTopia？

**PrompTopia 是一个中文 AI 实战案例社区。** 在这里，用户分享自己用 AI 工具解决真实问题的完整过程——从背景、流程、数据到踩坑记录，全部结构化呈现。

> 一句话定位：看别人怎么用 AI 做成事。

---

## 网站功能一览

### 📖 浏览案例

首页展示最新发布的 AI 案例，支持按**分类**和**标签**筛选：

- **分类浏览**：AI副业 / AI自动化 / AI学习 / AI效率 / AI编程 / AI创业
- **标签浏览**：ChatGPT / Cursor / Notion / Claude / Kimi 等热门工具
- **全文搜索**：输入关键词搜索标题、摘要和标签

### ✍️ 发布案例

任何人都可以发布自己的 AI 实战经验。每篇案例包含：

1. **标题** - 吸引人的案例名称
2. **分类** - 选择最匹配的品类
3. **标签** - 标记使用的工具和场景
4. **摘要** - 一句话总结案例
5. **正文** - 详细的 Markdown 内容
6. **难度** - 入门到专家

### 🔍 SEO 收录

每个页面都有独立的：

- Meta 标题和描述
- Open Graph 社交卡片
- Canonical URL
- Sitemap 自动生成

---

## 所有 Markdown 样式展示

### 1. 标题层级

# 一级标题（H1）
## 二级标题（H2）
### 三级标题（H3）
#### 四级标题（H4）
##### 五级标题（H5）
###### 六级标题（H6）

### 2. 文字样式

**粗体文字** 用于强调重要内容。

*斜体文字* 用于标注术语或引用。

~~删除线文字~~ 表示已废弃或修改的内容。

**粗体和*斜体*混合** 使用。

### 3. 列表

无序列表：

- AI 副业案例
- AI 编程案例
- AI 自动化案例
- AI 学习案例

有序列表：

1. 第一步：确定选题
2. 第二步：使用 AI 工具
3. 第三步：整理结果
4. 第四步：发布分享

嵌套列表：

- 前端技术
  - React
    - Next.js
    - Remix
  - Vue
- 后端技术
  - Node.js
  - Python

### 4. 引用块

> 这是单层引用块。用来突出重要观点或引用他人的话。

> 这是多层引用块
>
> > 这是嵌套引用
> >
> > > 这是第三层嵌套

### 5. 代码

行内代码：使用 \`prisma.case.findMany()\` 查询数据库。

多行代码块（JavaScript）：

\`\`\`javascript
// 获取所有已发布的案例
async function getCases() {
  const cases = await prisma.case.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: {
      author: {
        select: { name: true, avatar: true },
      },
    },
  });
  return cases;
}
\`\`\`

多行代码块（Python）：

\`\`\`python
# 数据分析示例
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("cases.csv")
monthly_counts = df.groupby("category").size()
print(monthly_counts)

# 生成柱状图
monthly_counts.plot(kind="bar")
plt.title("各分类案例数量")
plt.show()
\`\`\`

多行代码块（Bash）：

\`\`\`bash
# 部署命令
npm run build
pm2 restart promptopia
pm2 save
\`\`\`

多行代码块（JSON）：

\`\`\`json
{
  "title": "用ChatGPT写小红书文案",
  "category": "AI副业",
  "tags": ["ChatGPT", "小红书", "文案"],
  "income": 3000,
  "difficulty": 2
}
\`\`\`

### 6. 表格

| 分类 | 案例数量 | 平均收入 | 难度 |
|------|---------|---------|------|
| AI副业 | 12 篇 | ¥2,500 | ⭐⭐ |
| AI编程 | 8 篇 | — | ⭐⭐⭐ |
| AI自动化 | 7 篇 | ¥1,800 | ⭐⭐ |
| AI学习 | 5 篇 | — | ⭐ |
| AI效率 | 3 篇 | ¥1,200 | ⭐⭐ |

表格内也可以有**格式**：*斜体* 和 ~~删除线~~ 都支持。

### 7. 分割线

---

（上面是一条分割线）

### 8. 链接

- 网站首页：[http://promptopia.cn](http://promptopia.cn)
- 百度搜索：[https://www.baidu.com](https://www.baidu.com)
- B站教程：[https://bilibili.com](https://bilibili.com)

### 9. 图片

图片使用 Markdown 语法插入：

> 注：当前版本支持外部图片链接。上传功能即将上线。

当页面支持图片后，效果如下：

![示例图片](https://via.placeholder.com/800x400/2563eb/ffffff?text=PrompTopia+Cover)

### 10. 任务列表

- [x] 发布案例
- [x] 浏览案例
- [x] 搜索功能
- [ ] 点赞功能（即将上线）
- [ ] 评论功能（即将上线）
- [ ] 图片上传（即将上线）

### 11. 角标和注释

这是一段带脚注的文字 [^1]。

[^1]: 这是脚注内容，用来补充说明。

### 12. HTML 标签

<div style="padding: 1rem; background: #f0f9ff; border-radius: 0.5rem; border: 1px solid #bae6fd;">

**📢 提示：** PrompTopia 持续更新中，欢迎发布你的 AI 实战案例！

</div>

---

## 平台数据

截至当前，PrompTopia 已经：

| 指标 | 数据 |
|------|------|
| 🗂️ 案例总数 | 35+ 篇 |
| 👥 注册作者 | 1+ 人 |
| 🏷️ 覆盖标签 | 20+ 个 |
| 📂 覆盖分类 | 5 个 |
| 🔧 覆盖工具 | 10+ 个 |

## 常用 AI 工具

本站案例涉及的 AI 工具包括：

\`\`\`
ChatGPT   Cursor   Claude   Notion   Midjourney
Kimi      Zapier   n8n     Dify     Coze
DeepSeek  Copilot  Windsurf Trae    Bolt
\`\`\`

## 案例结构说明

每篇案例包含以下结构化字段：

\`\`\`yaml
标题: 用Cursor开发Chrome插件
分类: AI学习
标签: [Cursor, Chrome, 插件, 开发]
工具: [Cursor]
难度: 3 (中等)
正文: |
  ## 背景问题
  ...
  ## 执行流程
  ...
  ## 踩坑记录
  ...
\`\`\`

---

## 快速上手

**想发布你的第一篇案例？** 按这些步骤操作：

1. 点击顶栏 **「发布案例」** 按钮
2. 填写标题、分类、标签
3. 用 Markdown 书写正文
4. 点击发布

> 💡 **提示：** 正文建议包含背景、流程、结果和踩坑四个部分，这样读者收获最大。

---

*最后更新：2025年6月*  
*PrompTopia · 中文AI实战案例社区*`;

const b64 = Buffer.from(article).toString("base64");

c.on("ready", () => {
  // Get the seed user
  c.exec(`curl -s http://127.0.0.1:3000/api/case/list?pageSize=1 | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d['cases']:
    print('AUTHOR_ID:' + d['cases'][0]['authorId'])
else:
    print('NO_CASES')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      if (o.startsWith("AUTHOR_ID:")) {
        const authorId = o.replace("AUTHOR_ID:", "").trim();
        console.log("Author ID:", authorId);
        
        // Write SQL to insert the case
        const title = "PrompTopia 完整功能介绍与Markdown样式测试页";
        const slug = "promptopia-gongneng-jieshao-markdown-ceshi";
        const sql = `INSERT INTO "Case" (id, slug, title, category, tags, tools, summary, content, "seoKeywords", "authorId", intent, "resultType", "primaryTool", difficulty, lessons, "viewCount", "likeCount", "bookmarkCount", "publishedAt", "createdAt", "updatedAt") VALUES (substr(md5(random()::text),1,25), '${slug}', '${title.replace(/'/g, "''")}', 'AI效率', '["AI","PrompTopia","社区","Markdown"]'::jsonb, '["ChatGPT","Cursor","Claude"]'::jsonb, 'PrompTopia 中文AI实战案例社区的完整功能介绍。包含浏览、发布、搜索、SEO等全部功能说明，以及所有Markdown格式的完整展示。', '${article.replace(/'/g, "''").replace(/\n/g, "\\n").replace(/\\/g, "\\\\")}', '["AI案例社区","PrompTopia","Markdown测试"]'::jsonb, '${authorId}', '学习', '技能', NULL, NULL, NULL, floor(random()*500), floor(random()*100), floor(random()*50), NOW(), NOW(), NOW())`;
        
        c.exec(`echo Mmzzss060112 | sudo -S psql "postgresql://postgres:postgres@localhost:5432/promptopia" -c "${sql.replace(/"/g, '\\"').replace(/\n/g, ' ')}" 2>&1`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log("Insert result:", o2); c.end(); });
        });
      } else {
        console.log("No cases found on server");
        c.end();
      }
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });

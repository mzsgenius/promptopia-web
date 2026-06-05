## 什么是 PrompTopia？

**PrompTopia 是一个中文 AI 实战案例社区。** 在这里，用户分享自己用 AI 工具解决真实问题的完整过程——从背景、流程、数据到踩坑记录，全部结构化呈现。

> 一句话定位：看别人怎么用 AI 做成事。

---

## 网站功能

### 📖 浏览案例

首页展示最新发布的 AI 案例，支持按**分类**和**标签**筛选：

- **分类浏览**：AI副业 / AI自动化 / AI学习 / AI效率 / AI编程 / AI创业
- **标签浏览**：ChatGPT / Cursor / Notion / Claude / Kimi 等
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

每个页面都有独立的 Meta 标题、描述、Open Graph 社交卡片和 Canonical URL。

---

## Markdown 样式展示

### 标题层级

# H1 一级标题
## H2 二级标题
### H3 三级标题
#### H4 四级标题
##### H5 五级标题
###### H6 六级标题

### 文字样式

**粗体文字** 用于强调。

*斜体文字* 用于标注术语。

~~删除线文字~~ 表示废弃内容。

### 列表

无序列表：

- AI 副业案例
- AI 编程案例
- AI 自动化案例

有序列表：

1. 第一步：确定选题
2. 第二步：使用 AI 工具
3. 第三步：整理结果

嵌套列表：

- 前端
  - React
    - Next.js
  - Vue
- 后端
  - Node.js
  - Python

### 引用块

> 单层引用。
>
> > 嵌套引用。

### 代码

行内代码：使用 `prisma.case.findMany()` 查询数据库。

JavaScript 代码块：

```javascript
async function getCases() {
  const cases = await prisma.case.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  return cases;
}
```

Python 代码块：

```python
import pandas as pd
df = pd.read_csv("cases.csv")
print(df.groupby("category").size())
```

Bash 代码块：

```bash
npm run build
pm2 restart promptopia
```

JSON 代码块：

```json
{
  "title": "用ChatGPT写小红书文案",
  "category": "AI副业",
  "income": 3000
}
```

### 表格

| 分类 | 案例数 | 难度 |
|------|--------|------|
| AI副业 | 12 | ⭐⭐ |
| AI编程 | 8 | ⭐⭐⭐ |
| AI自动化 | 7 | ⭐⭐ |
| AI学习 | 5 | ⭐ |

### 分割线

---

### 链接

- 网站：[promptopia.cn](http://promptopia.cn)
- GitHub：搜索 mzsgenius/promptopia-web

### 任务列表

- [x] 浏览案例
- [x] 搜索功能
- [ ] 图片上传（即将上线）
- [ ] 评论功能（即将上线）

---

## 平台数据

| 指标 | 数据 |
|------|------|
| 案例总数 | 35+ 篇 |
| 覆盖标签 | 20+ 个 |
| 覆盖分类 | 5 个 |
| 覆盖工具 | 10+ 个 |

## 常用工具

ChatGPT / Cursor / Claude / Notion / Midjourney / Kimi / Zapier / Dify

---

*PrompTopia · 中文AI实战案例社区*

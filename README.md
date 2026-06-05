# PrompTopia — 中文AI实战案例社区

> 看别人怎么用 AI 做成事。

---

## 项目简介

PrompTopia 是一个中文 AI 实战案例社区。用户可以发布和浏览用 AI 解决真实问题的结构化案例。

核心功能：
- 案例发布（结构化表单 + Markdown 编辑器）
- 案例浏览与搜索
- 分类 / 标签浏览
- GitHub OAuth 登录
- SEO 优化（sitemap + robots + OG + 结构化数据）

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16 App Router + TypeScript |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| 数据库 | PostgreSQL（本地：服务器自建 / 远端：Supabase） |
| ORM | Prisma 7 |
| Auth | Supabase Auth（GitHub OAuth） |
| 部署 | 腾讯云轻量服务器 + Nginx + PM2 |
| Markdown | react-markdown + remark-gfm + rehype-highlight |

---

## 服务器信息

| 项目 | 内容 |
|------|------|
| 服务器 IP | **150.109.70.58** |
| SSH 端口 | 22 |
| SSH 用户名 | ubuntu |
| SSH 密码 | Mmzzss060112 |
| 操作系统 | Ubuntu 22.04 |
| Node.js 版本 | v20.20.0 |
| 项目路径 | /root/promptopia-web |
| 进程管理 | PM2（进程名：promptopia） |
| Web 服务器 | Nginx（端口 80 → 转发到 3000） |

### 登录服务器

```bash
ssh ubuntu@150.109.70.58
# 密码: Mmzzss060112
```

### 查看服务状态

```bash
pm2 status                    # 查看 Next.js 进程
sudo systemctl status nginx   # 查看 Nginx
sudo systemctl status postgresql  # 查看数据库
```

### 重启服务

```bash
# 重启 Next.js
pm2 restart promptopia

# 重启 Nginx
sudo systemctl reload nginx

# 重启 PostgreSQL
sudo systemctl restart postgresql
```

### 查看日志

```bash
pm2 logs promptopia           # 应用日志
sudo tail -f /var/log/nginx/access.log  # Nginx 访问日志
```

---

## 数据库信息

### 本地数据库（当前使用）

| 项目 | 内容 |
|------|------|
| 类型 | PostgreSQL 14 |
| 主机 | localhost |
| 端口 | 5432 |
| 数据库名 | promptopia |
| 用户名 | postgres |
| 密码 | postgres |
| 连接串 | `postgresql://postgres:postgres@localhost:5432/promptopia` |

### Supabase 数据库（备用/远端）

| 项目 | 内容 |
|------|------|
| 项目地址 | https://supabase.com/dashboard/project/rqlyuxjttfjndkmafypm |
| 项目 ID | rqlyuxjttfjndkmafypm |
| 区域 | ap-south-1（印度孟买） |
| 连接串（连接池，端口 6543） | `postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres` |
| 连接串（直连，端口 5432） | `postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@db.rqlyuxjttfjndkmafypm.supabase.co:5432/postgres` |

### 常用数据库命令

```bash
# 连接数据库
psql postgresql://postgres:postgres@localhost:5432/promptopia

# 查看案例数量
SELECT count(*) FROM "Case";

# 查看各分类案例数量
SELECT category, count(*) FROM "Case" GROUP BY category ORDER BY count DESC;

# 删除某个案例
DELETE FROM "Case" WHERE slug = 'xxx';
```

### Prisma 操作

```bash
# 推送 schema 到数据库
cd /root/promptopia-web
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptopia" npx prisma db push

# 生成 Prisma Client
npx prisma generate
```

---

## Supabase Auth

| 项目 | 内容 |
|------|------|
| Project URL | https://rqlyuxjttfjndkmafypm.supabase.co |
| Anon Key | 见 .env 文件 |
| GitHub OAuth Client ID | Ov23lim0eKK4rpur5z7q |
| GitHub OAuth Client Secret | 93d753133e2f8dfc8b44083409db7f82429c7d03 |
| 回调 URL | https://rqlyuxjttfjndkmafypm.supabase.co/auth/v1/callback |

---

## 域名

| 项目 | 内容 |
|------|------|
| 主域名 | promptopia.cn |
| 购买平台 | 腾讯云 |
| DNS 解析 | 腾讯云 DNS |
| A 记录 | 150.109.70.58 |

---

## SEO 相关

| 项目 | 链接/说明 |
|------|----------|
| 网站地址 | http://promptopia.cn |
| sitemap | http://promptopia.cn/sitemap.xml |
| robots.txt | http://promptopia.cn/robots.txt |
| 百度站长 | https://ziyuan.baidu.com |
| Bing Webmaster | https://www.bing.com/webmasters |

---

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页（案例列表 + 搜索）
│   ├── layout.tsx            # 根布局
│   ├── sitemap.ts            # 动态 sitemap
│   ├── robots.ts             # robots.txt
│   ├── login/                # 登录页
│   ├── case/
│   │   ├── [slug]/page.tsx   # 案例详情
│   │   └── new/page.tsx     # 发布案例
│   ├── category/[slug]/      # 分类页
│   └── tag/[slug]/           # 标签页
├── components/
│   ├── case/                 # 案例相关组件
│   └── ui/                   # shadcn/ui 组件
├── lib/
│   ├── prisma.ts             # Prisma 客户端
│   ├── auth.ts               # 用户认证工具
│   └── supabase/             # Supabase 客户端
└── middleware.ts              # Session 刷新
```

---

## 开发命令

```bash
# 本地开发
npm run dev

# 构建
npm run build

# 启动生产
npm run start

# 代码检查
npm run lint

# 添加 shadcn/ui 组件
npx shadcn@latest add [component-name]
```

---

## 环境变量

创建 `.env` 文件，参考 `.env.example`：

| 变量 | 说明 |
|------|------|
| NEXT_PUBLIC_SUPABASE_URL | Supabase 项目 URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase 匿名密钥 |
| DATABASE_URL | 数据库连接串（连接池端口 6543） |
| DIRECT_URL | 数据库直连串（Prisma CLI 用，端口 5432） |
| NEXT_PUBLIC_SITE_URL | 网站 URL |

---

## 导入案例数据

```bash
# 方式1：通过 Node.js 脚本
cd /root/promptopia-web
NODE_PATH=/root/promptopia-web/node_modules node /tmp/import.cjs

# 方式2：直接 SQL
psql postgresql://postgres:postgres@localhost:5432/promptopia -c "INSERT INTO \"Case\"..."
```

---

## 常见问题

**Q: 网站打不开怎么办？**
A: 检查 PM2 状态 `pm2 status`，检查 Nginx `sudo systemctl status nginx`

**Q: 数据库连不上？**
A: 检查 PostgreSQL `sudo systemctl status postgresql`，检查连接串是否正确

**Q: 百度/谷歌搜不到网站？**
A: 新站需要 1-4 周收录，确保 sitemap 已提交

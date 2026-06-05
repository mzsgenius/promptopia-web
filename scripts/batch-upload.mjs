// batch-upload.mjs
import { Client } from "ssh2";
import { readFileSync, writeFileSync, readdirSync } from "fs";

// Define all 17 articles
const articles = [
  { slug: "deepseek-rumen-zhinan", title: "DeepSeek从入门到精通 完整使用指南", tags: ["DeepSeek","AI工具","提示词"], tools: ["DeepSeek"], kw: ["DeepSeek教程","国产AI"], intent: "学习", rt: "技能" },
  { slug: "ai-zuo-ppt-quanliucheng", title: "用AI做PPT全流程 从大纲到成品30分钟", tags: ["通义千问","AI","PPT","Gamma","效率"], tools: ["通义千问","Gamma"], kw: ["AI做PPT","PPT自动生成"], intent: "效率提升", rt: "效率" },
  { slug: "ai-jianli-mianshi", title: "用AI写简历+模拟面试 求职季全攻略", tags: ["通义千问","DeepSeek","简历","面试","求职"], tools: ["通义千问","DeepSeek"], kw: ["AI写简历","AI模拟面试"], intent: "学习", rt: "技能" },
  { slug: "deepseek-vs-tongyi-vs-kimi", title: "DeepSeek vs 通义千问 vs Kimi 国产AI横评", tags: ["DeepSeek","通义千问","Kimi","对比","评测"], tools: ["DeepSeek","通义千问","Kimi"], kw: ["国产AI对比","AI工具横评"], intent: "学习", rt: "技能" },
  { slug: "ai-siweidaotu", title: "用AI做思维导图 从读书笔记到方案策划完整流程", tags: ["AI","思维导图","通义千问","XMind","效率"], tools: ["通义千问","XMind"], kw: ["AI思维导图","AI做笔记"], intent: "效率提升", rt: "效率" },
  { slug: "ai-xiezhen-xiutu", title: "用国产AI做写真+修图 从生成到精修全流程", tags: ["可灵AI","即梦","AI写真","修图","设计"], tools: ["可灵AI","即梦"], kw: ["AI写真","AI修图","国产AI绘画"], intent: "副业", rt: "收入" },
  { slug: "ai-xie-xiaoshuo", title: "用AI写小说 从世界观到完整章节的创作流程", tags: ["DeepSeek","通义千问","写作","小说","创作"], tools: ["DeepSeek","通义千问"], kw: ["AI写小说","AI创作","网文写作"], intent: "副业", rt: "收入" },
  { slug: "ai-dianshang-zhutu", title: "用AI做电商主图 商品图生成到详情页全流程", tags: ["通义万相","可灵AI","电商","设计","主图"], tools: ["通义万相","可灵AI","稿定设计"], kw: ["AI电商主图","AI商品图"], intent: "副业", rt: "收入" },
  { slug: "ai-zhengli-huiyi", title: "用通义听悟+通义千问自动整理会议录音", tags: ["通义听悟","通义千问","会议","效率","办公"], tools: ["通义听悟","通义千问"], kw: ["AI会议纪要","自动整理录音"], intent: "效率提升", rt: "效率" },
  { slug: "ai-qiming", title: "用AI起名取名 从人名到品牌名完整指南", tags: ["通义千问","DeepSeek","起名","取名","品牌"], tools: ["通义千问","DeepSeek"], kw: ["AI起名","AI取名","AI取名"], intent: "效率提升", rt: "效率" },
  { slug: "ai-fanyi-yingyu", title: "用AI学英语 从翻译到口语练习完整方案", tags: ["通义千问","DeepSeek","英语","翻译","学习"], tools: ["通义千问","DeepSeek"], kw: ["AI学英语","AI翻译","英语学习"], intent: "学习", rt: "技能" },
  { slug: "ai-shuju-fenxi", title: "用AI做数据分析 从Excel到可视化报告全流程", tags: ["通义千问","DeepSeek","数据分析","Excel","报表"], tools: ["通义千问","DeepSeek"], kw: ["AI数据分析","AI做报表"], intent: "效率提升", rt: "效率" },
  { slug: "ai-hetong-falv", title: "用AI写合同+审合同 法律文书自动化实战", tags: ["通义千问","DeepSeek","合同","法律","文书"], tools: ["通义千问","DeepSeek"], kw: ["AI写合同","AI审合同","法律AI"], intent: "效率提升", rt: "效率" },
  { slug: "ai-lvyou-gonglve", title: "用AI做旅游攻略 行程规划到预算控制全流程", tags: ["通义千问","DeepSeek","旅游","攻略","规划"], tools: ["通义千问","DeepSeek"], kw: ["AI旅游攻略","AI做攻略"], intent: "效率提升", rt: "效率" },
  { slug: "ai-dushu-biji", title: "用AI做读书笔记 从速读到知识库完整方法", tags: ["通义千问","Kimi","读书","笔记","知识管理"], tools: ["通义千问","Kimi"], kw: ["AI读书笔记","AI速读","知识管理"], intent: "学习", rt: "技能" },
  { slug: "ai-xiaohongshu-fengmian", title: "用AI批量做小红书封面 从文案到设计全自动", tags: ["通义千问","稿定设计","小红书","封面","设计"], tools: ["通义千问","稿定设计"], kw: ["AI小红书封面","AI做封面"], intent: "副业", rt: "收入" },
  { slug: "ai-gongzuo-zongjie", title: "用AI写周报月报年终总结 职场写作全场景", tags: ["通义千问","DeepSeek","周报","总结","职场写作"], tools: ["通义千问","DeepSeek"], kw: ["AI写周报","AI年终总结"], intent: "效率提升", rt: "效率" },
];

// Read all content files
const files = readdirSync("promptopia-web/scripts/articles");
console.log(`Found ${files.length} article files`);

// Check which ones we have
for (const a of articles) {
  const file = `promptopia-web/scripts/articles/${a.slug}.md`;
  try {
    const size = readFileSync(file, "utf-8").length;
    console.log(`  ${a.slug}: ${size} bytes`);
  } catch {
    console.log(`  ${a.slug}: FILE NOT FOUND`);
  }
}

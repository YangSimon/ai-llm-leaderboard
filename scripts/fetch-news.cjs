const https = require('https');
const fs = require('fs');
const path = require('path');

// RSS 源列表
const RSS_SOURCES = [
  { name: 'OpenAI Blog', url: 'https://openai.com/news/rss.xml', category: '产品发布' },
  { name: 'Anthropic Blog', url: 'https://www.anthropic.com/news/rss.xml', category: '产品发布' },
  { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: '技术突破' },
  { name: 'arXiv AI', url: 'https://export.arxiv.org/rss/cs.AI', category: '技术突破' },
  { name: 'arXiv CL', url: 'https://export.arxiv.org/rss/cs.CL', category: '技术突破' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: '技术突破' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: '行业动态' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', category: '产品发布' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: '行业动态' },
  { name: 'Hacker News AI', url: 'https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+Claude+OR+Gemini', category: '行业动态' },
];

// 分类关键词
const CATEGORY_KEYWORDS = {
  '产品发布': ['release', 'launch', '发布', '推出', '上线', 'open', 'announce', '正式发布', '新模型', '旗舰', 'introduce', 'unveil'],
  '技术突破': ['breakthrough', 'research', 'paper', '突破', '研究', '论文', 'benchmark', 'sota', 'state-of-the-art', '新算法', 'architect', 'advance'],
  '开源发布': ['open-source', 'open source', 'github', '开源', 'huggingface', '模型开源', '代码开源'],
  '行业动态': ['fund', 'invest', 'acquire', '融资', '收购', '合作', 'partnership', '估值', 'ipo', '独角兽', 'million', 'billion'],
  '安全对齐': ['safety', 'alignment', 'security', '安全', '对齐', 'regulation', '监管', '伦理'],
};

const CATEGORY_EMOJI = {
  '产品发布': '🚀',
  '技术突破': '🔬',
  '开源发布': '📦',
  '行业动态': '📰',
  '安全对齐': '🛡️',
};

function autoCategorize(title, summary) {
  const text = (title + ' ' + summary).toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) return category;
    }
  }
  return '行业动态';
}

function makeNewsId(title) {
  const crypto = require('crypto');
  return 'news-' + crypto.createHash('md5').update(title).digest('hex').slice(0, 8);
}

function parseRSSDate(dateStr) {
  if (!dateStr) return new Date();
  try {
    return new Date(dateStr);
  } catch {
    return new Date();
  }
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function fetchRSS(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchRSS(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseRSS(xml, sourceName, defaultCategory) {
  const items = [];
  const itemRegex = /<item>[\s\S]*?<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[0];

    const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    const authorMatch = itemXml.match(/<(?:author|dc:creator)>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/(?:author|dc:creator)>/);

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    if (!title) continue;

    let summary = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    summary = summary.replace(/\s+/g, ' ').slice(0, 300);

    const link = linkMatch ? linkMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const author = authorMatch ? authorMatch[1].trim() : sourceName;

    const date = parseRSSDate(pubDate);
    const category = autoCategorize(title, summary);

    items.push({
      id: makeNewsId(title),
      title,
      summary,
      content: summary,
      source: sourceName,
      date: formatDate(date),
      category,
      image: CATEGORY_EMOJI[category] || '📰',
      url: link,
      author: author || sourceName,
      lastUpdated: new Date().toISOString(),
    });
  }

  return items;
}

async function main() {
  console.log('📰 开始获取最新 AI 新闻...\n');
  const allNews = [];

  for (const source of RSS_SOURCES) {
    try {
      console.log(`🔄 正在获取: ${source.name}...`);
      const xml = await fetchRSS(source.url);
      const items = parseRSS(xml, source.name, source.category);
      console.log(`  ✅ ${source.name}: ${items.length} 条新闻`);
      allNews.push(...items);
    } catch (err) {
      console.log(`  ❌ ${source.name}: ${err.message}`);
    }
  }

  // 去重
  const seen = new Set();
  const unique = [];
  for (const news of allNews) {
    const key = news.title.toLowerCase().slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(news);
  }

  // 按日期排序（最新的在前）
  unique.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 保留30天内的
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const filtered = unique.filter(n => new Date(n.date) > cutoff);

  console.log(`\n📊 总计: ${allNews.length} 条原始新闻 -> ${unique.length} 条去重 -> ${filtered.length} 条最终`);

  // 生成 JS 文件
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'news.js');

  let content = '// AI 大模型最新新闻数据 (自动生成)\n';
  content += `// Generated at ${new Date().toISOString()}\n\n`;
  content += 'export const newsData = [\n';

  for (let i = 0; i < filtered.length; i++) {
    const n = filtered[i];
    content += '  {\n';
    content += `    id: '${n.id}',\n`;
    content += `    title: '${n.title.replace(/'/g, "\\'")}',\n`;
    content += `    summary: '${n.summary.replace(/'/g, "\\'")}',\n`;
    content += `    content: '${n.content.replace(/'/g, "\\'")}',\n`;
    content += `    source: '${n.source.replace(/'/g, "\\'")}',\n`;
    content += `    date: '${n.date}',\n`;
    content += `    category: '${n.category}',\n`;
    content += `    image: '${n.image}',\n`;
    content += `    url: '${n.url}',\n`;
    content += `    author: '${n.author.replace(/'/g, "\\'")}',\n`;
    content += `    lastUpdated: '${n.lastUpdated}',\n`;
    content += '  }';
    if (i < filtered.length - 1) content += ',';
    content += '\n';
  }

  content += '];\n\n';
  content += 'export const newsCategories = [\n';
  content += "  { key: 'all', label: '全部' },\n";
  content += "  { key: '产品发布', label: '产品发布' },\n";
  content += "  { key: '技术突破', label: '技术突破' },\n";
  content += "  { key: '开源发布', label: '开源发布' },\n";
  content += "  { key: '行业动态', label: '行业动态' },\n";
  content += "  { key: '行业应用', label: '行业应用' },\n";
  content += "  { key: '行业报告', label: '行业报告' },\n";
  content += '];\n';

  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`\n✅ 新闻数据已保存到: ${outputPath}`);
  console.log(`   共 ${filtered.length} 条新闻`);

  // 显示最新5条
  console.log('\n📰 最新5条新闻:');
  filtered.slice(0, 5).forEach((n, i) => {
    console.log(`  ${i + 1}. [${n.date}] ${n.title} (${n.source})`);
  });
}

main().catch(console.error);

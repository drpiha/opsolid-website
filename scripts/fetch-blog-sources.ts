/**
 * Blog Source Fetcher
 *
 * Fetches latest articles from RSS feeds about automation, AI, and workflow tools.
 * Outputs structured JSON that can be used by the article generator.
 *
 * Usage: npx ts-node scripts/fetch-blog-sources.ts
 * Or called by GitHub Action workflow.
 */

interface FeedSource {
  name: string;
  url: string;
  category: "automation" | "integration" | "ai" | "operations";
}

interface FetchedArticle {
  source: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  category: string;
}

// RSS feeds relevant to automation, workflow, and AI
const FEEDS: FeedSource[] = [
  { name: "n8n Blog", url: "https://blog.n8n.io/rss/", category: "automation" },
  { name: "Zapier Blog", url: "https://zapier.com/blog/feed/", category: "automation" },
  { name: "Make Blog", url: "https://www.make.com/en/blog/rss.xml", category: "automation" },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", category: "ai" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", category: "ai" },
  { name: "Hacker News Best", url: "https://hnrss.org/best?q=automation+OR+workflow+OR+n8n+OR+AI+agent", category: "operations" },
];

// Simple XML RSS parser (no external deps)
function parseRSSItems(xml: string): Array<{ title: string; link: string; pubDate: string; description: string }> {
  const items: Array<{ title: string; link: string; pubDate: string; description: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const getTag = (tag: string) => {
      const m = itemXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return (m?.[1] || m?.[2] || "").trim();
    };

    items.push({
      title: getTag("title"),
      link: getTag("link"),
      pubDate: getTag("pubDate"),
      description: getTag("description").replace(/<[^>]*>/g, "").slice(0, 300),
    });
  }

  return items;
}

async function fetchFeed(source: FeedSource): Promise<FetchedArticle[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: { "User-Agent": "Solidra-BlogBot/1.0" },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`[${source.name}] HTTP ${res.status}`);
      return [];
    }

    const xml = await res.text();
    const items = parseRSSItems(xml);

    return items.slice(0, 5).map((item) => ({
      source: source.name,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.description,
      category: source.category,
    }));
  } catch (err) {
    console.error(`[${source.name}] Fetch failed:`, (err as Error).message);
    return [];
  }
}

async function main() {
  console.log("Fetching blog sources...\n");

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const allArticles: FetchedArticle[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allArticles.push(...result.value);
    }
  });

  // Sort by date (newest first)
  allArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime() || 0;
    const dateB = new Date(b.pubDate).getTime() || 0;
    return dateB - dateA;
  });

  // Take top 10 most recent
  const top = allArticles.slice(0, 10);

  console.log(`Found ${allArticles.length} articles total. Top ${top.length}:\n`);
  top.forEach((a, i) => {
    console.log(`${i + 1}. [${a.source}] ${a.title}`);
    console.log(`   ${a.link}`);
    console.log(`   ${a.description.slice(0, 100)}...`);
    console.log();
  });

  // Output as JSON for the article generator
  const outputPath = process.argv[2] || "scripts/blog-sources.json";
  const fs = await import("fs");
  fs.writeFileSync(outputPath, JSON.stringify(top, null, 2));
  console.log(`\nSaved to ${outputPath}`);
}

main().catch(console.error);

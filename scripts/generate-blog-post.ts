/**
 * Blog Post Generator
 *
 * Takes fetched sources and uses Claude API to generate a blog post
 * in 3 languages (EN, DE, TR), then writes it to the content system.
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 *
 * Usage: npx ts-node scripts/generate-blog-post.ts
 */

import fs from "fs";
import path from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const BLOG_CONTENT_FILE = path.join(__dirname, "../src/content/blog/index.ts");
const SOURCES_FILE = path.join(__dirname, "blog-sources.json");

interface Source {
  source: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  category: string;
}

async function callClaude(prompt: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function main() {
  // Read sources
  if (!fs.existsSync(SOURCES_FILE)) {
    console.error("No sources file found. Run fetch-blog-sources.ts first.");
    process.exit(1);
  }

  const sources: Source[] = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf-8"));
  if (sources.length === 0) {
    console.log("No sources to process.");
    return;
  }

  // Pick the most relevant source
  const source = sources[0];
  console.log(`Generating article based on: "${source.title}" from ${source.source}`);

  // Generate article in 3 languages
  const prompt = `You are a senior technical writer for Solidra, a B2B operational infrastructure company based in Germany.

Based on this source article, write an ORIGINAL blog post (not a copy):

Source: "${source.title}" from ${source.source}
URL: ${source.link}
Summary: ${source.description}

Write the article in this JSON format:
{
  "slug": "short-url-slug",
  "title_en": "English title",
  "title_de": "German title",
  "title_tr": "Turkish title",
  "excerpt_en": "1-2 sentence English excerpt",
  "excerpt_de": "1-2 sentence German excerpt",
  "excerpt_tr": "1-2 sentence Turkish excerpt",
  "category": "${source.category}",
  "readTime": "6",
  "content_en": "<p>Full HTML article in English (600-1000 words)...</p>",
  "content_de": "<p>Full HTML article in German...</p>",
  "content_tr": "<p>Full HTML article in Turkish...</p>"
}

Requirements:
- ORIGINAL content inspired by the source, not copied
- Professional B2B tone, practical advice
- SEO-optimized headings (h2, h3)
- Reference real tools: n8n, Make, Zapier where relevant
- End with CTA mentioning Solidra's services
- German: formal Sie-form, natural business German
- Turkish: formal siz-form, natural business Turkish
- Include the source URL as a reference in the article

Return ONLY valid JSON, no markdown fences.`;

  try {
    const response = await callClaude(prompt);

    // Parse the JSON response
    let article;
    try {
      article = JSON.parse(response);
    } catch {
      // Try to extract JSON if wrapped in markdown
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        article = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse Claude response as JSON");
      }
    }

    const slug = article.slug || slugify(article.title_en);
    const today = new Date().toISOString().split("T")[0];

    // Output the generated article
    const output = {
      slug,
      date: today,
      category: article.category,
      readTime: article.readTime || "6",
      titles: {
        en: article.title_en,
        de: article.title_de,
        tr: article.title_tr,
      },
      excerpts: {
        en: article.excerpt_en,
        de: article.excerpt_de,
        tr: article.excerpt_tr,
      },
      content: {
        en: article.content_en,
        de: article.content_de,
        tr: article.content_tr,
      },
      source: {
        title: source.title,
        url: source.link,
        name: source.source,
      },
    };

    // Save generated article
    const outputPath = path.join(__dirname, `blog-generated-${today}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\nArticle generated and saved to: ${outputPath}`);
    console.log(`Slug: ${slug}`);
    console.log(`Title (EN): ${output.titles.en}`);
    console.log(`Title (DE): ${output.titles.de}`);
    console.log(`Title (TR): ${output.titles.tr}`);
    console.log(`\nTo add to the website, run: npx ts-node scripts/add-blog-post.ts ${outputPath}`);
  } catch (err) {
    console.error("Generation failed:", (err as Error).message);
    process.exit(1);
  }
}

main().catch(console.error);

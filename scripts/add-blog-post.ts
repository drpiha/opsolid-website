/**
 * Add Blog Post to Content System
 *
 * Takes a generated article JSON and adds it to the blog content.
 * Updates en.ts, de.ts, tr.ts post lists and blog/index.ts article map.
 *
 * Usage: npx ts-node scripts/add-blog-post.ts scripts/blog-generated-2026-03-29.json
 */

import fs from "fs";
import path from "path";

interface GeneratedArticle {
  slug: string;
  date: string;
  category: string;
  readTime: string;
  titles: { en: string; de: string; tr: string };
  excerpts: { en: string; de: string; tr: string };
  content: { en: string; de: string; tr: string };
  source: { title: string; url: string; name: string };
}

function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error("Usage: npx ts-node scripts/add-blog-post.ts <path-to-generated-json>");
    process.exit(1);
  }

  if (!fs.existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  const article: GeneratedArticle = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log(`Adding blog post: "${article.titles.en}" (${article.slug})`);

  // 1. Add article content to blog/index.ts
  const blogIndexPath = path.join(__dirname, "../src/content/blog/index.ts");
  let blogIndex = fs.readFileSync(blogIndexPath, "utf-8");

  // Find the line "Object.assign(articles, shortArticles);" and add before it
  const articleEntry = `
  "${article.slug}": {
    en: ${JSON.stringify(article.content.en)},
    de: ${JSON.stringify(article.content.de)},
    tr: ${JSON.stringify(article.content.tr)},
  },`;

  // Add to shortArticles object
  const insertPoint = "// Merge all articles";
  if (blogIndex.includes(insertPoint)) {
    blogIndex = blogIndex.replace(
      insertPoint,
      `${articleEntry}\n};\n\n// Merge all articles`
    );
    // Remove the extra closing brace that was already there
    blogIndex = blogIndex.replace(`${articleEntry}\n};\n\n// Merge all articles\nObject.assign(articles, shortArticles);`, `${articleEntry}\n\n// Merge all articles\nObject.assign(articles, shortArticles);`);
  }

  fs.writeFileSync(blogIndexPath, blogIndex);
  console.log("Updated blog/index.ts with article content.");

  // 2. Print instructions for manual content file update
  console.log("\n--- Manual steps required ---");
  console.log("Add this post entry to src/content/en.ts blog.posts array:");
  console.log(JSON.stringify({
    slug: article.slug,
    title: article.titles.en,
    excerpt: article.excerpts.en,
    category: article.category,
    date: article.date,
    readTime: article.readTime,
  }, null, 2));
  console.log("\nAnd equivalent entries to de.ts and tr.ts with translated titles/excerpts.");
  console.log(`\nSource: ${article.source.name} — ${article.source.url}`);
  console.log("\nDone!");
}

main();

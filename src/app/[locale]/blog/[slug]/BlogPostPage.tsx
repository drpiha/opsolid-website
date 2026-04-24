"use client";

import { LocaleLink as Link } from "@/components/shared/LocaleLink";
import { useLocale } from "@/context/LocaleContext";
import { getPostContent } from "@/content/blog";

interface BlogPostPageProps {
  slug: string;
}

/**
 * Journal post page — industrial-luxury v2 skin.
 * ar-head metadata bar + title + subtitle, ar-body renders the long-form
 * HTML from the existing @/content/blog module, ar-footer shows prev /
 * next navigation.
 */
export function BlogPostPage({ slug }: BlogPostPageProps) {
  const { t, locale } = useLocale();
  const blog = t.blog;

  const postIndex = blog.posts.findIndex((p) => p.slug === slug);
  const postMeta = blog.posts[postIndex];
  const postContent = getPostContent(slug, locale);

  if (!postMeta) return null;

  const prevPost = postIndex > 0 ? blog.posts[postIndex - 1] : null;
  const nextPost =
    postIndex < blog.posts.length - 1 ? blog.posts[postIndex + 1] : null;

  const categoryLabel =
    (blog.categories as Record<string, string>)[postMeta.category] ??
    postMeta.category;

  return (
    <>
      <section className="ar-head" data-screen-label="Article Head">
        <div className="wrap-narrow" style={{ maxWidth: 820 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-400)",
              marginBottom: 20,
            }}
          >
            <Link
              href="/blog"
              style={{ color: "var(--copper-300)", textDecoration: "none" }}
            >
              ← JOURNAL
            </Link>{" "}
            / {categoryLabel.toUpperCase()}
          </div>
          <h1 className="ar-title">{postMeta.title}</h1>
          <p className="ar-sub">{postMeta.excerpt}</p>
          <div className="ar-meta">
            <div className="ar-meta-item">
              <span className="meta">PUBLISHED</span>
              <span style={{ color: "var(--ink-100)" }}>{postMeta.date}</span>
            </div>
            <div className="ar-meta-item">
              <span className="meta">READ</span>
              <span style={{ color: "var(--ink-100)" }}>
                {postMeta.readTime} min
              </span>
            </div>
            <div className="ar-meta-item">
              <span className="meta">CATEGORY</span>
              <span style={{ color: "var(--ink-100)" }}>{categoryLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ar-body">
        <div className="wrap-narrow" style={{ maxWidth: 720 }}>
          {postContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: postContent }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.0625rem",
                lineHeight: 1.7,
                color: "var(--ink-200)",
              }}
            />
          ) : (
            <p className="lead">{postMeta.excerpt}</p>
          )}
        </div>
      </section>

      {(prevPost || nextPost) && (
        <section className="ar-footer">
          <div className="wrap">
            <div className="ar-next-grid">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="ar-next"
                  style={{ textDecoration: "none" }}
                >
                  <div className="ar-next-dir">← PREVIOUS</div>
                  <div className="ar-next-t">{prevPost.title}</div>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="ar-next"
                  style={{ textDecoration: "none", textAlign: "right" }}
                >
                  <div className="ar-next-dir">NEXT →</div>
                  <div className="ar-next-t">{nextPost.title}</div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

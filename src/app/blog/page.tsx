import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Blog | AccessGuard - WCAG Tips, Guides & Best Practices",
  description:
    "Learn about web accessibility, WCAG 2.1 compliance, ADA lawsuits, and how to make your website accessible. Practical guides and actionable tips.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          <span className="text-xl font-bold text-foreground">AccessGuard</span>
        </Link>
        <Link
          href="/"
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Free Scan
        </Link>
      </nav>

      {/* Blog Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-extrabold text-foreground">
          Accessibility Blog
        </h1>
        <p className="text-lg text-muted mt-3">
          Guides, tips, and insights on web accessibility and WCAG compliance.
        </p>
      </section>

      {/* Posts */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <p className="text-muted py-12 text-center">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-gray-100 pb-8"
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="flex items-center gap-3 text-sm text-muted mb-2">
                    <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                    <span>&middot;</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted mt-2 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-50 text-primary px-2.5 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { getPostBySlug, getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | A11yScope Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function sanitizeHtml(html: string): string {
  // Strip dangerous HTML tags and attributes
  return html
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove event handler attributes (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s+on\w+\s*=\s*\S+/gi, "")
    // Remove iframe, object, embed, form tags
    .replace(/<\s*\/?\s*(iframe|object|embed|form|textarea|input|button)\b[^>]*>/gi, "")
    // Remove style tags with content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove base tags (can redirect all relative URLs)
    .replace(/<\s*\/?\s*base\b[^>]*>/gi, "");
}

function renderMarkdown(content: string): string {
  // Simple markdown to HTML renderer
  let html = content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Code blocks
    .replace(
      /```(\w*)\n([\s\S]*?)```/g,
      '<pre class="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-6"><code>$2</code></pre>'
    )
    // Inline code
    .replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 text-red-700 px-1.5 py-0.5 rounded text-sm">$1</code>'
    )
    // Links — block javascript: and data: protocol links, HTML-encode URLs
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match: string, text: string, url: string) => {
        const trimmedUrl = url.trim().toLowerCase();
        if (
          trimmedUrl.startsWith("javascript:") ||
          trimmedUrl.startsWith("data:") ||
          trimmedUrl.startsWith("vbscript:")
        ) {
          return text; // Strip dangerous links, keep text only
        }
        // Encode URL in href attribute to prevent attribute injection
        const safeUrl = escapeHtmlAttr(url.trim());
        const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<a href="${safeUrl}" class="text-primary hover:text-primary-dark underline" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
      }
    )
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs (lines that aren't already wrapped)
    .replace(
      /^(?!<[huplo])(.*\S.*)$/gm,
      '<p class="text-gray-700 leading-relaxed my-4">$1</p>'
    );

  // Wrap consecutive <li> in <ul>
  html = html.replace(
    /(<li class="ml-4">.*?<\/li>\n?)+/g,
    '<ul class="list-disc space-y-2 my-4 pl-4">$&</ul>'
  );

  // Final sanitization pass
  html = sanitizeHtml(html);

  return html;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
          <span className="text-xl font-bold text-foreground">A11yScope</span>
        </Link>
        <Link
          href="/"
          className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Free Scan
        </Link>
      </nav>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pt-12 pb-20">
        <Link
          href="/blog"
          className="text-sm text-muted hover:text-primary transition-colors inline-flex items-center gap-1 mb-8"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-muted mb-3">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
            <span>&middot;</span>
            <span>{post.author}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
            {post.title}
          </h1>
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 text-primary px-2.5 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            Check your website&apos;s accessibility now
          </h3>
          <p className="text-muted">
            Free instant scan. No sign-up required.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Scan Your Website Free
          </Link>
        </div>
      </article>
    </div>
  );
}

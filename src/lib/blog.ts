import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  content: string;
  readingTime: number;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

function parsePost(filename: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");

  // Parse frontmatter
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const content = frontmatterMatch[2].trim();

  const meta: Record<string, string> = {};
  frontmatter.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      meta[key.trim()] = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
    }
  });

  // Calculate reading time (avg 200 wpm)
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    slug: filename.replace(".md", ""),
    title: meta.title || "",
    description: meta.description || "",
    date: meta.date || "",
    author: meta.author || "A11yScope Team",
    tags: meta.tags
      ? meta.tags
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    content,
    readingTime,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map(parsePost)
    .filter(Boolean) as BlogPost[];

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  // Sanitize slug: allow only alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) return null;

  const filename = `${slug}.md`;
  const filePath = path.join(BLOG_DIR, filename);

  // Path traversal protection: ensure resolved path stays within BLOG_DIR
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(BLOG_DIR))) return null;

  if (!fs.existsSync(filePath)) return null;
  return parsePost(filename);
}

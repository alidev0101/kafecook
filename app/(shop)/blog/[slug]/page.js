import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import Breadcrumb from "@/components/shared/Breadcrumb";
import RelatedPosts from "@/components/blog/RelatedPosts";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { formatDate, formatNumber } from "@/lib/utils";
import { Calendar, Clock, Eye, Tag, User, ArrowLeft } from "lucide-react";

const DEFAULT_IMG = "/images/default-product.svg";

const POST_TYPE_LABELS = {
  article:       "مقاله",
  tutorial:      "آموزش",
  news:          "اخبار",
  product_review:"معرفی محصول",
  brewing_guide: "روش دم‌آوری",
};

// ─── Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  try {
    await connectDB();
    const post = await Post.findOne({ slug: params.slug, status: "published" })
      .select("title excerpt featuredImage metaTitle metaDescription publishedAt")
      .lean();

    if (!post) return { title: "مقاله یافت نشد" };

    const title   = post.metaTitle || post.title;
    const desc    = post.metaDescription || post.excerpt || "";
    const imgUrl  = post.featuredImage?.url || null;

    return {
      title,
      description: desc,
      openGraph: {
        title,
        description: desc,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        images: imgUrl ? [{ url: imgUrl, width: 1200, height: 630, alt: post.title }] : [],
      },
      twitter: { card: "summary_large_image", title, description: desc },
    };
  } catch {
    return { title: "کافه کوک | وبلاگ" };
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }) {
  await connectDB();

  const post = await Post.findOneAndUpdate(
    { slug: params.slug, status: "published" },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate("author", "name avatar")
    .populate("category", "name slug color")
    .populate({
      path: "relatedPosts",
      select: "title slug excerpt featuredImage publishedAt readTime category",
      populate: { path: "category", select: "name slug color" },
      match: { status: "published" },
    })
    .lean();

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    image: post.featuredImage?.url || "",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author?.name || "کافه کوک" },
    publisher: {
      "@type": "Organization",
      name: "کافه کوک",
      logo: { "@type": "ImageObject", url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png` },
    },
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero image */}
      {post.featuredImage?.url && (
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden bg-muted">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={() => {}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}

      <div className="container-custom py-8">
        <Breadcrumb
          items={[
            { label: "وبلاگ", href: "/blog" },
            ...(post.category ? [{ label: post.category.name, href: `/blog/category/${post.category.slug}` }] : []),
            { label: post.title },
          ]}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-4">
          {/* ── Main content ── */}
          <article className="flex-1 min-w-0">
            {/* Type + Category tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.postType && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-coffee-100 dark:bg-coffee-900/30 text-coffee-700 dark:text-coffee-300">
                  {POST_TYPE_LABELS[post.postType] || "مقاله"}
                </span>
              )}
              {post.category && (
                <Link
                  href={`/blog/category/${post.category.slug}`}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: post.category.color || "#be7040" }}
                >
                  {post.category.name}
                </Link>
              )}
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Tag size={10} /> {tag}
                </Link>
              ))}
            </div>

            {/* Title */}
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground leading-snug mb-5"
              style={{ fontFamily: "Morabba, Vazirmatn, sans-serif" }}
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-base text-muted-foreground leading-relaxed mb-6 border-r-4 border-coffee-400 pr-4 italic">
                {post.excerpt}
              </p>
            )}

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border mb-8 text-sm text-muted-foreground">
              {post.author && (
                <span className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center font-bold text-xs text-coffee-600">
                    {post.author.name?.[0] || "ک"}
                  </div>
                  <span className="font-medium text-foreground">{post.author.name}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {formatNumber(post.readTime)} دقیقه مطالعه
              </span>
              {post.viewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye size={13} /> {formatNumber(post.viewCount)} بازدید
                </span>
              )}
            </div>

            {/* Article body */}
            <div
              className="prose dark:prose-invert prose-sm md:prose-base max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-foreground prose-p:leading-loose
                prose-a:text-coffee-600 dark:prose-a:text-coffee-400 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-r-4 prose-blockquote:border-coffee-400 prose-blockquote:pr-4 prose-blockquote:not-italic
                prose-img:rounded-2xl prose-img:shadow-card
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                prose-pre:bg-gray-900 prose-pre:rounded-2xl prose-pre:shadow-card
                prose-li:my-0.5 prose-ul:pr-4 prose-ol:pr-4
                [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:mt-6 [&_h3]:mb-3"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags footer */}
            {post.tags?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium ml-2">برچسب‌ها:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-coffee-100 dark:hover:bg-coffee-900/30 hover:text-coffee-700 dark:hover:text-coffee-300 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Back to blog */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-coffee-600 dark:text-coffee-400 hover:underline font-medium"
              >
                <ArrowLeft size={14} /> بازگشت به وبلاگ
              </Link>
            </div>

            {/* Related posts */}
            {post.relatedPosts?.length > 0 && (
              <RelatedPosts posts={post.relatedPosts} />
            )}
          </article>

          {/* ── Sidebar ── */}
          <div className="lg:w-72 flex-shrink-0">
            <BlogSidebar currentSlug={post.slug} categoryId={post.category?._id?.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-generate popular posts at build time
export async function generateStaticParams() {
  try {
    await connectDB();
    const posts = await Post.find({ status: "published" })
      .select("slug")
      .sort({ viewCount: -1 })
      .limit(20)
      .lean();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export const revalidate = 3600; // revalidate every hour

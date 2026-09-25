"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import {
  Save, Globe, FileText, Image as ImageIcon,
  Tag, Settings, X, Upload, Plus, Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RichTextEditor from "@/components/admin/RichTextEditor";

const POST_TYPES = [
  { value: "article",        label: "مقاله عمومی" },
  { value: "tutorial",       label: "آموزشی" },
  { value: "news",           label: "اخبار" },
  { value: "product_review", label: "معرفی محصول" },
  { value: "brewing_guide",  label: "روش دم‌آوری" },
];
import { DEFAULT_IMG } from "@/lib/constants";

export default function PostForm({ post }) {
  const router    = useRouter();
  const qc        = useQueryClient();
  const isEdit    = !!post;

  // ─── State ──────────────────────────────────────────────────────────────
  const [title,           setTitle]           = useState(post?.title           || "");
  const [slug,            setSlug]            = useState(post?.slug            || "");
  const [excerpt,         setExcerpt]         = useState(post?.excerpt         || "");
  const [content,         setContent]         = useState(post?.content         || "");
  const [category,        setCategory]        = useState(post?.category?._id || post?.category || "");
  const [postType,        setPostType]        = useState(post?.postType        || "article");
  const [status,          setStatus]          = useState(post?.status          || "draft");
  const [isFeatured,      setIsFeatured]      = useState(post?.isFeatured      || false);
  const [tags,            setTags]            = useState(post?.tags?.join(", ") || "");
  const [metaTitle,       setMetaTitle]       = useState(post?.metaTitle       || "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
  const [featuredImage,   setFeaturedImage]   = useState(post?.featuredImage   || { url: "", alt: "" });
  const [activeTab,       setActiveTab]       = useState("content");
  const [imgUploading,    setImgUploading]    = useState(false);
  const [slugManual,      setSlugManual]      = useState(isEdit);

  // ─── Queries ─────────────────────────────────────────────────────────────
  const { data: categories } = useQuery({
    queryKey: ["blog-categories-admin"],
    queryFn: () => axios.get("/api/admin/blog-categories").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  // ─── Auto-slug from title ─────────────────────────────────────────────────
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!slugManual) {
      setSlug(
        val
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
          .replace(/-+/g, "-")
      );
    }
    if (!metaTitle) setMetaTitle(val.slice(0, 70));
  };

  // ─── Featured image upload ────────────────────────────────────────────────
  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("حجم فایل نباید بیشتر از ۵ مگابایت باشد"); return; }
    setImgUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await axios.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        setFeaturedImage({ url: data.data.url, alt: title || "" });
        toast.success("تصویر آپلود شد");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در آپلود تصویر");
    } finally {
      setImgUploading(false);
    }
  }, [title]);

  // ─── Save mutation ────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: (payload) =>
      isEdit
        ? axios.put(`/api/admin/posts/${post._id}`, payload).then((r) => r.data)
        : axios.post("/api/admin/posts", payload).then((r) => r.data),
    onSuccess: (data) => {
      toast.success(isEdit ? "مقاله بروزرسانی شد" : "مقاله ایجاد شد");
      qc.invalidateQueries(["admin-posts"]);
      if (!isEdit) router.push(`/admin/blog/${data.data._id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "خطا در ذخیره"),
  });

  const handleSave = (saveStatus) => {
    if (!title.trim())   { toast.error("عنوان مقاله الزامی است"); setActiveTab("content"); return; }
    if (!content.trim()) { toast.error("محتوای مقاله الزامی است"); setActiveTab("content"); return; }

    saveMutation.mutate({
      title: title.trim(),
      slug:  slug.trim() || undefined,
      excerpt: excerpt.trim(),
      content,
      category: category || null,
      postType,
      status: saveStatus ?? status,
      isFeatured,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      featuredImage,
      metaTitle: metaTitle.trim() || title.trim().slice(0, 70),
      metaDescription: metaDescription.trim(),
    });
  };

  const TABS = [
    { id: "content",  label: "محتوا",    icon: FileText  },
    { id: "image",    label: "تصویر",    icon: ImageIcon },
    { id: "settings", label: "تنظیمات",  icon: Settings  },
    { id: "seo",      label: "SEO",      icon: Globe     },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? "ویرایش مقاله" : "مقاله جدید"}
          </h1>
          {isEdit && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{post.slug}</p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave("draft")}
            loading={saveMutation.isPending && status === "draft"}
          >
            <FileText size={14} /> ذخیره پیش‌نویس
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave("published")}
            loading={saveMutation.isPending && status === "published"}
          >
            <Globe size={14} /> انتشار
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
        <Input
          label="عنوان مقاله"
          placeholder="عنوان جذاب و توصیفی بنویسید..."
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
        {/* Slug */}
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            آدرس URL مقاله
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex-shrink-0">/blog/</span>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
              placeholder="my-article-slug"
              dir="ltr"
              className="flex-1 h-9 px-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
            {slugManual && (
              <button
                type="button"
                onClick={() => {
                  setSlugManual(false);
                  setSlug(title.toLowerCase().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-z0-9-]/g, "").replace(/-+/g, "-"));
                }}
                className="text-xs text-coffee-600 dark:text-coffee-400 hover:underline whitespace-nowrap"
              >
                بازسازی
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab panels */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-coffee-600 dark:border-coffee-400 text-coffee-700 dark:text-coffee-300"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Content tab ── */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  خلاصه مقاله
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="چکیده‌ای از مقاله برای نمایش در لیست و SEO..."
                  className="input-custom resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1 text-left">{excerpt.length}/500</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  محتوای مقاله <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="محتوای کامل مقاله را اینجا بنویسید..."
                  minHeight={480}
                />
              </div>
            </div>
          )}

          {/* ── Image tab ── */}
          {activeTab === "image" && (
            <div className="space-y-5">
              <h3 className="font-semibold text-foreground text-sm">تصویر شاخص مقاله</h3>

              {/* Current image */}
              {featuredImage.url ? (
                <div className="relative">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted max-w-xl">
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.alt || "تصویر شاخص"}
                      fill
                      className="object-cover"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                    />
                  </div>
                  <button
                    onClick={() => setFeaturedImage({ url: "", alt: "" })}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <div className="mt-3 max-w-xl">
                    <Input
                      label="متن جایگزین (Alt)"
                      value={featuredImage.alt}
                      onChange={(e) => setFeaturedImage((p) => ({ ...p, alt: e.target.value }))}
                      placeholder="توضیح تصویر برای سئو و دسترسی‌پذیری"
                    />
                  </div>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center aspect-video max-w-xl rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                  imgUploading
                    ? "border-coffee-400 bg-coffee-50 dark:bg-coffee-900/10"
                    : "border-gray-300 dark:border-gray-600 hover:border-coffee-400 hover:bg-coffee-50 dark:hover:bg-coffee-900/10"
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    disabled={imgUploading}
                  />
                  {imgUploading ? (
                    <div className="flex flex-col items-center gap-2 text-coffee-600">
                      <Loader2 size={28} className="animate-spin" />
                      <p className="text-sm">در حال آپلود...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-14 h-14 rounded-2xl bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center">
                        <ImageIcon size={24} className="text-coffee-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-600 dark:text-gray-300 text-sm">تصویر را اینجا بکشید یا کلیک کنید</p>
                        <p className="text-xs mt-1">JPG، PNG یا WebP — حداکثر ۵MB</p>
                      </div>
                    </div>
                  )}
                </label>
              )}

              {/* URL manual */}
              <div className="max-w-xl">
                <Input
                  label="یا آدرس URL تصویر را وارد کنید"
                  value={featuredImage.url}
                  onChange={(e) => setFeaturedImage((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          {/* ── Settings tab ── */}
          {activeTab === "settings" && (
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">دسته‌بندی</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-custom h-11"
                >
                  <option value="">بدون دسته‌بندی</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Post type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">نوع مقاله</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="input-custom h-11"
                >
                  {POST_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="sm:col-span-2">
                <Input
                  label="برچسب‌ها (با کاما جدا کنید)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="قهوه، اسپرسو، دم‌آوری"
                  hint="هر برچسب را با کاما از هم جدا کنید"
                />
                {/* Preview tags */}
                {tags.trim() && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        <Tag size={9} /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-coffee-600 rounded"
                  />
                  <span className="text-sm text-foreground font-medium">مقاله ویژه (Featured)</span>
                </label>
              </div>
            </div>
          )}

          {/* ── SEO tab ── */}
          {activeTab === "seo" && (
            <div className="space-y-5 max-w-2xl">
              <Input
                label="عنوان SEO (Meta Title)"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="عنوان بهینه برای موتورهای جستجو"
                maxLength={70}
                hint={`${metaTitle.length}/70 کاراکتر — توصیه: ۵۰-۶۰ کاراکتر`}
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  توضیحات SEO (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="توضیحات مختصر برای نمایش در نتایج جستجو..."
                  className="input-custom resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                  <span>توصیه: ۱۲۰-۱۵۵ کاراکتر</span>
                  <span>{metaDescription.length}/160</span>
                </p>
              </div>

              {/* Preview card */}
              {(metaTitle || title) && (
                <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2 font-medium">پیش‌نمایش در گوگل:</p>
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium truncate">
                    {metaTitle || title}
                  </div>
                  <div className="text-green-700 dark:text-green-500 text-xs mt-0.5">
                    kafecook.ir › blog › {slug || "article-slug"}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {metaDescription || excerpt || "توضیحات مقاله در اینجا نمایش داده می‌شود..."}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom save buttons */}
      <div className="flex justify-end gap-3 pb-4">
        <Button variant="secondary" onClick={() => router.push("/admin/blog")}>
          انصراف
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSave("draft")}
          loading={saveMutation.isPending}
        >
          <FileText size={14} /> ذخیره پیش‌نویس
        </Button>
        <Button
          onClick={() => handleSave("published")}
          loading={saveMutation.isPending}
        >
          <Globe size={14} />
          {isEdit ? "ذخیره و انتشار" : "انتشار مقاله"}
        </Button>
      </div>
    </div>
  );
}

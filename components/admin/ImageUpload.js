"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { Upload, X, Star, ImagePlus, Loader2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE = "/images/default-product.svg";

/**
 * ImageUpload — کامپوننت مدیریت تصاویر محصول
 * 
 * Props:
 *  images      : آرایه { url, alt, isPrimary }
 *  onChange    : callback(newImages)
 *  maxImages   : حداکثر تعداد (پیش‌فرض: 6)
 */
export default function ImageUpload({ images = [], onChange, maxImages = 6 }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // ─── Upload ─────────────────────────────────────────────────────────
  const handleUpload = useCallback(
    async (files) => {
      if (!files?.length) return;
      if (images.length + files.length > maxImages) {
        toast.error(`حداکثر ${maxImages} تصویر مجاز است`);
        return;
      }

      setUploading(true);
      const uploaded = [];

      for (const file of Array.from(files)) {
        // Client-side validation
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: حجم فایل بیشتر از ۵MB است`);
          continue;
        }
        if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
          toast.error(`${file.name}: فرمت فایل پشتیبانی نمی‌شود`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
          const { data } = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          if (data.success) {
            uploaded.push({ url: data.data.url, alt: file.name.replace(/\.[^.]+$/, ""), isPrimary: false });
          }
        } catch (err) {
          toast.error(err.response?.data?.message || `خطا در آپلود ${file.name}`);
        }
      }

      if (uploaded.length > 0) {
        const newImages = [...images, ...uploaded];
        // اگر هیچ تصویر اصلی ندارد، اولین را primary کن
        if (!newImages.some((img) => img.isPrimary)) {
          newImages[0] = { ...newImages[0], isPrimary: true };
        }
        onChange(newImages);
        toast.success(`${uploaded.length} تصویر آپلود شد`);
      }
      setUploading(false);
    },
    [images, maxImages, onChange]
  );

  // ─── Drag & Drop ──────────────────────────────────────────────────────
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const handleDragOver = (e) => e.preventDefault();

  // ─── Set Primary ─────────────────────────────────────────────────────
  const setPrimary = (index) => {
    const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    onChange(updated);
  };

  // ─── Remove ──────────────────────────────────────────────────────────
  const removeImage = async (index) => {
    const img = images[index];
    // اگر تصویر upload شده (در /uploads/) حذف فایل هم بکن
    if (img.url?.startsWith("/uploads/products/")) {
      const filename = img.url.split("/").pop();
      axios.delete("/api/upload", { data: { filename } }).catch(() => {});
    }

    const updated = images.filter((_, i) => i !== index);
    // اگر primary حذف شد، اولی را primary کن
    if (img.isPrimary && updated.length > 0) {
      updated[0] = { ...updated[0], isPrimary: true };
    }
    onChange(updated);
    toast.success("تصویر حذف شد");
  };

  // ─── Alt text ────────────────────────────────────────────────────────
  const updateAlt = (index, alt) => {
    const updated = images.map((img, i) => (i === index ? { ...img, alt } : img));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Existing Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <ImageCard
              key={img.url + i}
              image={img}
              index={i}
              isPrimary={img.isPrimary}
              onSetPrimary={() => setPrimary(i)}
              onRemove={() => removeImage(i)}
              onAltChange={(alt) => updateAlt(i, alt)}
            />
          ))}
        </div>
      )}

      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !uploading && fileRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
            uploading
              ? "border-coffee-400 bg-coffee-50 dark:bg-coffee-900/20 cursor-wait"
              : "border-gray-300 dark:border-gray-600 hover:border-coffee-400 hover:bg-coffee-50 dark:hover:bg-coffee-900/10"
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <Loader2 size={28} className="text-coffee-500 animate-spin" />
                <p className="text-sm text-coffee-600 dark:text-coffee-400">در حال آپلود...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-coffee-100 dark:bg-coffee-900/30 flex items-center justify-center">
                  <ImagePlus size={22} className="text-coffee-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    تصویر را اینجا بکشید یا کلیک کنید
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    JPG، PNG یا WebP — حداکثر ۵MB — {images.length}/{maxImages} تصویر
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-xs">
          <Upload size={14} className="flex-shrink-0" />
          اگر تصویری آپلود نکنید، تصویر پیش‌فرض نمایش داده می‌شود
        </div>
      )}
    </div>
  );
}

// ─── ImageCard ─────────────────────────────────────────────────────────────
function ImageCard({ image, index, isPrimary, onSetPrimary, onRemove, onAltChange }) {
  const [editingAlt, setEditingAlt] = useState(false);
  const [altValue, setAltValue] = useState(image.alt || "");

  return (
    <div
      className={cn(
        "relative group rounded-2xl overflow-hidden border-2 transition-all",
        isPrimary
          ? "border-coffee-500 shadow-warm"
          : "border-gray-200 dark:border-gray-700 hover:border-coffee-300"
      )}
    >
      {/* Image */}
      <div className="aspect-square relative bg-muted">
        <Image
          src={image.url || DEFAULT_IMAGE}
          alt={image.alt || "تصویر محصول"}
          fill
          className="object-cover"
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
        />
      </div>

      {/* Primary badge */}
      {isPrimary && (
        <div className="absolute top-1.5 right-1.5 bg-coffee-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Star size={9} className="fill-white" /> اصلی
        </div>
      )}

      {/* Overlay actions — visible on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
        {!isPrimary && (
          <button
            type="button"
            onClick={onSetPrimary}
            title="تعیین به عنوان تصویر اصلی"
            className="p-1.5 bg-white/90 rounded-lg text-coffee-600 hover:bg-white transition-colors"
          >
            <Star size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          title="حذف تصویر"
          className="p-1.5 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Alt text editor */}
      <div className="p-1.5 bg-white dark:bg-gray-900">
        {editingAlt ? (
          <input
            autoFocus
            value={altValue}
            onChange={(e) => setAltValue(e.target.value)}
            onBlur={() => { setEditingAlt(false); onAltChange(altValue); }}
            onKeyDown={(e) => { if (e.key === "Enter") { setEditingAlt(false); onAltChange(altValue); } }}
            className="w-full text-[10px] px-1 py-0.5 border border-coffee-300 rounded outline-none bg-background text-foreground"
            placeholder="توضیح تصویر"
          />
        ) : (
          <p
            onClick={() => setEditingAlt(true)}
            className="text-[10px] text-gray-400 dark:text-gray-500 truncate cursor-pointer hover:text-coffee-500 transition-colors text-center"
            title="کلیک برای ویرایش توضیح"
          >
            {altValue || "توضیح..."}
          </p>
        )}
      </div>
    </div>
  );
}

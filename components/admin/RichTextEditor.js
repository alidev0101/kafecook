"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Code2,
  AlignRight, AlignCenter, AlignLeft, AlignJustify,
  Link as LinkIcon, ImageIcon, Minus,
  Undo, Redo, Type, RemoveFormatting,
} from "lucide-react";

/* ─── Toolbar Button ─────────────────────────────────────────────────── */
function ToolBtn({ onClick, active, disabled, title, children, className }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-lg transition-all duration-150 text-sm",
        "hover:bg-coffee-100 dark:hover:bg-coffee-900/30",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-coffee-200 dark:bg-coffee-800 text-coffee-800 dark:text-coffee-200"
          : "text-gray-600 dark:text-gray-400",
        className
      )}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-5 bg-border mx-1 flex-shrink-0" />;
}

/* ─── Main Editor ─────────────────────────────────────────────────────── */
export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "محتوای مقاله را بنویسید...",
  minHeight = 400,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      TextStyle,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-coffee-600 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl max-w-full my-4" },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "outline-none min-h-[inherit] px-5 py-4 text-sm leading-relaxed text-foreground",
          "prose dark:prose-invert prose-sm max-w-none",
          "prose-headings:font-bold prose-headings:text-foreground",
          "prose-p:my-2 prose-li:my-0.5",
          "prose-blockquote:border-r-4 prose-blockquote:border-coffee-400 prose-blockquote:pr-4",
          "prose-code:bg-muted prose-code:px-1.5 prose-code:rounded prose-code:text-xs",
          "prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-4",
          "prose-img:rounded-xl"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value changes (e.g. reset form)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("آدرس لینک:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("آدرس تصویر:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const words = editor.storage.characterCount?.words?.() ?? 0;
  const chars = editor.storage.characterCount?.characters?.() ?? 0;

  return (
    <div className="border border-input rounded-2xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/30 dark:bg-muted/10">

        {/* History */}
        <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo size={14} />
        </ToolBtn>

        <Separator />

        {/* Headings */}
        <ToolBtn title="عنوان H1" active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 size={14} />
        </ToolBtn>
        <ToolBtn title="عنوان H2" active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn title="عنوان H3" active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={14} />
        </ToolBtn>

        <Separator />

        {/* Text style */}
        <ToolBtn title="Bold" active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn title="Italic" active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn title="Underline" active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={14} />
        </ToolBtn>
        <ToolBtn title="Strikethrough" active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={14} />
        </ToolBtn>
        <ToolBtn title="Inline Code" active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={14} />
        </ToolBtn>
        <ToolBtn title="حذف فرمت"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <RemoveFormatting size={14} />
        </ToolBtn>

        <Separator />

        {/* Lists */}
        <ToolBtn title="لیست نقطه‌ای" active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={14} />
        </ToolBtn>
        <ToolBtn title="لیست شماره‌دار" active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={14} />
        </ToolBtn>
        <ToolBtn title="نقل‌قول" active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={14} />
        </ToolBtn>
        <ToolBtn title="کد بلاک" active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code2 size={14} />
        </ToolBtn>

        <Separator />

        {/* Alignment */}
        <ToolBtn title="راست‌چین" active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={14} />
        </ToolBtn>
        <ToolBtn title="وسط‌چین" active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={14} />
        </ToolBtn>
        <ToolBtn title="چپ‌چین" active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={14} />
        </ToolBtn>
        <ToolBtn title="justify" active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <AlignJustify size={14} />
        </ToolBtn>

        <Separator />

        {/* Link & Image */}
        <ToolBtn title="لینک" active={editor.isActive("link")} onClick={addLink}>
          <LinkIcon size={14} />
        </ToolBtn>
        <ToolBtn title="تصویر" onClick={addImage}>
          <ImageIcon size={14} />
        </ToolBtn>
        <ToolBtn title="خط افقی"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={14} />
        </ToolBtn>
      </div>

      {/* ── Content ── */}
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>

      {/* ── Footer stats ── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
        <span>{chars.toLocaleString("fa")} کاراکتر · {words.toLocaleString("fa")} کلمه</span>
        <span>~{Math.max(1, Math.ceil(words / 200)).toLocaleString("fa")} دقیقه مطالعه</span>
      </div>
    </div>
  );
}

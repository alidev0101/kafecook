"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({ isOpen, onClose, title, children, size = "md", className }) {
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18 }}
            className={cn(
              "relative z-10 flex w-full max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-xl sm:max-h-[90dvh] sm:rounded-2xl bg-card border border-border shadow-2xl",
              sizes[size],
              className
            )}
          >
            {title ? (
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:p-5">
                <h2 className="min-w-0 truncate text-sm font-bold text-foreground sm:text-base">{title}</h2>
                <button onClick={onClose} className="shrink-0 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="بستن">
                  <X size={17} />
                </button>
              </div>
            ) : (
              <button onClick={onClose} className="absolute left-3 top-3 z-10 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="بستن">
                <X size={17} />
              </button>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
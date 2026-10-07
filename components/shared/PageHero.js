import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PageHero({ title, subtitle, breadcrumb = [], children }) {
  return (
    <section className="relative overflow-hidden bg-coffee-50 dark:bg-coffee-950 text-coffee-950 dark:text-white pt-20 overflow-x-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-50 via-coffee-100 to-coffee-200 dark:from-coffee-950 dark:via-coffee-900 dark:to-coffee-800" />

        {/* Right glow */}
        <div className="absolute -top-32 -right-28 h-[520px] w-[520px] rounded-full bg-coffee-300/25 dark:bg-coffee-500/15 blur-[120px]" />

        {/* Left glow */}
        <div className="absolute -bottom-36 -left-28 h-[480px] w-[480px] rounded-full bg-amber-400/15 dark:bg-amber-600/10 blur-[120px]" />

        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 dark:bg-coffee-400/5 blur-[140px]" />
    
        {/* Soft dot grid */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30 [background-image:radial-gradient(rgba(88,55,35,0.10)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

        {/* Top subtle highlight */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent dark:from-white/[0.03] dark:to-transparent" />
      </div>

      {/* Bottom border */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-coffee-400/30 dark:via-amber-200/20 to-transparent" />

      <div className="container-custom relative z-10 py-14 md:py-16 text-center">
        {breadcrumb.length > 0 && (
          <nav
            aria-label="breadcrumb"
            className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-[13px] text-coffee-700/70 dark:text-coffee-300/70"
          >
            <Link href="/" className="transition-colors hover:text-coffee-950 dark:hover:text-white">
              خانه
            </Link>

            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronLeft size={13} className="opacity-50" />

                {item.href ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-coffee-950 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-coffee-950/80 dark:text-white/90">
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="font-morabba text-3xl md:text-4xl font-black mb-3 leading-snug text-coffee-950 dark:text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto max-w-xl text-base leading-8 text-coffee-700/75 dark:text-coffee-200/80">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}

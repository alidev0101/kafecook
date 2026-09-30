import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/**
 * Shared glass hero for storefront pages.
 * Dark coffee gradient + aurora orbs + Morabba heading — no client JS needed.
 */
export default function PageHero({ title, subtitle, breadcrumb = [], children }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-800 text-white pt-20">
      {/* orbs + dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[10%] h-80 w-80 rounded-full bg-coffee-600/25 blur-[110px]" />
        <div className="absolute -bottom-28 left-[8%] h-80 w-80 rounded-full bg-amber-700/20 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-60
            [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]
            [background-size:26px_26px]
            [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
      </div>
      {/* bottom hairline */}
      <div aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />

      <div className="container-custom relative z-10 py-14 md:py-16 text-center">
        {breadcrumb.length > 0 && (
          <nav
            aria-label="breadcrumb"
            className="flex items-center justify-center flex-wrap gap-1.5 mb-5 text-[13px] text-coffee-300/70"
          >
            <Link href="/" className="hover:text-white transition-colors">
              خانه
            </Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronLeft size={13} className="opacity-50" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white/90">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="font-morabba text-3xl md:text-4xl font-black mb-3 leading-snug">
          {title}
        </h1>
        {subtitle && (
          <p className="text-coffee-200/80 text-base max-w-xl mx-auto">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}

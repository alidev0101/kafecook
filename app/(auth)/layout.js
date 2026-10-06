import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen  flex items-center justify-center bg-coffee-100">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-coffee-700/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-amber-600/10 blur-3xl" />
      </div>

      <div className="relative min-h-screen lg:grid lg:grid-cols-2 w-full">
        {/* Background Image */}
        <div className="absolute inset-0 lg:relative lg:inset-auto lg:min-h-screen">
          <Image
            src="/images/hero-product-1.jpg"
            alt="کافه کوک"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Dark + Blur Overlay - Mobile */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] lg:hidden" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center mx-2 ">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_8px_18px_-8px_rgba(190,112,64,0.7)] transition-shadow">
                <Image
                  src="/icons/icon-72x72.png"
                  alt="کافه کوک"
                  width={45}
                  height={45}
                />
              </div>

              <div className="block">
                <p className="font-morabba text-3xl font-black leading-tight text-coffee-100 lg:text-coffee-800 dark:text-coffee-200">
                  کافه کوک
                </p>

                <p className="-mt-0.5 text-[9px] leading-tight tracking-wide text-coffee-100 lg:text-coffee-700 dark:text-coffee-400">
                  قهوه تخصصی کرمان
                </p>
              </div>
            </Link>

            {/* Form */}
            <div className="rounded-3xl bg-coffee-950 shadow-2xl">
              {children}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

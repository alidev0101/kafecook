import "./globals.css";
import { Vazirmatn } from "next/font/google";
import Providers from "@/components/shared/Providers";
import { Toaster } from "sonner";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata = {
  metadataBase: appUrl ? new URL(appUrl) : undefined,
  title: {  
    default: "کافه کوک | فروشگاه تخصصی قهوه کرمان",
    template: "%s | کافه کوک",
  },
  description:
    "کافه کوک، بهترین فروشگاه آنلاین قهوه در کرمان. خرید انواع قهوه تخصصی، دان قهوه، قهوه آسیاب شده با بهترین کیفیت و قیمت مناسب.",
  keywords: ["قهوه", "کافه کوک", "کرمان", "دان قهوه", "اسپرسو", "coffee"],
  authors: [{ name: "کافه کوک" }],
  creator: "کافه کوک",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "کافه کوک",
    title: "کافه کوک | فروشگاه تخصصی قهوه کرمان",
    description: "بهترین قهوه‌های تخصصی را از کافه کوک بخرید",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "کافه کوک" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "کافه کوک",
    description: "فروشگاه تخصصی قهوه در کرمان",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-center"
            richColors
            expand={false}
            duration={3000}
            className="dana"
          />
        </Providers>
      </body>
    </html>
  );
}

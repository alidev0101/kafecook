/** @type {import('next').NextConfig} */
const nextConfig = {
  // تمام API routes را dynamic کن (چون از headers/session استفاده می‌کنند)
  // این از خطای "Dynamic server usage" جلوگیری می‌کند
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },
  // غیرفعال کردن static optimization برای API routes
  // (Next.js 14 app router — API routes نیاز به این دارند)
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

module.exports = nextConfig;

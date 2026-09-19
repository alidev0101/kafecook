import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes — require ADMIN role
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const pathname = req.nextUrl.pathname;

        // User protected routes
        const userRoutes = [
          "/profile",
          "/orders",
          "/addresses",
          "/wishlist",
          "/checkout",
          "/payment-result",
        ];

        const isUserRoute = userRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (isUserRoute || pathname.startsWith("/admin")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/addresses/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/payment-result/:path*",
  ],
};

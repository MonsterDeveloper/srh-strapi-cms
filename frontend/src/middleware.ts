import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: "super-secret",
  pages: {
    signIn: "/auth/sign-in",
  },
});
export const config = {
  matcher: [
     /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
     '/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
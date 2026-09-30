// Backend origin. The browser never calls it directly: `/api/*` on this app is proxied there,
// so requests (and, later, auth cookies) stay same-origin. Defaults to the local API in dev only;
// production must set API_URL explicitly.
const apiUrl =
  process.env.API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : undefined);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (!apiUrl) return [];
    return [{ source: "/api/:path*", destination: `${apiUrl.replace(/\/$/, "")}/api/:path*` }];
  },
};

export default nextConfig;

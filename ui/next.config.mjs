// Backend origin. The browser never calls it directly: `/api/*` on this app is proxied there,
// so requests (and, later, auth cookies) stay same-origin. Defaults to the local API in dev only;
// production must set API_URL explicitly.
const apiUrl =
  process.env.API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : undefined);

// CDN serving catalog images (CloudFront); must match the API's ASSETS_BASE_URL. Unset, the API
// returns root-relative `/images/...` URLs, which need no allow-list.
const assetsBaseUrl = process.env.ASSETS_BASE_URL ? new URL(process.env.ASSETS_BASE_URL) : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Only our CDN's catalog images may go through the image optimizer, so it can't be used to
    // fetch (and spend our optimization quota on) arbitrary remote images.
    remotePatterns: assetsBaseUrl
      ? [
          {
            protocol: assetsBaseUrl.protocol.replace(":", ""),
            hostname: assetsBaseUrl.hostname,
            pathname: "/images/**",
          },
        ]
      : [],
  },
  async rewrites() {
    if (!apiUrl) return [];
    return [{ source: "/api/:path*", destination: `${apiUrl.replace(/\/$/, "")}/api/:path*` }];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.k-pullup.com/api/v1";

const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chulbong-kr.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "t1.daumcdn.net",
      },
    ],
  },
};

export default nextConfig;

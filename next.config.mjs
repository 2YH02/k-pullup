/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.k-pullup.com/api/v1/:path*",
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

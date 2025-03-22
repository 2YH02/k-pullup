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
    domains: ["chulbong-kr.s3.amazonaws.com", "t1.daumcdn.net"],
    unoptimized: true,
  },

  async redirects() {
    return [
      {
        source: "/mypage",
        has: [
          {
            type: "host",
            value: "test.k-pullup.com",
          },
        ],
        destination: "https://m.k-pullup.com/me",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "test.k-pullup.com",
          },
        ],
        destination: "https://m.k-pullup.com",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

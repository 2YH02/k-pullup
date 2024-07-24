/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["chulbong-kr.s3.amazonaws.com", "t1.daumcdn.net"],
  },
};

export default nextConfig;

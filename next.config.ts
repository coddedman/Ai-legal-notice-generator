import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mylegalnotice.in',
          },
        ],
        destination: 'https://mylegalnotice.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

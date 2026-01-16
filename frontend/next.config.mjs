/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.minds.org.sg',
        port: '',
        pathname: '/**', // This allows all images from the Minds website
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
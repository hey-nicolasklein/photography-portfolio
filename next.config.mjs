/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "usable-broccoli-a2df028ad2.media.strapiapp.com",
            },
        ],
        unoptimized: false,
    },
};

export default nextConfig;

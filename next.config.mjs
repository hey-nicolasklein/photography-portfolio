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
        // Optimize cache usage to reduce Vercel Image Optimization cache writes
        minimumCacheTTL: 31536000, // 1 year - prevents frequent cache regeneration
        deviceSizes: [640, 750, 828, 1080, 1920], // Reduced from 8 to 5 sizes
        imageSizes: [16, 32, 64, 96, 128, 256, 384], // Optimized for actual usage
        formats: ['image/webp'], // WebP only for better compression
    },
};

export default nextConfig;

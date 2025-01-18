/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Set to false to prevent double socket connections in development
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.externals = [...(config.externals || []), { bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate" }];
        }
        return config;
    }
};

export default nextConfig;
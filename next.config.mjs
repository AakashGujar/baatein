/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.externals = [...(config.externals || []), { bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate" }];
      }
      return config;
    }
  };
  
  module.exports = nextConfig;
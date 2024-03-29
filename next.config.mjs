/** @type {import('next').NextConfig} */
import pwa from "next-pwa";
const withPWA = pwa({
  dest: "public/serviceWorker",
});

const conf = {
  poweredByHeader: false,
  swcMinify: true,
  reactStrictMode: true,
  compress: true,
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};

export default withPWA(conf);

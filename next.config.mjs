/** @type {import('next').NextConfig} */
import pwa from "next-pwa";
const withPWA = pwa({
  dest: "public",
});

const conf = {
  reactStrictMode: true,
};

export default withPWA(conf);

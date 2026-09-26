/** @type {import('next').NextConfig} */
const nextConfig = {
  // "Work" became "Projects"; old links (and shared ?project= links) still land.
  async redirects() {
    return [{ source: "/work", destination: "/projects", permanent: true }];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi open the dev server (e.g. http://192.168.0.7:3001).
  // Without this, Next blocks the page's scripts, so menus and buttons wouldn't work.
  allowedDevOrigins: ["192.168.*.*"],

  // About Me is now part of the Dashboard (below the first screen), so old
  // /about links go there and scroll straight down to it.
  async redirects() {
    return [{ source: "/about", destination: "/#about", permanent: false }];
  },
};

export default nextConfig;

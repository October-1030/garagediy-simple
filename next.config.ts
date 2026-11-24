import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const assetPrefix = process.env.GARAGE_DIY_ASSET_PREFIX ?? "";
const distDir = process.env.GARAGE_DIY_DIST_DIR ?? ".next";

const nextConfig: NextConfig = {
  assetPrefix,
  distDir,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  poweredByHeader: false,
  devIndicators: false,
  agentRules: false,
  logging: {
    incomingRequests: { ignore: [/\/api\/v1\/waitlist\/one-click\//] },
  },
};
export default config;

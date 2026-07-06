import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";

// Static output keeps the dashboard low-bandwidth and easy to host on
// Azure Static Web Apps or any City of Johannesburg static hosting.
// No server runtime is required, which removes vendor lock-in.
export default defineConfig({
  output: "static",
  site: "https://johannesburg-nbs-impact-dashboard.vercel.app",
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    AstroPWA({
      registerType: "autoUpdate",
      workbox: {
        // Cache all static pages, scripts, styles, fonts, and images
        globPatterns: [
          "**/*.{html,css,js,png,jpg,webp,svg,ttf,woff2,json,geojson}",
        ],
        // Cache OpenStreetMap tiles at runtime so the map works offline
        // after the user has viewed it once
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "Johannesburg NbS Impact Dashboard",
        short_name: "SUNCASA Dashboard",
        description: "Communicating the impact of nature-based solutions in Johannesburg",
        theme_color: "#0B3D2E",
        background_color: "#F7F5EF",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
});

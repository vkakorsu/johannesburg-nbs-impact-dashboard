import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// Static output keeps the dashboard low-bandwidth and easy to host on
// Azure Static Web Apps or any City of Johannesburg static hosting.
// No server runtime is required, which removes vendor lock-in.
export default defineConfig({
  output: "static",
  site: "https://suncasa-jukskei.example.org",
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
});

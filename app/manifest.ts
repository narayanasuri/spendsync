import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "SpendSync",
    name: "SpendSync - Expense tracker",
    description: "Personal expense tracker",
    icons: [
      {
        src: "/icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/manifest-icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/manifest-icon-512x512.maskable.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-screenshot.png",
        type: "image/png",
        sizes: "1280x720",
        form_factor: "wide",
        label: "Desktop view of SpendSync",
      },
      {
        src: "screenshots/mobile-screenshot.png",
        type: "image/png",
        sizes: "739x1600",
        form_factor: "narrow",
        label: "Mobile view of SpendSync",
      },
    ],
    theme_color: "#E8E6DE",
    background_color: "#E8E6DE",
    start_url: "/",
    id: "/",
    display: "standalone",
    orientation: "portrait",
    display_override: ["window-controls-overlay", "minimal-ui"],
  }
}

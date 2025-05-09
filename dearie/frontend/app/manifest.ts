import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dearie - 일기기반 정신건강 자가진단 앱",
    short_name: "Dearie",
    description: "일기를 통한 정신건강 자가진단 앱",
    start_url: "/dearie/",
    scope: "/dearie/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f1b29f",
    icons: [
      {
        src: "/dearie/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/dearie/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait",
    categories: ["health", "lifestyle", "productivity"],
  }
}

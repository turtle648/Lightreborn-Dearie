import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { InstallPWA } from "@/components/common/install-pwa"
import { OfflineNotice } from "@/components/common/offline-notice"
import { UpdateNotification } from "@/components/common/update-notification"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dearie - 일기기반 정신건강 자가진단 앱",
  description: "일기를 통한 정신건강 자가진단 앱",
  applicationName: "Dearie",
  appleWebApp: {
    capable: true,
    title: "Dearie",
    statusBarStyle: "default",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#f1b29f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${outfit.variable} font-sans`}>
        {/* 접근성 스킵 링크 */}
        <a href="#main-content" className="skip-link">
          메인 콘텐츠로 건너뛰기
        </a>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {/* 오프라인 알림 */}
          <OfflineNotice />

          {/* 메인 콘텐츠 */}
          <div id="main-content" className="min-h-screen">
            {children}
          </div>

          {/* PWA 설치 프롬프트 */}
          <InstallPWA />

          {/* 업데이트 알림 */}
          <UpdateNotification />
        </ThemeProvider>
      </body>
    </html>
  )
}

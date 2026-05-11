import type { Metadata } from "next";
import { Montserrat, Noto_Sans_TC } from "next/font/google";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GUMAYUSI 台灣應援物統整",
  description: "Fan support items directory for GUMAYUSI in Taiwan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${montserrat.variable} ${notoSansTC.variable}`}
      lang="zh-Hant"
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="site-bg antialiased text-neutral-900">
        {children}
      </body>
    </html>
  );
}

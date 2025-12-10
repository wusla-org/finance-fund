import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { MobileOnboardingCheck } from "@/components/mobile-onboarding-check";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Finance Fund Tracker",
  description: "Track department funds and contributions",
};

export const viewport: Viewport = {
  themeColor: "#e8e4df",
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSans.variable} antialiased`} suppressHydrationWarning>
        <MobileOnboardingCheck />
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

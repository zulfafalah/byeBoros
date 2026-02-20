import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import RegisterSW from "./components/RegisterSW";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#46ec13",
};

export const metadata: Metadata = {
  title: "ByeBoros — Financial Dashboard",
  description:
    "Track your income, expenses, and financial goals with ByeBoros.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ByeBoros",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}

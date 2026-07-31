import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ITDP Decision Workspace",
  description: "India's Trading Decision Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
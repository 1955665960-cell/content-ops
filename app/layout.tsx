import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "多平台智能内容创作与排期管理系统",
  description: "AI 多平台内容运营助手",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
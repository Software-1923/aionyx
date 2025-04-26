import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aionyx | The Ultimate SaaS Platform",
  description: "Powerful tools for your business needs",
  keywords: ["saas", "business", "tools", "productivity", "aionyx"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
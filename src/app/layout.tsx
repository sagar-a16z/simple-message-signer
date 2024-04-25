import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Message Singer",
  description: "Sign and verify text messages for Solana addresses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

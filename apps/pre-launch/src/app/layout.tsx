import type { Metadata } from "next";
import { connection } from "next/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meduzellar — Coming Soon",
  description:
    "A next-generation technology ecosystem that connects people, talent, businesses, and ideas.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Husbandry Tool",
  description: "Animal care and facility management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

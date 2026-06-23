import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coyote Coexistence Council — Living With Coyotes",
  description:
    "A facilitated forum bringing residents, municipal officials, and wildlife experts together to build evidence-based coyote safety plans that protect communities while preserving ecological balance.",
  metadataBase: new URL("https://livingwithcoyotes.org"),
  openGraph: {
    title: "Coyote Coexistence Council",
    description: "Working together to keep our neighborhoods safe and our coyotes wild.",
    url: "https://livingwithcoyotes.org",
    siteName: "Living With Coyotes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Coyote Coexistence Council — Living With Coyotes",
    template: "%s — CCC",
  },
  description:
    "A facilitated forum bringing residents, municipal officials, and wildlife experts together to build evidence-based coyote safety plans that protect communities while preserving ecological balance.",
  metadataBase: new URL("https://livingwithcoyotes.org"),
  openGraph: {
    title: "Coyote Coexistence Council",
    description:
      "Working together to keep our neighborhoods safe and our coyotes wild.",
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* Set theme before paint to avoid a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

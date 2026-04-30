import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PDAM Surya Sembada",
  description: "Perusahaan Daerah Air Minum (PDAM) Surya Sembada Kota Surabaya",
  icons: {
    icon: "/images/logo-pdam.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts@3.46.0/dist/apexcharts.min.js"></script>
      </head>
      <body
        suppressHydrationWarning
        className={`${robotoCondensed.variable} antialiased`}
      >
        <Toaster richColors position="bottom-right" />
        {children}
      </body>
    </html>
  );
}

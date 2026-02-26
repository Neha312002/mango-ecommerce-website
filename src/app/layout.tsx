import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mango Fresh Farm - Premium Organic Mangoes Delivered to Your Door",
    template: "%s | Mango Fresh Farm"
  },
  description: "Shop premium organic mangoes directly from our farm in India. Sustainably grown, hand-picked fresh mangoes with free shipping on orders above ₹50. Order online now!",
  keywords: [
    "organic mangoes",
    "fresh mangoes online",
    "buy mangoes online India",
    "farm fresh mangoes",
    "premium mango delivery",
    "sustainable farming",
    "organic fruit delivery",
    "Indian mangoes",
    "Alphonso mangoes",
    "mango online shopping"
  ],
  authors: [{ name: "Mango Fresh Farm" }],
  creator: "Mango Fresh Farm",
  publisher: "Mango Fresh Farm",
  metadataBase: new URL('https://mangofreshfarm.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mangofreshfarm.com',
    siteName: 'Mango Fresh Farm',
    title: 'Mango Fresh Farm - Premium Organic Mangoes Delivered',
    description: 'Shop premium organic mangoes directly from our farm. Sustainably grown, hand-picked fresh with free shipping on orders above ₹50.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh Organic Mangoes from Mango Fresh Farm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mangofreshfarm',
    creator: '@mangofreshfarm',
    title: 'Mango Fresh Farm - Premium Organic Mangoes',
    description: 'Shop premium organic mangoes directly from our farm. Free shipping on orders above ₹50!',
    images: ['/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add your Google Search Console verification code here
  },
  category: 'food',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

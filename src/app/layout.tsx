import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Creative Developer | Hamza Hesham 😁💙',
  description: 'لعبة التحقيق والجريمة - المحقق | تجربة تحقيق بوليسية كلاسيكية سلسة وممتعة ومبسطة.',
  openGraph: {
    title: 'المحقق | لعبة التحقيق والجريمة',
    description: 'لعبة التحقيق والجريمة - المحقق | تجربة تحقيق بوليسية كلاسيكية سلسة وممتعة ومبسطة.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  // Keep browser zoom available for accessibility and small-screen readability.
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0b0f14] text-[#f2ede4] antialiased selection:bg-[#c5a059] selection:text-black">
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
